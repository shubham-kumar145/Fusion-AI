const express = require("express");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const deleteQueue = require("../config/queue");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/remove", upload.single("image"), async (req, res) => {
  const localFiles = [];

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    localFiles.push(req.file.path);

    // ── Step 1: Send to remove.bg ──
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(req.file.path));
    formData.append("size", "auto");

    const removeBgRes = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVEBG_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    // ── Step 2: Save transparent PNG locally ──
    const outputPath = `uploads/removed_${Date.now()}.png`;
    fs.writeFileSync(outputPath, removeBgRes.data);
    localFiles.push(outputPath);

    // ── Step 3: Upload transparent PNG to Cloudinary ──
    const uploadResult = await cloudinary.uploader.upload(outputPath, {
      folder: "background_removed",
      format: "png",
      use_filename: true,
      unique_filename: true,
    });

    // ── Step 4: Schedule auto-delete after 5 min ──
    await deleteQueue.add(
      { publicId: uploadResult.public_id },
      { delay: 5 * 60 * 1000 }
    );

    return res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

  } catch (err) {
    const errData = err?.response?.data?.toString();
    console.error("BG Remove error:", errData || err.message);

    let userMessage = "Failed to remove background. Try again.";
    try {
      const parsed = JSON.parse(errData);
      const code = parsed?.errors?.[0]?.code;
      if (code === "unknown_foreground") {
        userMessage = "No clear subject found. Try a photo with a person, product, or animal.";
      }
    } catch (_) {}

    const status = err?.response?.status;
    if (status === 402) userMessage = "remove.bg credits exhausted. Please top up.";
    if (status === 403) userMessage = "Invalid remove.bg API key.";
    if (status === 400) userMessage = "Invalid image. Please upload a clear JPG or PNG.";

    return res.status(500).json({ success: false, error: userMessage });

  } finally {
    localFiles.forEach((f) => { try { fs.unlinkSync(f); } catch (_) {} });
  }
});

module.exports = router;