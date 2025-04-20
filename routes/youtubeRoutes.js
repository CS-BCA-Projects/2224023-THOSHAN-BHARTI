const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your actual YouTube Data API v3 key
const API_KEY ='AIzaSyCGxlQb2ne_oC1qsUe-pKtSsK2c5c0UQ8Q'; // Ensure this is valid and unrestricted


router.get('/youtube', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        type: 'video',
        videoEmbeddable: 'true',
        maxResults: 12,
        q,
        key: API_KEY,
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    const errorDetails = error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : { message: error.message };
    console.error('YouTube API error:', errorDetails);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from YouTube API',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;