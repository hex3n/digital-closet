import { Link } from 'react-router-dom';
import { Shirt, Wand2, Smartphone, Star, ArrowRight, Check } from 'lucide-react';

const features = [
  { icon: Shirt, title: 'Garderoba Virtuale', desc: 'Ngarko rrobat tuaja dhe krijoje garderoben dixhitale personale.' },
  { icon: Wand2, title: 'Outfit Generator', desc: 'Merr sugjerime kombinimesh bazuar ne ngjyre, rast dhe sezon.' },
  { icon: Smartphone, title: 'Mobile-First', desc: 'Perdore nga celulari, tableti ose kompjuteri — gjithmone i disponueshem.' },
  { icon: Star, title: 'Ruaj Favoritet', desc: 'Ruaj outfit-et me te preferuara dhe ndaji me miqte.' },
];

const stats = [
  { value: '67%', label: 'e njerezve ndihen të pavendosur para garderobe-s' },
  { value: '3min', label: 'per te gjetur outfit-in perfekt' },
  { value: '100%', label: 'falas per perdorim' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900 text-xl">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <Shirt size={18} className="text-white" />
          </div>
          Digital Closet
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Hyr</Link>
          <Link to="/register" className="btn-primary text-sm py-2.5">Regjistrohu</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-beige-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Projekt Shkollor 2025-2026
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
          Garderoba jote,<br />
          <span className="text-beige-500">dixhitale.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Fotografo rrobat, krijo outfit-e me AI, dhe mos thuaj me kurre{' '}
          <em>"s'kam cfare te vesh"</em>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base py-3.5 px-8">
            Fillo Tani <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-base py-3.5 px-8">
            Kam llogari
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-beige-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-gray-900 mb-2">{s.value}</div>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Si funksionon?</h2>
        <p className="text-gray-500 text-center mb-12">Tre hapa te thjeshe per garderoben e endrrave.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="card p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-beige-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={22} className="text-gray-900" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Vetem 3 hapa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Regjistrohu', desc: 'Krijo llogarine falas ne sekonda.' },
              { step: '02', title: 'Ngarko Rrobat', desc: 'Fotografo dhe kategorizoji rrobat tuaja.' },
              { step: '03', title: 'Merr Sugjerime', desc: 'Gjeneratori te sugjeron kombinime perfekte.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="text-6xl font-bold text-white/10 mb-3">{step}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Gati per garderoben dixhitale?</h2>
        <p className="text-gray-500 mb-8 text-lg">100% falas. Pa karte krediti.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8">
          Fillo Falas <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-beige-200 py-8 text-center text-sm text-gray-400">
        <p>Digital Closet · Projekt Shkollor 2025-2026 · Rakel, Fotinia, Bruklin, Anxhela dhe Jasemina</p>
      </footer>
    </div>
  );
}
