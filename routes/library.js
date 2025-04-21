const express = require('express');
const router = express.Router();
const LibraryItem = require('../models/library');

// ✅ Get user-specific library items
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  const userId = req.session.userId;
  if (!userId) return res.status(401).send('Unauthorized');

  const items = await LibraryItem.find({ userId, type }).sort('-createdAt');
  res.json(items);
});

// ✅ Add a song to playlist/favorites/history
router.post('/add', async (req, res) => {
  const { title, videoId, thumbnail, type } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).send('Unauthorized');

  // For history: remove duplicates, limit to 15
  if (type === 'history') {
    await LibraryItem.deleteMany({ userId, videoId, type });
    const count = await LibraryItem.countDocuments({ userId, type });
    if (count >= 15) {
      const oldest = await LibraryItem.findOne({ userId, type }).sort('createdAt');
      await LibraryItem.findByIdAndDelete(oldest._id);
    }
  }

  const newItem = new LibraryItem({ userId, title, videoId, thumbnail, type, playedAt: new Date() });
  await newItem.save();
  res.json({ success: true });
});

// ✅ Remove an item
router.delete('/:type/:videoId', async (req, res) => {
  const { type, videoId } = req.params;
  const userId = req.session.userId;
  await LibraryItem.deleteOne({ userId, type, videoId });
  res.json({ success: true });
});

module.exports = router;
