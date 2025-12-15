// components/PropertyCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {MapPin, Maximize, Home, Building2, Phone, User} from 'lucide-react';
import {formatPrice} from "@/lib/api.ts";


export function PropertyCard({property, lang, dict}) {
    console.log(property)
    return (
        <article
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            itemScope
            itemType="https://schema.org/RealEstateListing"
        >
            {/* Image Section */}
            <Link href={`/${lang}/object/${property.id}`} className="relative h-64 overflow-hidden group">
                <Image
                    src={property.mainImage || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    itemProp="image"
                />

                {/* Type Badge */}
                <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg`}>
                    {property.type}
                </div>

                {/* Price Badge */}
                <div
                    className="absolute bottom-3 left-3 bg-emerald-500  backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-xl font-bold"
                          itemProp="price">{formatPrice(property.price) || 'N/A'} y.e.</span>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Title */}
                <Link href={`/${lang}/object/${property.id}`}>
                    <h3
                        className="font-bold text-lg text-slate-900 mb-3 hover:text-emerald-600 transition-colors line-clamp-2 min-h-[56px]"
                        itemProp="name"
                    >
                        {property.title}
                    </h3>
                </Link>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin size={16} className="text-emerald-500 shrink-0"/>
                    <span className="text-sm truncate" itemProp="address">
            {property.district || 'N/A'}
          </span>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex flex-col items-center">
                        <Home size={18} className="text-slate-400 mb-1"/>
                        <span className="text-xs text-slate-500">{dict.details.rooms}</span>
                        <span className="font-semibold text-slate-900">{property.rooms || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Maximize size={18} className="text-slate-400 mb-1"/>
                        <span className="text-xs text-slate-500">{dict.details.area}</span>
                        <span className="font-semibold text-slate-900">{property.area || 'N/A'}m²</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Building2 size={18} className="text-slate-400 mb-1"/>
                        <span className="text-xs text-slate-500">{dict.details.floor}</span>
                        <span
                            className="font-semibold text-slate-900">{property.floor || 'N/A'}/{property.totalFloors || 'N/A'}</span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4 text-sm">
                    {property.buildingType && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">{dict.details.buildingType}</span>
                            <span className="font-medium text-slate-700">{property.buildingType}</span>
                        </div>
                    )}
                    {property.renovation && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">{dict.details.renovation}</span>
                            <span className="font-medium text-slate-700">{property.renovation}</span>
                        </div>
                    )}
                    {property.balcony && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">{dict.details.balcony}</span>
                            <span className="font-medium text-slate-700">{property.balcony}</span>
                        </div>
                    )}
                </div>

                {/* Rieltor Info (if available) */}
                {(property.rieltor || property.phone) && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                            {property.rieltor && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-emerald-600"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500">{dict.details.realtor}</span>
                                        <span className="text-sm font-medium text-slate-900">
                      {typeof property.rieltor === 'string' ? property.rieltor : property.rieltor.name}
                    </span>
                                    </div>
                                </div>
                            )}
                            {property.phone && (
                                <a
                                    href={`tel:+998970850604`}
                                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Phone size={16}/>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={`/${lang}/object/${property.id}`}
                    className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors text-center"
                >
                    {dict.home?.view || 'Batafsil ko\'rish'}
                </Link>
            </div>

            {/* Schema.org metadata */}
            <meta itemProp="priceCurrency" content="USD"/>
            <meta itemProp="numberOfRooms" content={(property.rooms || 0).toString()}/>
            <meta itemProp="floorSize" content={`${property.area || 0} m²`}/>
        </article>
    );
}