import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OCCASIONS = ['casual', 'pune', 'formal', 'sport', 'dalje'];

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    defaultOccasion: user?.preferences?.defaultOccasion || 'casual',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/me', {
        displayName: form.displayName,
        preferences: { defaultOccasion: form.defaultOccasion },
      });
      updateUser(data);
      toast.success('Profili u ruajt!');
    } catch {
      toast.error('Gabim gjatë ruajtjes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-container max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profili Im</h1>

      <div className="card p-6 mb-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-beige-100">
          <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label">Emri i Shfaqur</label>
            <input
              className="input"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Rasti i Paracaktuar</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setForm({ ...form, defaultOccasion: o })}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                    form.defaultOccasion === o
                      ? 'bg-gray-900 text-white'
                      : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
            <Save size={16} />
            {loading ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-100">
        <h2 className="font-semibold text-gray-900 mb-4">Zona e Rrezikshme</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} /> Dil nga Llogaria
        </button>
      </div>
    </div>
  );
}
