const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const deleteQueue = require("../config/queue");

const route = express.Router();
const upload = multer({ dest: "uploads/" });

route.post("/convert", upload.single("image"), async (req, res) => {
  try {
    const format = req.body.format; // jpg | jpeg | png | avif | webp

    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      format: format
    });

    // Add deletion job after 5 minutes
    await deleteQueue.add(
      { publicId: uploadRes.public_id },
      { delay: 5 * 60 * 1000 } // 5 min
    );

    return res.json({
      success: true,
      message: "Image converted successfully",
      url: uploadRes.secure_url
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = route;
