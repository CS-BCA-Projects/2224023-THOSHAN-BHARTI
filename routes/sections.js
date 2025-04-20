const express = require('express');
const router = express.Router();

router.get('/sections', (req, res) => {
  res.render('sections', { title: 'Relaxation Sections' });
});

// Route for Peaceful Piano
router.get('/peaceful-piano', (req, res) => {
  res.render('sections/peaceful-piano', {
    title: 'Peaceful Piano',
    videos: [
      { title: 'Soft Piano Melody', videoId: 'x3-w0EHlbJc' },
      { title: 'Relaxing Piano', videoId: 'XULABg_ZcAU' },
      { title: 'Calm Piano Rain', videoId: 'kW1D1Kjc_JA' },
    ]
  });
});

// Repeat for other sections
router.get('/stress-relief', (req, res) => {
  res.render('sections/stress-relief', {
    title: 'Stress Relief',
    videos: [
      { title: 'Chill Sunset Beats', videoId: '5qap5aO4i9A' },
      { title: 'Lo-fi for Anxiety Relief', videoId: 'jfKfPfyJRdk' },
    ]
  });
});

router.get('/rain-sounds', (req, res) => {
  res.render('sections/rain-sounds', {
    title: 'Rain Sounds',
    videos: [
      { title: 'Rainy Night Calm', videoId: 'L1jFLMC8U3g' },
      { title: 'Thunderstorm Sleep', videoId: 'pNtL2XlHg1c' },
    ]
  });
});

router.get('/deep-sleep', (req, res) => {
  res.render('sections/deep-sleep', {
    title: 'Deep Sleep',
    videos: [
      { title: 'Deep Sleep Music', videoId: '6zGQSWib32w' },
      { title: 'Sleep Meditation Sounds', videoId: 'Zq3E9HRujF0' },
    ]
  });
});

module.exports = router;