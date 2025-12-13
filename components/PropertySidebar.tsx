"use client";

import React, {useState} from 'react';
import {Phone, Heart, Share2, User} from 'lucide-react';
import {Button} from './ui/Button';
import {CONTACT_PHONE} from '@/constants';

interface PropertySidebarProps {
    title: string,
    district: string,
    price: number,
    rieltor?: string,
    dict: any,
    floors?: string
}

export const PropertySidebar = ({
                                    title,
                                    district,
                                    price,
                                    rieltor,
                                    dict,
                                    floors
                                }: PropertySidebarProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: title,
                text: `Maskan Lux: ${title} - ${price.toLocaleString('ru-RU')} y.e.`, // ✅ y.e. instead of $
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Link copied to clipboard (simulated)");
        }
    };

    // ✅ Format price with spaces
    const formattedPrice = price > 0
        ? price.toLocaleString('ru-RU')
        : 'Kelishiladi';

    return (
        <div className="sticky top-24 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-1 hidden lg:block">{title}</h1>
                <p className="text-sm text-slate-500 mb-4 hidden lg:block">{district} | {floors}</p>

                <div className="mb-6">
                    {price > 0 ? (
                        <>
              <span className="text-3xl font-bold text-emerald-600">
                {formattedPrice}
              </span>
                            <span className="text-slate-600 text-lg ml-2">y.e.</span>
                        </>
                    ) : (
                        <span className="text-3xl font-bold text-emerald-600">
              Kelishiladi
            </span>
                    )}
                    <div className="text-slate-400 text-sm mt-1">
                        {dict.details.start_price || 'Boshlang\'ich narx'}
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="secondary"
                        fullWidth
                        size="lg"
                        className="flex items-center justify-center gap-2"
                        onClick={() => window.location.href = `tel:${CONTACT_PHONE}`}
                    >
                        <Phone size={20}/>
                        {CONTACT_PHONE}
                    </Button>

                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}
                    >
                        <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`}/>
                        {isFavorite ? dict.details.saved : dict.details.save}
                    </Button>

                    <Button variant="ghost" fullWidth onClick={handleShare}>
                        <Share2 size={20} className="mr-2"/>
                        {dict.details.share}
                    </Button>
                </div>
            </div>

            {/* ✅ Realtor info with actual name */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="text-emerald-600" size={24}/>
                </div>
                <div>
                    <p className="text-sm text-slate-500">{dict.details.rieltor || 'Rieltor'}</p>
                    <p className="font-bold text-slate-900">{rieltor}</p>
                </div>
            </div>
        </div>
    );
};