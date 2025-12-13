'use client';

// components/PropertyCard.tsx - FIXED VERSION
import Link from 'next/link';
import Image from 'next/image';
import { Home, Maximize, Building2 } from 'lucide-react';
// @ts-ignore
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/api';

interface PropertyCardProps {
    property: Property;
    lang: string;
    dict: any;
}

export function PropertyCard({ property, lang, dict }: PropertyCardProps) {
    // ✅ Use mainImage if available, fallback to first image
    const imageUrl = property.mainImage || property.images?.[0] || '/placeholder.jpg';

    // ✅ Format price properly
    const formattedPrice = formatPrice(property.price);

    return (
        <Link
            href={`/${lang}/object/${property.id}`}
            className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            itemScope
            itemType="https://schema.org/RealEstateListing"
        >
            {/* ✅ Image with proper error handling */}
            <div className="relative h-[250px] overflow-hidden bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    itemProp="image"
                    onError={(e) => {
                        // Fallback to placeholder on error
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                    }}
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {property.type || 'Sotuv'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                {/* Title */}
                <h3
                    className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                    itemProp="name"
                >
                    {property.title}
                </h3>

                {/* Location */}
                <p className="text-sm text-slate-500 mb-3" itemProp="address">
                    📍 {property.district}
                </p>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1" title={dict?.details?.rooms || 'Xonalar'}>
                        <Home size={16} className="text-emerald-600" />
                        {property.rooms}
                    </span>
                    <span className="flex items-center gap-1" title={dict?.details?.area || 'Maydon'}>
                        <Maximize size={16} className="text-emerald-600" />
                        {property.area} m²
                    </span>
                    <span className="flex items-center gap-1" title={dict?.details?.floor || 'Qavat'}>
                        <Building2 size={16} className="text-emerald-600" />
                        {property.floor}/{property.totalFloors}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">
                            {dict?.hero.filter?.price || 'Narxi'}
                        </p>
                        <p
                            className="text-2xl font-bold text-emerald-600"
                            itemProp="price"
                            content={property.price.toString()}
                        >
                            {formattedPrice} y.e.
                            <meta itemProp="priceCurrency" content="USD" />
                        </p>
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                        {dict?.home?.view || "Ko'rish"}
                    </button>
                </div>
            </div>
        </Link>
    );
}