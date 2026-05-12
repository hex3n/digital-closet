import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt, LayoutDashboard, Wand2, Upload, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/wardrobe', label: 'Garderoba', icon: Shirt },
  { to: '/outfit-generator', label: 'Outfit Generator', icon: Wand2 },
  { to: '/upload', label: 'Shto Rrobe', icon: Upload },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-beige-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Shirt size={16} className="text-white" />
            </div>
            Digital Closet
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-beige-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-beige-100 text-gray-900' : 'text-gray-600 hover:bg-beige-100'
                }`
              }
            >
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={15} />
              )}
              {user.displayName}
            </NavLink>
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-1.5 text-sm">
              <LogOut size={15} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-beige-100" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-beige-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-beige-100'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-beige-100 flex items-center justify-between">
            <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
              <User size={15} /> {user.displayName}
            </NavLink>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600">
              <LogOut size={15} /> Dil
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
