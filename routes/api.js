const express = require('express');
const router = express.Router();
const { generateMoodRecap } = require('../backend/huggingRecap');
require('dotenv').config();

router.post('/mood-recap', async (req, res) => {
  const { logs } = req.body;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: logs,
        parameters: {
          temperature: 0.85,
          top_p: 0.95,
          max_new_tokens: 250,
          repetition_penalty: 1.1
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ success: false, error: `Hugging Face API error: ${response.status} - ${errorText}` });
    }

    const result = await response.json();
    const rawText = result?.[0]?.generated_text || '';
    const output = rawText.includes('Companion:')
      ? rawText.split('Companion:').pop().trim()
      : rawText.trim();

    res.json({ success: true, recap: output });
  } catch (error) {
    console.error("Mixtral Chat Error:", error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Mood Garden with Dates ---
router.post('/add-mood-garden', (req, res) => {
  const { mood, icon } = req.body;
  const date = new Date().toLocaleDateString();
  res.json({ success: true, icon, date });
});


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


