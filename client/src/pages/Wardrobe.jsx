import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ClothingCard from '../components/ClothingCard';
import toast from 'react-hot-toast';
import { Plus, Search, SlidersHorizontal, Shirt } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Të gjitha' },
  { value: 'bluze', label: 'Bluzë' },
  { value: 'pantallona', label: 'Pantallona' },
  { value: 'xhup', label: 'Xhup' },
  { value: 'kemishe', label: 'Këmishë' },
  { value: 'fustan', label: 'Fustan' },
  { value: 'kepuce', label: 'Këpucë' },
  { value: 'aksesore', label: 'Aksesorë' },
];

const OCCASIONS = [
  { value: '', label: 'Çdo rast' },
  { value: 'casual', label: 'Casual' },
  { value: 'pune', label: 'Punë' },
  { value: 'formal', label: 'Formal' },
  { value: 'sport', label: 'Sport' },
  { value: 'dalje', label: 'Dalje' },
];

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [occasion, setOccasion] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (occasion) params.occasion = occasion;
      if (search) params.search = search;
      const { data } = await api.get('/clothing', { params });
      setItems(data);
    } catch {
      toast.error('Gabim gjatë ngarkimit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [category, occasion]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Je i sigurt që dëshiron ta fshish këtë rrobë?')) return;
    try {
      await api.delete(`/clothing/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('U fshi me sukses');
    } catch {
      toast.error('Gabim gjatë fshirjes');
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Garderoba Ime</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} cope rrobash</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Shto
        </Link>
      </div>

      {/* Search + filters */}
      <div className="card p-4 mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Kërko sipas markës ose shënimeve..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  category === value
                    ? 'bg-gray-900 text-white'
                    : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {OCCASIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setOccasion(value)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                occasion === value
                  ? 'bg-gray-900 text-white'
                  : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card aspect-square animate-pulse bg-beige-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shirt size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mb-2">Asnjë rrobë nuk u gjet.</p>
          <p className="text-sm text-gray-400 mb-6">Provo të ndryshosh filtrat ose shto rrobë të re.</p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Shto Rrobë
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <ClothingCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
