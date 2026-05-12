import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ClothingCard from '../components/ClothingCard';
import { Upload, Wand2, Shirt, Star, TrendingUp, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const OCCASIONS = [
  { value: '', label: 'Të gjitha' },
  { value: 'casual', label: 'Casual' },
  { value: 'pune', label: 'Punë' },
  { value: 'formal', label: 'Formal' },
  { value: 'sport', label: 'Sport' },
  { value: 'dalje', label: 'Dalje' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [activeOccasion, setActiveOccasion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/clothing'), api.get('/outfits')])
      .then(([c, o]) => { setItems(c.data); setOutfits(o.data); })
      .catch(() => toast.error('Gabim gjatë ngarkimit'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeOccasion
    ? items.filter((i) => i.occasion?.includes(activeOccasion))
    : items;

  const recentItems = filtered.slice(0, 8);

  const stats = [
    { icon: Shirt, label: 'Copa rrobash', value: items.length },
    { icon: Star, label: 'Outfit të ruajtura', value: outfits.length },
    { icon: TrendingUp, label: 'Veshur sot', value: items.filter((i) => {
      const today = new Date().toDateString();
      return i.lastWorn && new Date(i.lastWorn).toDateString() === today;
    }).length },
  ];

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Mirëdita, {user?.displayName?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Çfarë do të veshësh sot?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-beige-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-gray-700" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 truncate">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link
          to="/upload"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Shto Rrobë</p>
            <p className="text-sm text-gray-500">Ngarko foto të re</p>
          </div>
        </Link>
        <Link
          to="/outfit-generator"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-beige-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Wand2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Gjenero Outfit</p>
            <p className="text-sm text-gray-500">Kombinime të reja</p>
          </div>
        </Link>
      </div>

      {/* Recent wardrobe */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Garderoba Ime</h2>
          <Link to="/wardrobe" className="text-sm text-gray-500 hover:text-gray-900 font-medium">
            Shiko të gjitha →
          </Link>
        </div>

        {/* Occasion filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {OCCASIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveOccasion(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeOccasion === value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-beige-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card aspect-square animate-pulse bg-beige-100" />
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shirt size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Garderoba është bosh.</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Shto rrobën e parë
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {recentItems.map((item) => (
              <ClothingCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
