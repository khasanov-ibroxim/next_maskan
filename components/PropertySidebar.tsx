"use client";

import React, { useState } from 'react';
import { Phone, Heart, Share2, User } from 'lucide-react';
import { Button } from './ui/Button';
import { CONTACT_PHONE } from '@/constants';

interface PropertySidebarProps {
  title: string;
  district: string;
  location: string;
  price: number;
  dict: any;
}

export const PropertySidebar = ({ title, district, location, price, dict }: PropertySidebarProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: `Maskan Lux: ${title} - ${price.toLocaleString('ru-RU')}$`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback or toast could go here
      alert("Link copied to clipboard (simulated)");
    }
  };

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 hidden lg:block">{title}</h1>
        <p className="text-sm text-slate-500 mb-4 hidden lg:block">{district}, {location}</p>
        
        <div className="mb-6">
          <span className="text-3xl font-bold text-emerald-600">
            ${price.toLocaleString('ru-RU')}
          </span>
          <span className="text-slate-400 text-sm ml-2">{dict.details.start_price}</span>
        </div>

        <div className="space-y-3">
          <Button 
            variant="secondary" 
            fullWidth 
            size="lg" 
            className="flex items-center justify-center gap-2" 
            onClick={() => window.location.href = `tel:${CONTACT_PHONE}`}
          >
            <Phone size={20} />
            {CONTACT_PHONE}
          </Button>
          
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => setIsFavorite(!isFavorite)} 
            className={isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}
          >
            <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? dict.details.saved : dict.details.save}
          </Button>
          
          <Button variant="ghost" fullWidth onClick={handleShare}>
            <Share2 size={20} className="mr-2" />
            {dict.details.share}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="text-slate-500" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{dict.details.realtor}</p>
          <p className="font-bold text-slate-900">{dict.details.agent}</p>
        </div>
      </div>
    </div>
  );
};