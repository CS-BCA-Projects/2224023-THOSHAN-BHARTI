const express = require('express');
const router = express.Router();
const { generateMoodRecap } = require('../backend/huggingRecap');
require('dotenv').config();
const fetch = require('node-fetch'); // Ensure you have this if not global

// ✅ Mood Recap using huggingRecap.js (flan-t5-base)
router.post('/mood-recap', async (req, res) => {
  const { logs } = req.body;

  if (!logs) {
    return res.status(400).json({ success: false, message: 'No mood log provided' });
  }

  try {
    const recap = await generateMoodRecap(logs);
    res.json({ success: true, recap });
  } catch (error) {
    console.error("Mood Recap Error:", error);
    res.status(500).json({ success: false, recap: "I'm quiet right now. Please try again later 🌿" });
  }
});

// 🌿 Mood Garden with emoji & date
router.post('/add-mood-garden', (req, res) => {
  const { mood, icon } = req.body;
  const date = new Date().toLocaleDateString();
  res.json({ success: true, icon, date });
});

// 🌞 Daily Motivational Quote
router.get('/daily-quote', async (req, res) => {
  const prompt = "Give a short, poetic motivational quote under 20 words.";
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const result = await response.json();
    const quote = result?.[0]?.generated_text?.trim().replace(prompt, '') || "You are growing, even if it's slow 🌱";

    res.json({ success: true, quote });
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ success: false, quote: "Stay grounded. Better days are coming." });
  }
});

module.exports = router;
