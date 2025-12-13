import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Send } from 'lucide-react';
import { APP_NAME } from '@/constants';

interface FooterProps {
  dict: any;
  lang: string;
}

export const Footer = ({ dict, lang }: FooterProps) => {
  const getPath = (path: string) => `/${lang}${path === '/' ? '' : path}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              {dict.footer.desc}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{dict.footer.pages}</h4>
            <ul className="space-y-2">
              <li><Link href={getPath('/')} className="hover:text-emerald-400 transition-colors">{dict.nav.home}</Link></li>
              <li><Link href={getPath('/about')} className="hover:text-emerald-400 transition-colors">{dict.nav.about}</Link></li>
              <li><Link href={getPath('/contact')} className="hover:text-emerald-400 transition-colors">{dict.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{dict.footer.socials}</h4>
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
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. {dict.footer.rights}</p>
          <p>Designed for Excellence</p>
        </div>
      </div>
    </footer>
  );
};