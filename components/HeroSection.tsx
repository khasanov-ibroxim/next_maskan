"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';
import { getLocations } from '@/lib/api';
import imgBg from "../public/bg.jpg"

interface HeroProps {
  initialFilters: {
    rooms?: string;
    location?: string;
    min?: string;
    max?: string;
  },
  lang: string;
  dict: any;
}

export const HeroSection = ({ initialFilters, lang, dict }: HeroProps) => {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [locations, setLocations] = useState<{ name: string; count: number }[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // ✅ Load locations on mount
  useEffect(() => {
    async function loadLocations() {
      setIsLoadingLocations(true);
      try {
        const locs = await getLocations(lang);
        setLocations(locs);
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    }

    loadLocations();
  }, [lang]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.rooms) params.set('rooms', filters.rooms);
    if (filters.location) params.set('location', filters.location);
    if (filters.min) params.set('min', filters.min);
    if (filters.max) params.set('max', filters.max);

    router.push(`/${lang}?${params.toString()}`);
  };

  return (
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
              src={imgBg}
              alt="Real Estate Background"
              fill
              className="object-cover"
              priority
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 w-full max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              {dict.hero.title_1} <br/> <span className="text-emerald-400">Maskan Lux</span> {dict.hero.title_2}
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">
              {dict.hero.subtitle}
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Rooms */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  {dict.hero.filter.rooms}
                </label>
                <select
                    className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                    value={filters.rooms || ''}
                    onChange={(e) => setFilters({...filters, rooms: e.target.value})}
                >
                  <option value="">{dict.hero.filter.all_rooms}</option>
                  {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>
                        {n === 5 ? dict.hero.filter.rooms_5plus : `${n} ${dict.hero.filter.rooms_suffix}`}
                      </option>
                  ))}
                </select>
              </div>

              {/* Location - ✅ Now uses API data */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  {dict.hero.filter.location}
                </label>
                <select
                    className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                    value={filters.location || ''}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    disabled={isLoadingLocations}
                >
                  <option value="">
                    {isLoadingLocations ? 'Yuklanmoqda...' : dict.hero.filter.all_locations}
                  </option>
                  {locations.map(loc => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} ({loc.count})
                      </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  {dict.hero.filter.price}
                </label>
                <div className="flex gap-2">
                  <input
                      type="number"
                      placeholder="Min"
                      className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg"
                      value={filters.min || ''}
                      onChange={(e) => setFilters({...filters, min: e.target.value})}
                  />
                  <input
                      type="number"
                      placeholder="Max"
                      className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg"
                      value={filters.max || ''}
                      onChange={(e) => setFilters({...filters, max: e.target.value})}
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                    size="lg"
                    fullWidth
                    onClick={handleSearch}
                    variant="secondary"
                    className="h-12 font-bold"
                >
                  <Search className="mr-2" size={20} /> {dict.hero.filter.search}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};