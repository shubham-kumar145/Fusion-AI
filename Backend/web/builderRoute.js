


const express = require("express");
const router = express.Router();

const getAIResponse = require("../services/geminiweb");

// POST: /api/builder/generate
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing!" });
    }

    const aiInput = JSON.stringify({ messagetext: prompt });

    const response = await getAIResponse(aiInput);

    res.json({ response });
  } catch (err) {
    console.error("Builder Route Error:", err);
    res.status(500).json({ error: "Gemini builder failed." });
  }
});

module.exports = router;
