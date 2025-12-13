// components/PropertyCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Home, Maximize, Loader2 } from 'lucide-react';
import { Property } from '@/types';
import { Locale } from '@/i18n-config';

interface PropertyCardProps {
  property: Property;
  lang: Locale;
  dict: any;
}

export function PropertyCard({ property, lang, dict }: PropertyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const href = `/${lang}/object/${property.id}`;
  console.log(property)
  // ✅ Format price with spaces
  const formattedPrice = property.price > 0
      ? property.price.toLocaleString('ru-RU')
      : 'Kelishiladi';

  return (
      <Link href={href} className="group block">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">

          {/* Image with Loading State */}
          <div className="relative h-48 bg-slate-200 overflow-hidden">
            {/* Loading Skeleton */}
            {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
            )}

            {/* Image */}
            {!imageError && property.mainImage ? (
                <Image
                    src={property.mainImage}
                    alt={property.title}
                    fill
                    className={`object-cover group-hover:scale-110 transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      console.error('Image load error:', property.mainImage);
                    }}
                    unoptimized={property.mainImage.includes('194.163.140.30')}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                  <Home size={48} />
                </div>
            )}

            {/* ✅ Price Badge with y.e. */}
            <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
              {property.price > 0 ? (
                  <>
                    {formattedPrice} <span className="text-xs">y.e.</span>
                  </>
              ) : (
                  'Kelishiladi'
              )}
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-semibold z-10">
              {property.type}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[3rem]">
              {property.title}
            </h3>

            <div className="flex items-center text-sm text-slate-500 mb-4">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{property.district}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">{dict.card?.rooms || 'Xonalar'}</p>
                <p className="font-bold text-slate-900">{property.rooms}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">{dict.card?.area || 'Maydon'}</p>
                <p className="font-bold text-slate-900 flex items-center justify-center">
                  {property.area}
                  <span className="text-xs ml-1">m²</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">{dict.card?.floor || 'Qavat'}</p>
                <p className="font-bold text-slate-900">{property.floor}/{property.totalFloors}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
  );
}