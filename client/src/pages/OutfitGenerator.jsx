import { useState, useEffect } from 'react';
import api from '../utils/api';
import OutfitCard from '../components/OutfitCard';
import toast from 'react-hot-toast';
import { Wand2, RefreshCw, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';

const OCCASIONS = [
  { value: '', label: 'Çdo rast' },
  { value: 'casual', label: 'Casual' },
  { value: 'pune', label: 'Punë' },
  { value: 'formal', label: 'Formal' },
  { value: 'sport', label: 'Sport' },
  { value: 'dalje', label: 'Dalje' },
];

const SEASONS = [
  { value: '', label: 'Çdo stinë' },
  { value: 'vere', label: 'Verë' },
  { value: 'dimer', label: 'Dimër' },
  { value: 'pranvere_vjeshte', label: 'Pranverë/Vjeshtë' },
  { value: 'te_gjitha', label: 'Të gjitha' },
];

export default function OutfitGenerator() {
  const [suggestions, setSuggestions] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ occasion: '', season: '' });
  const [wardrobeCount, setWardrobeCount] = useState(null);

  useEffect(() => {
    api.get('/clothing').then((r) => setWardrobeCount(r.data.length)).catch(() => {});
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const params = { count: 6 };
      if (filters.occasion) params.occasion = filters.occasion;
      if (filters.season) params.season = filters.season;
      const { data } = await api.get('/outfits/suggest', { params });
      setSuggestions(data);
      setSavedIds(new Set());
      if (data.length === 0) toast('Nuk u gjetën kombinime. Provo të shtosh më shumë rrobë!', { icon: '👗' });
    } catch {
      toast.error('Gabim gjatë gjenerimit');
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (items, index) => {
    try {
      await api.post('/outfits', {
        items: items.map((i) => i._id),
        occasion: filters.occasion || 'casual',
        name: `Outfit ${new Date().toLocaleDateString('sq')}`,
      });
      setSavedIds((prev) => new Set([...prev, index]));
      toast.success('Outfit u ruajt!');
    } catch {
      toast.error('Gabim gjatë ruajtjes');
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Outfit Generator</h1>
        <p className="text-gray-500 mt-1">Kombinime të sugjeruara nga garderoba jote</p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Filtrat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="label">Rasti</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, occasion: value })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.occasion === value
                      ? 'bg-gray-900 text-white'
                      : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Stina</label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, season: value })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.season === value
                      ? 'bg-gray-900 text-white'
                      : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <><RefreshCw size={16} className="animate-spin" /> Duke gjeneruar...</>
            ) : (
              <><Wand2 size={16} /> Gjenero Outfit-e</>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {wardrobeCount !== null && wardrobeCount < 4 && (
        <div className="card p-6 text-center mb-8 border-dashed border-2 border-beige-300">
          <Shirt size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Garderoba ka pak cope</p>
          <p className="text-sm text-gray-500 mb-4">
            Shto të paktën 4-6 rrobë (bluzë, pantallona, këpucë) për të marrë sugjerime.
          </p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
            Shto Rrobë
          </Link>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{suggestions.length} kombinime të gjetura</h2>
            <button onClick={generate} className="btn-ghost flex items-center gap-1.5 text-sm">
              <RefreshCw size={14} /> Rifresko
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {suggestions.map((items, i) => (
              <OutfitCard
                key={i}
                items={items}
                occasion={filters.occasion}
                onSave={() => saveOutfit(items, i)}
                saved={savedIds.has(i)}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && suggestions.length === 0 && wardrobeCount >= 4 && (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500">Kliko "Gjenero Outfit-e" për të filluar!</p>
        </div>
      )}
    </div>
  );
}
