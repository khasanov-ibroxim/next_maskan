import { getPropertyById, getPropertyImages, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Shield } from "lucide-react";
import { Gallery } from "@/components/Gallery";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";
import { PropertySidebar } from "@/components/PropertySidebar";

interface Props {
  params: Promise<{ id: string; lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const property = await getPropertyById(id, lang);

  if (!property) {
    return {
      title: "Not Found",
    };
  }

  const title = `${property.rooms} xona - ${property.title} | Maskan Lux`;

  return {
    title: title,
    description: property.description,
    openGraph: {
      title: title,
      description: property.description,
      images: property.images.length > 0
          ? [{ url: property.images[0], width: 1200, height: 630 }]
          : [],
      type: 'article',
      locale: lang,
    },
    alternates: {
      languages: {
        'uz': `/uz/object/${id}`,
        'ru': `/ru/object/${id}`,
        'en': `/en/object/${id}`,
        'uz-Cyrl': `/uz-cy/object/${id}`,
      },
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { lang, id } = await params;
  const property = await getPropertyById(id, lang);
  const dict = await getDictionary(lang);

  if (!property) {
    notFound();
  }

  // ✅ Fetch images with timeout and error handling
  let images: string[] = [];
  if (property.images.length > 0 && property.images[0]) {
    try {
      console.log('📥 Fetching images for property:', id);
      const startTime = Date.now();

      images = await Promise.race([
        getPropertyImages(property.images[0]),
        new Promise<string[]>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000) // 10s timeout
        )
      ]);

      const duration = Date.now() - startTime;
      console.log(`✅ Images loaded in ${duration}ms: ${images.length} images`);
    } catch (error) {
      console.error('⚠️ Image loading failed:', error);
      // Use mainImage as fallback
      images = property.mainImage ? [property.mainImage] : [];
    }
  }

  // ✅ Fallback to mainImage if no images loaded
  if (images.length === 0 && property.mainImage) {
    images = [property.mainImage];
  }

  // ✅ Format date
  const formattedDate = formatDate(property.createdAt, lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    image: images,
    description: property.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: property.price,
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.district,
      addressRegion: 'Toshkent',
      addressCountry: 'UZ'
    }
  };

  return (
      <div className="bg-slate-50 min-h-screen pb-20">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-500">
              <Link href={`/${lang}`} className="hover:text-emerald-600 flex items-center transition-colors">
                <ArrowLeft size={16} className="mr-1" /> {dict.details.back}
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

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* ✅ Gallery with real images */}
              {images.length > 0 ? (
                  <Gallery images={images} title={property.title} />
              ) : (
                  <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                    <p className="text-slate-500">Rasmlar yuklanmoqda...</p>
                  </div>
              )}

              {/* Mobile Title (visible only on small screens) */}
              <div className="lg:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
                <p className="text-2xl font-bold text-emerald-600 mb-4">
                  ${property.price.toLocaleString('ru-RU')}
                </p>
              </div>

              {/* Details */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-emerald-500 pl-3">
                  {dict.details.features}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  <DetailItem label={dict.details.rooms} value={`${property.rooms}`} />
                  <DetailItem label={dict.details.area} value={`${property.area} m²`} />
                  <DetailItem label={dict.details.floor} value={`${property.floor} / ${property.totalFloors}`} />
                  <DetailItem label={dict.details.renovation} value={property.renovation} />
                  <DetailItem label={dict.details.buildingType} value={property.buildingType} />
                  <DetailItem label={dict.details.location} value={property.district} />
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">
                  {dict.details.description}
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400 border-t pt-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {formattedDate}
                </span>
                  <span className="flex items-center gap-1">
                  <Shield size={14} /> {dict.details.verified}
                </span>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">
                  {dict.details.map}
                </h2>
                <div className="relative w-full h-[300px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
                  <div className="text-center z-10 p-6">
                    <MapPin className="mx-auto text-emerald-600 mb-3" size={48} />
                    <p className="font-semibold text-lg mb-1">{property.district}</p>
                    <p className="text-slate-500 mb-4 text-sm">
                      {dict.details.open_map || 'Xaritada ko\'rish'}
                    </p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.district + ' Tashkent')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-colors focus:outline-none bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-6 shadow-md"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <PropertySidebar
                  title={property.title}
                  district={property.district}
                  location={property.district}
                  price={property.price}
                  dict={dict}
              />
            </div>
          </div>
        </div>
      </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string | number }) {
  return (
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
  );
}