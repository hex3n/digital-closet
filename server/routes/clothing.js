const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const auth = require('../middleware/auth');
const ClothingItem = require('../models/ClothingItem');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'digital-closet', transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }] },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

router.get('/', auth, async (req, res) => {
  try {
    const { category, occasion, season, search } = req.query;
    const filter = { userId: req.userId };
    if (category) filter.category = category;
    if (occasion) filter.occasion = occasion;
    if (season) filter.season = season;
    if (search) filter.$or = [{ brand: new RegExp(search, 'i') }, { notes: new RegExp(search, 'i') }];

    const items = await ClothingItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Photo is required' });

    const { category, colors, occasion, season, brand, notes } = req.body;

    const result = await uploadToCloudinary(req.file.buffer);
    const thumbnailUrl = result.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill/');

    const item = await ClothingItem.create({
      userId: req.userId,
      photoUrl: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      category,
      colors: colors ? JSON.parse(colors) : [],
      occasion: occasion ? JSON.parse(occasion) : [],
      season: season ? JSON.parse(season) : [],
      brand: brand || '',
      notes: notes || '',
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { category, colors, occasion, season, brand, notes } = req.body;
    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { category, colors, occasion, season, brand, notes },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId).catch(() => {});
    }

    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/wear', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $inc: { usageCount: 1 }, lastWorn: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
