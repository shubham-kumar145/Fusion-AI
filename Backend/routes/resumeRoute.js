// const express = require("express");
// const multer = require("multer");
// const { analyzeResumeImage } = require("../services/gemini");

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// router.post("/analyze", upload.single("resume"), async (req, res) => {
//   try {
//     console.log("File received:", req.file?.mimetype);

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     if (!req.file.mimetype.startsWith("image/")) {
//       return res.status(400).json({ success: false, message: "Only image files allowed" });
//     }

//     const analysis = await analyzeResumeImage(
//       req.file.buffer,
//       req.file.mimetype
//     );

//     res.json({ success: true, analysis });
//   } catch (error) {
//     console.error("🔥 Resume Analyze Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Resume image analysis failed",
//     });
//   }
// });

// module.exports = router;
