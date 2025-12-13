import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import { MapPin, Phone, Share2, Heart, ArrowLeft, Calendar, User, Shield } from 'lucide-react';
import { MOCK_PROPERTIES, CONTACT_PHONE } from '../constants';
import { SEO } from '../utils/seo';
import { Button } from '../components/ui/Button';

// Note: Swiper styles are loaded in index.html

export const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const property = MOCK_PROPERTIES.find(p => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Obyekt topilmadi</h2>
        <Link to="/" className="text-emerald-600 hover:underline mt-4 inline-block">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Maskan Lux: ${property.title} - ${property.price}$`,
        url: window.location.href,
      });
    } else {
      alert("Havola nusxalandi!");
    }
  };

  return (
    <>
      <SEO 
        title={`${property.rooms} xonali uy — ${property.district} — Maskan Lux`} 
        description={`${property.description}. Narxi: ${property.price}$`}
        image={property.images[0]}
        type="product"
      />

      <div className="bg-slate-50 min-h-screen pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-500">
              <Link to="/" className="hover:text-emerald-600 flex items-center">
                <ArrowLeft size={16} className="mr-1" /> Ortga
              </Link>
              <span className="mx-2">/</span>
              <span>{property.type}</span>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Gallery & Description */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <Swiper
                  style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' } as React.CSSProperties}
                  zoom={true}
                  navigation={true}
                  pagination={{ clickable: true }}
                  modules={[Zoom, Navigation, Pagination]}
                  className="h-[400px] md:h-[500px] w-full"
                >
                  {property.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="swiper-zoom-container">
                        <img src={img} alt={`${property.title} ${idx + 1}`} className="object-cover w-full h-full" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Title & Price (Mobile Only) */}
              <div className="lg:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
                <p className="text-2xl font-bold text-emerald-600 mb-4">${property.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2" onClick={() => window.open(`tel:${CONTACT_PHONE}`)}>
                    <Phone size={18} /> Qo'ng'iroq
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-emerald-500 pl-3">
                  Xususiyatlar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Xonalar</p>
                    <p className="font-medium text-slate-900">{property.rooms} ta</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Umumiy maydon</p>
                    <p className="font-medium text-slate-900">{property.area} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Qavat</p>
                    <p className="font-medium text-slate-900">{property.floor}-qavat / {property.totalFloors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Remont</p>
                    <p className="font-medium text-slate-900">{property.renovation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Bino turi</p>
                    <p className="font-medium text-slate-900">{property.buildingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Joylashuv</p>
                    <p className="font-medium text-slate-900">{property.district}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">
                  Tavsif
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400 border-t pt-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> E'lon sanasi: {property.createdAt}</span>
                  <span className="flex items-center gap-1"><Shield size={14} /> Tekshirilgan obyekt</span>
                </div>
              </div>

               {/* Map Placeholder */}
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">
                  Xaritada joylashuvi
                </h2>
                <div className="relative w-full h-[300px] bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=41.2995,69.2401&zoom=13&size=800x400&sensor=false')] bg-cover bg-center opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative z-10 text-center p-6 bg-white/90 backdrop-blur rounded-xl shadow-lg">
                    <MapPin size={32} className="mx-auto text-emerald-600 mb-2" />
                    <p className="font-bold text-slate-800 mb-2">{property.location}, {property.district}</p>
                    <Button size="sm" variant="outline" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${property.district}+${property.location}`)}>
                      Google Xaritada Ochish
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price & Action Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                  <h1 className="text-2xl font-bold text-slate-900 mb-1 hidden lg:block">{property.title}</h1>
                  <p className="text-sm text-slate-500 mb-4 hidden lg:block">{property.district}, {property.location}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-emerald-600">${property.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm ml-2">start</span>
                  </div>

                  <div className="space-y-3">
                    <Button variant="secondary" fullWidth size="lg" className="flex items-center justify-center gap-2" onClick={() => window.open(`tel:${CONTACT_PHONE}`)}>
                      <Phone size={20} />
                      {CONTACT_PHONE}
                    </Button>
                    <Button variant="outline" fullWidth onClick={() => setIsFavorite(!isFavorite)} className={isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}>
                      <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Saqlangan' : 'Saqlash'}
                    </Button>
                    <Button variant="ghost" fullWidth onClick={handleShare}>
                      <Share2 size={20} className="mr-2" />
                      Ulashish
                    </Button>
                  </div>
                </div>

                {/* Agent Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Rieltor</p>
                    <p className="font-bold text-slate-900">Maskan Lux Agent</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};