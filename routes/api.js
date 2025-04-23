// routes/api.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/mood-recap
router.post('/mood-recap', async (req, res) => {
  const { logs } = req.body;

  if (!logs) {
    return res.status(400).json({ success: false, recap: "Please provide input." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
 // ✅ Must be this format
    const result = await model.generateContent([logs]); // ✅ Input as array
    const text = result.response.text().trim();

    res.json({ success: true, recap: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      success: false,
      recap: "Gemini Error: " + err.message
    });
  }
});

module.exports = router;
