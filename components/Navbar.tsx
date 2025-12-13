"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Phone, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { APP_NAME } from '@/constants';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  dict: any;
  lang: string;
}

export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper for localized paths
  const getPath = (path: string) => `/${lang}${path === '/' ? '' : path}`;

  const navLinks = [
    { name: dict.nav.home, path: '/', icon: Home },
    { name: dict.nav.about, path: '/about', icon: Info },
    { name: dict.nav.contact, path: '/contact', icon: Phone },
  ];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">{APP_NAME}</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={getPath(link.path)}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                pathname === getPath(link.path) ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile Actions & Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <button 
            className="p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={getPath(link.path)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};