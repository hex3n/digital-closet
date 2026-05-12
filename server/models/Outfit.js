const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],
    name: { type: String, default: '' },
    occasion: { type: String, enum: ['casual', 'pune', 'formal', 'sport', 'dalje'], default: 'casual' },
    rating: { type: Number, min: 1, max: 5, default: null },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Outfit', outfitSchema);
