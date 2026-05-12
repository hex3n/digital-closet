import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft, Star } from 'lucide-react';

const CATEGORY_LABELS = {
  bluze: 'Bluzë', pantallona: 'Pantallona', xhup: 'Xhup',
  kemishe: 'Këmishë', fustan: 'Fustan', kepuce: 'Këpucë',
  aksesore: 'Aksesorë', tjeter: 'Tjetër',
};

export default function OutfitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    api.get(`/outfits/${id}`)
      .then((r) => { setOutfit(r.data); setRating(r.data.rating || 0); })
      .catch(() => { toast.error('Outfit nuk u gjet'); navigate('/outfits'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Je i sigurt?')) return;
    await api.delete(`/outfits/${id}`);
    toast.success('Outfit u fshi');
    navigate('/dashboard');
  };

  const handleRate = async (r) => {
    setRating(r);
    await api.put(`/outfits/${id}`, { rating: r });
    toast.success('Vlerësimi u ruajt');
  };

  if (loading) return (
    <div className="page-container flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!outfit) return null;

  return (
    <div className="page-container max-w-2xl">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} /> Kthehu
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{outfit.name || 'Outfit'}</h1>
          {outfit.occasion && <p className="text-gray-500 capitalize mt-1">{outfit.occasion}</p>}
          <p className="text-xs text-gray-400 mt-1">{new Date(outfit.createdAt).toLocaleDateString('sq')}</p>
        </div>
        <button onClick={handleDelete} className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Rating */}
      <div className="card p-4 flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-700">Vlerëso:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((r) => (
            <button key={r} onClick={() => handleRate(r)}>
              <Star size={22} className={r <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
            </button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        {outfit.items.map((item) => (
          <div key={item._id} className="card overflow-hidden">
            <div className="aspect-square bg-beige-50">
              <img src={item.thumbnailUrl || item.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900">{CATEGORY_LABELS[item.category]}</p>
              {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
              {item.colors?.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {item.colors.slice(0, 4).map((c, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
