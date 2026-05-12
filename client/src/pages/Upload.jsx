import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { extractColors, hexToName } from '../utils/colors';
import { Upload as UploadIcon, X, Plus, Check } from 'lucide-react';

const CATEGORIES = [
  { value: 'bluze', label: 'Bluzë' },
  { value: 'pantallona', label: 'Pantallona' },
  { value: 'xhup', label: 'Xhup' },
  { value: 'kemishe', label: 'Këmishë' },
  { value: 'fustan', label: 'Fustan' },
  { value: 'kepuce', label: 'Këpucë' },
  { value: 'aksesore', label: 'Aksesorë' },
  { value: 'tjeter', label: 'Tjetër' },
];

const OCCASIONS = ['casual', 'pune', 'formal', 'sport', 'dalje'];
const SEASONS = [
  { value: 'vere', label: 'Verë' },
  { value: 'dimer', label: 'Dimër' },
  { value: 'pranvere_vjeshte', label: 'Pranverë/Vjeshtë' },
  { value: 'te_gjitha', label: 'Të gjitha stinët' },
];

const STEP_LABELS = ['Foto', 'Kategori & Ngjyra', 'Detaje'];

export default function Upload() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const imgRef = useRef();

  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: '',
    colors: [],
    occasion: [],
    season: [],
    brand: '',
    notes: '',
  });

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return toast.error('Ju lutem ngarkoni një imazh');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep(1);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const extractColorsFromImage = () => {
    if (!imgRef.current) return;
    try {
      const hexColors = extractColors(imgRef.current, 5);
      const named = [...new Set(hexColors.map(hexToName))].filter((c) => c !== 'other');
      setForm((f) => ({ ...f, colors: hexColors.slice(0, 5) }));
      toast.success(`Ngjyrat u zbuluan: ${named.slice(0, 3).join(', ')}`);
    } catch {
      toast.error('Nuk u zbuluan ngjyrat automatikisht');
    }
  };

  const toggleMulti = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  };

  const handleSubmit = async () => {
    if (!form.category) return toast.error('Zgjidhni kategorinë');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('category', form.category);
      fd.append('colors', JSON.stringify(form.colors));
      fd.append('occasion', JSON.stringify(form.occasion));
      fd.append('season', JSON.stringify(form.season));
      fd.append('brand', form.brand);
      fd.append('notes', form.notes);

      await api.post('/clothing', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Rroba u shtua me sukses!');
      navigate('/wardrobe');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gabim gjatë ngarkimit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Shto Rrobë të Re</h1>
      <p className="text-gray-500 mb-8">Ngarko foto dhe plotëso detajet</p>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-gray-900' : 'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-gray-900 text-white' : i === step ? 'bg-gray-900 text-white' : 'bg-beige-200 text-gray-400'
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px w-8 ${i < step ? 'bg-gray-900' : 'bg-beige-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Photo upload */}
      {step === 0 && (
        <div
          className={`card border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
            dragging ? 'border-gray-900 bg-beige-50' : 'border-beige-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadIcon size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-700 mb-1">Zvarrit dhe lësho foton këtu</p>
          <p className="text-sm text-gray-400">ose kliko për të zgjedhur nga galeria</p>
          <p className="text-xs text-gray-300 mt-3">PNG, JPG, WEBP deri 10MB</p>
        </div>
      )}

      {/* Step 1: Category & Colors */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="relative aspect-video bg-beige-50">
              <img
                ref={imgRef}
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
              <button
                onClick={() => { setStep(0); setFile(null); setPreview(''); }}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div>
            <label className="label">Kategoria <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, category: value })}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    form.category === value
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
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Ngjyrat</label>
              <button onClick={extractColorsFromImage} className="text-xs text-gray-500 hover:text-gray-900 underline">
                Zbulo automatikisht
              </button>
            </div>
            {form.colors.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {form.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white border border-beige-200 rounded-full px-3 py-1">
                    <div className="w-4 h-4 rounded-full border border-beige-200" style={{ backgroundColor: c }} />
                    <span className="text-xs text-gray-600">{c}</span>
                    <button onClick={() => setForm({ ...f => ({ ...f, colors: f.colors.filter((_, j) => j !== i) })})} className="text-gray-300 hover:text-red-500">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Kliko "Zbulo automatikisht" ose shto manualisht pas ngarkimit.</p>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1">Prapa</button>
            <button onClick={() => { if (!form.category) return toast.error('Zgjidhni kategorinë'); setStep(2); }} className="btn-primary flex-1">
              Vazhdo
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="label">Rasti i Përdorimit</label>
            <div className="flex gap-2 flex-wrap">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => toggleMulti('occasion', o)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                    form.occasion.includes(o)
                      ? 'bg-gray-900 text-white'
                      : 'bg-beige-100 text-gray-600 hover:bg-beige-200'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Stina</label>
            <div className="grid grid-cols-2 gap-2">
              {SEASONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleMulti('season', value)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    form.season.includes(value)
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
            <label className="label">Marka (opsionale)</label>
            <input
              className="input"
              placeholder="p.sh. Zara, H&M, Nike..."
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Shënime (opsionale)</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Shënime shtesë për këtë rrobë..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Prapa</button>
            <button onClick={handleSubmit} className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Duke ngarkuar...' : 'Ruaj Rrobën'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
