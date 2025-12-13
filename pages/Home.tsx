import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, CheckCircle2 } from 'lucide-react';
import { SEO } from '../utils/seo';
import { DISTRICTS, MOCK_PROPERTIES } from '../constants';
import { Property, FilterState } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';

export const Home = () => {
  const [filter, setFilter] = useState<FilterState>({
    rooms: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    let result = MOCK_PROPERTIES;

    if (filter.rooms) {
      result = result.filter(p => p.rooms.toString() === filter.rooms);
    }
    if (filter.location) {
      result = result.filter(p => p.district === filter.location);
    }
    if (filter.minPrice) {
      result = result.filter(p => p.price >= parseInt(filter.minPrice));
    }
    if (filter.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filter.maxPrice));
    }

    setFilteredProperties(result);
  };

  // Group properties by rooms for the "Sections" request
  const propertiesByRooms = [1, 2, 3, 4, 5].map(roomCount => {
    const props = filteredProperties.filter(p => 
      roomCount === 5 ? p.rooms >= 5 : p.rooms === roomCount
    );
    return { roomCount, props };
  }).filter(group => group.props.length > 0);

  // Contact Form State
  const [contactStatus, setContactStatus] = useState<'idle' | 'success'>('idle');
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('success');
    setTimeout(() => setContactStatus('idle'), 3000);
  };

  // Default dictionary for Client-side React Router version
  const dict = {
    card: {
      rooms: "xona",
      details: "Batafsil"
    }
  };

  return (
    <>
      <SEO title="Maskan Lux - Uyingizni biz bilan toping" />

      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-e328701102b9?auto=format&fit=crop&q=80&w=2000" 
            alt="Real Estate Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 w-full max-w-5xl">
          <div 
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Orzuingizdagi uyni <br/> <span className="text-emerald-400">Maskan Lux</span> bilan toping
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">
              Toshkentning eng nufuzli tumanlaridan eng yaxshi ko'chmas mulk variantlari
            </p>
          </div>

          {/* Filter Panel */}
          <div 
            className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-sm bg-white/95"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Rooms Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Xona soni</label>
                <select 
                  className="w-full h-12 px-3 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none border text-slate-700"
                  value={filter.rooms}
                  onChange={(e) => handleFilterChange('rooms', e.target.value)}
                >
                  <option value="">Barchasi</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n === 5 ? '5+ xona' : `${n} xona`}</option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joylashuv</label>
                <select 
                  className="w-full h-12 px-3 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none border text-slate-700"
                  value={filter.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">Barcha tumanlar</option>
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Narx ($)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full h-12 px-3 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none border"
                    value={filter.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full h-12 px-3 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none border"
                    value={filter.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  size="lg" 
                  fullWidth 
                  onClick={applyFilter}
                  variant="secondary"
                  className="h-12 font-bold"
                >
                  <Search className="mr-2" size={20} /> Qidirish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY SECTIONS */}
      <div className="bg-slate-50 py-16 space-y-16">
        {propertiesByRooms.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl">Afsuski, so'rovingiz bo'yicha uylar topilmadi.</p>
            <Button variant="ghost" onClick={() => {
              setFilter({ rooms: '', location: '', minPrice: '', maxPrice: '' });
              setFilteredProperties(MOCK_PROPERTIES);
            }} className="mt-4">
              Filterni tozalash
            </Button>
          </div>
        )}

        {propertiesByRooms.map((group) => (
          <section key={group.roomCount} className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <span className="w-2 h-8 bg-emerald-500 mr-3 rounded-full"></span>
                {group.roomCount === 5 ? '5+ xonali uylar' : `${group.roomCount} xonali uylar`}
              </h2>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                Barchasini ko'rish
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.props.map((property) => (
                <PropertyCard key={property.id} property={property} lang="uz" dict={dict} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Biz bilan bog'laning</h2>
              <p className="text-slate-300 mb-8 text-lg">
                Sizga mos uyni topishda yordam beramiz. Ma'lumotlaringizni qoldiring va biz siz bilan 15 daqiqa ichida bog'lanamiz.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Qong'iroq qiling</p>
                  <p className="text-xl font-bold">+998 97 085 06 04</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-2xl text-slate-900 shadow-2xl">
              {contactStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Yuborildi!</h3>
                  <p className="text-slate-500 text-center">Tez orada siz bilan bog'lanamiz.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ismingiz</label>
                    <input required type="text" className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon raqam</label>
                    <input required type="tel" className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+998" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Xabar</label>
                    <textarea rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Men ushbu uy bo'yicha..."></textarea>
                  </div>
                  <Button type="submit" fullWidth variant="secondary" size="lg">
                    Yuborish
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};