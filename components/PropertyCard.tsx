// components/PropertyCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize, Building2, Phone } from 'lucide-react';
// @ts-ignore
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/api';
import { trackPropertyView, trackPhoneClick } from '@/lib/analytics';

interface PropertyCardProps {
    property: Property;
    lang: string;
    dict: any;
}

export function PropertyCard({ property, lang, dict }: PropertyCardProps) {
    const imageUrl = property.mainImage
        ? property.mainImage.startsWith('http')
            ? property.mainImage
            : `${process.env.NEXT_PUBLIC_API_URL}${property.mainImage}`
        : '/placeholder.jpg';

    const handleCardClick = () => {
        // Track property view
        trackPropertyView(property.id, property.title);
    };

    const handlePhoneClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Track phone click
        trackPhoneClick(property.phone || '', 'property_card');

        // Open phone dialer
        window.location.href = `tel:${property.phone}`;
    };

    return (
        <article
            className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            itemScope
            itemType="https://schema.org/RealEstateListing"
        >
            <Link href={`/${lang}/object/${property.id}`} onClick={handleCardClick}>
                <div className="relative h-52 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        itemProp="image"
                    />
                    {property.type && (
                        <div className="absolute top-3 left-3">
              <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.type === 'Sotuv'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-500 text-white'
                  }`}
              >
                {property.type}
              </span>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <h3
                        className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors"
                        itemProp="name"
                    >
                        {property.title}
                    </h3>

                    <div className="flex items-center text-slate-500 text-sm mb-3">
                        <MapPin size={14} className="mr-1" />
                        <span itemProp="address">{property.district}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
            <span className="flex items-center gap-1">
              <Building2 size={16} />
                {property.rooms || 0}
            </span>
                        <span className="flex items-center gap-1">
              <Maximize size={16} />
                            {property.area || 0} m²
            </span>
                    </div>

                    {property.price && (
                        <div className="border-t pt-4 flex items-center justify-between">
                            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                <meta itemProp="priceCurrency" content="USD" />
                                <meta itemProp="price" content={property.price.toString()} />
                                <p className="text-2xl font-bold text-emerald-600">
                                    ${formatPrice(property.price)}
                                </p>
                            </div>

                            {property.phone && (
                                <button
                                    onClick={handlePhoneClick}
                                    className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                                    aria-label="Call"
                                >
                                    <Phone size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}