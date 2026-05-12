const express = require('express');
const auth = require('../middleware/auth');
const Outfit = require('../models/Outfit');
const ClothingItem = require('../models/ClothingItem');

const router = express.Router();

// Color harmony rules (hue groups)
const COLOR_GROUPS = {
  neutrals: ['white', 'black', 'gray', 'beige', 'cream', 'nude', 'ivory', 'charcoal'],
  warms: ['red', 'orange', 'yellow', 'coral', 'peach', 'rust', 'burgundy'],
  cools: ['blue', 'green', 'purple', 'teal', 'navy', 'mint', 'lavender'],
};

function colorsHarmonize(colors1, colors2) {
  if (!colors1.length || !colors2.length) return true;
  const isNeutral = (c) => COLOR_GROUPS.neutrals.some((n) => c.toLowerCase().includes(n));
  if (colors1.some(isNeutral) || colors2.some(isNeutral)) return true;

  const groupOf = (c) => {
    c = c.toLowerCase();
    for (const [group, list] of Object.entries(COLOR_GROUPS)) {
      if (list.some((l) => c.includes(l))) return group;
    }
    return 'unknown';
  };

  const groups1 = new Set(colors1.map(groupOf));
  const groups2 = new Set(colors2.map(groupOf));

  for (const g of groups1) {
    if (groups2.has(g) || g === 'unknown') return true;
  }
  return false;
}

function generateOutfitSuggestions(items, occasion, count = 6) {
  const filtered = occasion ? items.filter((i) => !i.occasion.length || i.occasion.includes(occasion)) : items;

  const tops = filtered.filter((i) => ['bluze', 'kemishe', 'xhup'].includes(i.category));
  const bottoms = filtered.filter((i) => ['pantallona', 'fustan'].includes(i.category));
  const shoes = filtered.filter((i) => i.category === 'kepuce');
  const accessories = filtered.filter((i) => i.category === 'aksesore');

  const outfits = [];
  const maxTries = 50;
  let tries = 0;

  while (outfits.length < count && tries < maxTries) {
    tries++;
    const top = tops[Math.floor(Math.random() * tops.length)];
    const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    if (!top || !bottom) break;

    if (!colorsHarmonize(top.colors, bottom.colors)) continue;

    const outfitItems = [top, bottom];

    if (shoes.length) {
      const shoe = shoes[Math.floor(Math.random() * shoes.length)];
      if (colorsHarmonize(top.colors, shoe.colors)) outfitItems.push(shoe);
    }

    if (accessories.length && Math.random() > 0.4) {
      const acc = accessories[Math.floor(Math.random() * accessories.length)];
      outfitItems.push(acc);
    }

    const key = outfitItems.map((i) => i._id.toString()).sort().join('-');
    if (!outfits.find((o) => o.key === key)) {
      outfits.push({ key, items: outfitItems });
    }
  }

  return outfits.map((o) => o.items);
}

router.get('/suggest', auth, async (req, res) => {
  try {
    const { occasion, season, count = 6 } = req.query;
    const filter = { userId: req.userId };
    if (season) filter.season = { $in: [season, 'te_gjitha'] };

    const items = await ClothingItem.find(filter);
    const suggestions = generateOutfitSuggestions(items, occasion, Number(count));
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const outfits = await Outfit.find({ userId: req.userId })
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { items, name, occasion, isPublic } = req.body;
    const outfit = await Outfit.create({ userId: req.userId, items, name, occasion, isPublic });
    await outfit.populate('items');
    res.status(201).json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id, userId: req.userId }).populate('items');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, occasion, rating, isPublic } = req.body;
    const outfit = await Outfit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, occasion, rating, isPublic },
      { new: true }
    ).populate('items');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const outfit = await Outfit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
