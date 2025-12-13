import React, { useState } from 'react';
import { Menu, X, Home, Phone, Info, Facebook, Instagram, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { APP_NAME } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Bosh sahifa', path: '/', icon: Home },
    { name: 'Biz haqimizda', path: '/about', icon: Info },
    { name: 'Aloqa', path: '/contact', icon: Phone },
  ];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button size="sm" variant="secondary" onClick={scrollToContact}>E'lon berish</Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
            <Button fullWidth variant="secondary" onClick={scrollToContact}>
              E'lon berish
            </Button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <span className="text-xl font-bold text-white">{APP_NAME}</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Biz sizga orzuyingizdagi uyni topishda yordam beramiz. 
                Ishonchli va tezkor xizmat ko'rsatish - bizning oliy maqsadimiz.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Sahifalar</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Bosh sahifa</Link></li>
                <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Biz haqimizda</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Aloqa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Ijtimoiy tarmoqlar</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <Send size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. Barcha huquqlar himoyalangan.</p>
            <p>Designed for Excellence</p>
          </div>
        </div>
      </footer>
    </div>
  );
};