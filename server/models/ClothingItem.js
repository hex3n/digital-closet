const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    photoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['bluze', 'pantallona', 'xhup', 'kemishe', 'fustan', 'kepuce', 'aksesore', 'tjeter'],
    },
    colors: [{ type: String }],
    occasion: [{ type: String, enum: ['casual', 'pune', 'formal', 'sport', 'dalje'] }],
    season: [{ type: String, enum: ['vere', 'dimer', 'pranvere_vjeshte', 'te_gjitha'] }],
    brand: { type: String, default: '' },
    notes: { type: String, default: '' },
    usageCount: { type: Number, default: 0 },
    lastWorn: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
