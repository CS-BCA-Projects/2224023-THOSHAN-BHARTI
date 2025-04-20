const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/user');
require('dotenv').config();

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Helper to generate content
async function generateGemini(prompt, maxTokens = 100) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    return result.response.text().split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('🔴 Gemini error:', error.message);
    return null;
  }
}

// 🔄 Mock fallback if Gemini fails
function mockInsights(mood) {
  return {
    patternAnalysis: [
      `${mood} is often linked with improved mental clarity.`,
      `People feeling ${mood} tend to maintain better habits.`,
      `${mood} today may suggest stronger social motivation.`
    ],
    recommendations: [
      `Write a short journal entry about your ${mood} mood.`,
      `Do something creative while you're feeling ${mood}.`,
      `Drink water and go outside to reinforce ${mood}.`
    ],
    moodPrediction: `You may feel positive tomorrow with 72% confidence.`
  };
}

// 🧠 Mood Tracker Page (default current week)
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const user = await User.findById(req.session.user._id).lean();
  const moodHistory = user?.moodHistory || [];
  res.render('moodTracker', { user, moodHistory });
});

// 📅 Mood Tracker: Fetch moods for specific week
router.get('/week', async (req, res) => {
  const { start } = req.query;
  try {
    const user = await User.findById(req.session.user._id).lean();
    const moodHistory = user?.moodHistory || [];
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const filtered = moodHistory.filter(entry => {
      const date = new Date(entry.date);
      return date >= startDate && date <= endDate;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch week data' });
  }
});

// 📆 Fetch recent entries (latest 5)
router.get('/recent', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).lean();
    const sorted = user.moodHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load recent moods' });
  }
});

// 🌟 AI Insights Endpoint — Gemini-powered
router.post('/ai-insights', async (req, res) => {
  const { mood } = req.body;
  console.log(`📩 AI insight request for mood: ${mood} at ${new Date().toISOString()}`);

  if (!mood) return res.status(400).json({ error: 'Mood is required' });

  let insights = {
    patternAnalysis: [],
    recommendations: [],
    moodPrediction: ''
  };

  try {
    const patternPrompt = `Give 3 short mood pattern insights for someone feeling ${mood}. Each insight should be 1 sentence.`;
    const pattern = await generateGemini(patternPrompt);
    insights.patternAnalysis = pattern || mockInsights(mood).patternAnalysis;

    const recPrompt = `Provide 3 actionable recommendations for someone feeling ${mood} today. Each should be 1 sentence.`;
    const recs = await generateGemini(recPrompt);
    insights.recommendations = recs || mockInsights(mood).recommendations;

    const predPrompt = `Predict tomorrow's mood for someone feeling ${mood} today. Output 1 sentence with a mood and a confidence percentage.`;
    const pred = await generateGemini(predPrompt, 50);
    insights.moodPrediction = pred?.[0] || mockInsights(mood).moodPrediction;

    console.log('✅ Gemini AI insights:', JSON.stringify(insights));
    res.json(insights);
  } catch (err) {
    console.error('🔥 Internal error:', err.message);
    res.status(500).json({ error: 'AI insights failed', details: err.message });
  }
});

// 🔒 Save Mood to DB
router.post('/mood-tracker', async (req, res) => {
  if (!req.session.user) {
    console.error('User not authenticated at', new Date().toISOString());
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { mood, notes, date } = req.body;
  console.log(`💾 Saving mood: ${mood}, notes: ${notes}, date: ${date} at ${new Date().toISOString()}`);

  try {
    const user = await User.findById(req.session.user._id);
    const entryDate = date ? new Date(date) : new Date();
    user.moodHistory.push({ date: entryDate, mood, notes });
    await user.save();

    req.session.user = user;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error saving mood:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to save mood', details: error.message });
  }
});

async function generateGemini(prompt, maxTokens = 100) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    return result.response.text().split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('🔴 Gemini error:', error.message);
    return null;
  }
}

function mockInsights(mood = "your mood") {
  return {
    patternAnalysis: [
      `${mood} is often linked with improved mental clarity.`,
      `People feeling ${mood} tend to maintain better habits.`,
      `${mood} today may suggest stronger social motivation.`
    ],
    recommendations: [
      `Write a short journal entry about your ${mood} mood.`,
      `Do something creative while you're feeling ${mood}.`,
      `Drink water and go outside to reinforce ${mood}.`
    ],
    moodPrediction: `You may feel positive tomorrow with 72% confidence.`
  };
}

router.post('/ai-insights-summary', async (req, res) => {
    const { start, end } = req.body;
  
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
  
    try {
      const user = await User.findById(req.session.user._id).lean();
      const rangeMoods = user.moodHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(start) && entryDate <= new Date(end);
      });
  
      if (rangeMoods.length === 0) {
        return res.status(200).json({
          patternAnalysis: ['No mood entries in this range.'],
          recommendations: ['Try logging moods regularly.'],
          moodPrediction: 'Insufficient data for prediction.'
        });
      }
  
      const summaryText = rangeMoods.map(e => `${e.mood}: ${e.notes || 'no note'}`).join('\n');
      const prompt = `You are a mental health assistant. Analyze this user's mood history:\n${summaryText}\n\nProvide:\n1. Three bullet points analyzing the patterns.\n2. Three bullet points of personalized recommendations.\n3. A mood prediction for tomorrow (1 sentence).`;
  
      const aiResponse = await generateGemini(prompt);
      if (!aiResponse) {
        return res.status(500).json({
          error: "Gemini failed to generate insights. Try again later."
        });
      }
  
      res.json({
        patternAnalysis: aiResponse.slice(0, 3),
        recommendations: aiResponse.slice(3, 6),
        moodPrediction: aiResponse[6],
        dailyMoods: rangeMoods.map(entry => ({
          date: entry.date,
          mood: entry.mood
        }))
      });
    } catch (err) {
      console.error("Gemini AI error:", err.message);
      res.status(500).json({ error: "AI analysis failed", details: err.message });
    }
  });

module.exports = router;