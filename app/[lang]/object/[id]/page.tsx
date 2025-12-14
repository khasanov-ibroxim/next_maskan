// app/[lang]/object/[id]/page.tsx - Fixed image URLs
import { getPropertyById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Shield, Home, Maximize, Building2 } from "lucide-react";
import { Gallery } from "@/components/Gallery";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";
import { PropertySidebar } from "@/components/PropertySidebar";

interface Props {
  params: Promise<{ id: string; lang: Locale }>;
}

// ✅ Helper function to get full image URL
function getFullImageUrl(imageUrl: string | undefined, baseUrl: string): string {
  if (!imageUrl) return `${baseUrl}/bg.png`;

  // Agar URL allaqachon to'liq bo'lsa (http:// yoki https:// bilan boshlansa)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // URL already encoded, return as is
    return imageUrl;
  }

  // Agar nisbiy URL bo'lsa, API URL qo'shamiz
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
  return `${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

// ✅ Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const property = await getPropertyById(id, lang);

  if (!property) {
    return {
      title: "Ko'chmas mulk topilmadi | Maskan Lux",
      description: "So'ralgan ko'chmas mulk mavjud emas",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';
  const canonicalUrl = `${baseUrl}/${lang}/object/${id}`;

  // ✅ Get full image URL
  const ogImage = getFullImageUrl(property.mainImage, baseUrl);

  const title = `${property.rooms || 'N/A'} xona - ${property.district || 'N/A'}, ${property.area || 'N/A'}m² - ${property.price?.toLocaleString() || 'N/A'} | Maskan Lux`;
  const description = property.description ||
      `${property.rooms || 'N/A'} xonali kvartira, ${property.area || 'N/A'} m², ${property.floor || 'N/A'}/${property.totalFloors || 'N/A'} qavat, ${property.district || 'N/A'} tumani. Narxi: ${property.price?.toLocaleString() || 'N/A'}. ${property.renovation || ''}. ${property.buildingType || ''}.`.trim();

  return {
    title: title,
    description: description,
    keywords: [
      'kvartira',
      'uy',
      property.district || 'Toshkent',
      `${property.rooms || 'N/A'} xona`,
      property.type || 'sotuv',
      'Toshkent',
      'ko\'chmas mulk',
      'maskan',
      property.renovation || '',
      property.buildingType || '',
    ].filter(Boolean).join(', '),
    authors: [{ name: 'Maskan Lux' }],
    creator: 'Maskan Lux',
    publisher: 'Maskan Lux',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'article',
      locale: lang,
      url: canonicalUrl,
      title: title,
      description: description,
      siteName: 'Maskan Lux',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      publishedTime: property.createdAt,
      modifiedTime: property.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
      creator: '@maskanlux',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `${baseUrl}/uz/object/${id}`,
        'ru': `${baseUrl}/ru/object/${id}`,
        'en': `${baseUrl}/en/object/${id}`,
        'uz-Cyrl': `${baseUrl}/uz-cy/object/${id}`,
      },
    },
    other: {
      'price:amount': property.price?.toString() || '0',
      'price:currency': 'У.Е.',
      'property:type': property.type || 'N/A',
      'property:rooms': property.rooms?.toString() || '0',
      'property:area': property.area?.toString() || '0',
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

  const images = property.images || [];

  if (images.length === 0 && property.mainImage) {
    images.push(property.mainImage);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';

  // ✅ Convert all images to full URLs for JSON-LD
  const fullImageUrls = images.map(img => getFullImageUrl(img, baseUrl));

  // ✅ Enhanced JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${baseUrl}/${lang}/object/${id}`,
    name: property.title,
    description: property.description,
    url: `${baseUrl}/${lang}/object/${id}`,
    image: fullImageUrls,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: property.price || 0,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: `${baseUrl}/${lang}/object/${id}`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.district || 'Toshkent',
      addressRegion: 'Toshkent',
      addressCountry: 'UZ',
    },
    numberOfRooms: property.rooms || 1,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area || 0,
      unitCode: 'MTK',
    },
    numberOfBathroomsTotal: 1,
    datePublished: property.createdAt,
    dateModified: property.createdAt,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Floor',
        value: `${property.floor || 'N/A'} / ${property.totalFloors || 'N/A'}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Renovation',
        value: property.renovation || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Building Type',
        value: property.buildingType || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Balcony',
        value: property.balcony || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Parking',
        value: property.parking || 'N/A',
      },
    ].filter(prop => prop.value !== 'N/A'),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Bosh sahifa',
        item: `${baseUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: property.type,
        item: `${baseUrl}/${lang}?type=${property.type}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.title,
        item: `${baseUrl}/${lang}/object/${id}`,
      },
    ],
  };

  return (
      <div className="bg-slate-50 min-h-screen pb-20">
        {/* ✅ Structured Data */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-500 flex-wrap gap-2">
              <Link href={`/${lang}`} className="hover:text-emerald-600 flex items-center transition-colors">
                <ArrowLeft size={16} className="mr-1" /> {dict.details.back}
              </Link>
              <span>/</span>
              <Link href={`/${lang}?type=${property.type}`} className="hover:text-emerald-600 transition-colors">
                {property.type}
              </Link>
              <span>/</span>
              <Link href={`/${lang}?location=${property.district}`} className="hover:text-emerald-600 transition-colors">
                {property.district}
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              {images.length > 0 ? (
                  <Gallery images={images} title={property.title} />
              ) : (
                  <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                    <p className="text-slate-500">Rasmlar yuklanmoqda...</p>
                  </div>
              )}

              {/* Mobile Title */}
              <div className="lg:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
                {property.price && (
                    <p className="text-2xl font-bold text-emerald-600 mb-4">
                      ${property.price.toLocaleString()}
                    </p>
                )}
                <div className="flex items-center gap-4 text-slate-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <Home size={18} /> {property.rooms || 'N/A'} xona
                </span>
                  <span className="flex items-center gap-1">
                  <Maximize size={18} /> {property.area || 'N/A'} m²
                </span>
                  <span className="flex items-center gap-1">
                  <Building2 size={18} /> {property.floor || 'N/A'}/{property.totalFloors || 'N/A'}
                </span>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-emerald-500 pl-3">
                  {dict.details.features}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  <DetailItem label={dict.details.rooms} value={property.rooms?.toString() || 'N/A'} />
                  <DetailItem label={dict.details.area} value={property.area ? `${property.area} m²` : 'N/A'} />
                  <DetailItem label={dict.details.floor} value={`${property.floor || 'N/A'} / ${property.totalFloors || 'N/A'}`} />
                  <DetailItem label={dict.details.renovation} value={property.renovation || 'N/A'} />
                  <DetailItem label={dict.details.buildingType} value={property.buildingType || 'N/A'} />
                  <DetailItem label={dict.details.location} value={property.district || 'N/A'} />
                  <DetailItem label={dict.details.balcony} value={property.balcony || 'N/A'} />
                  <DetailItem label={dict.details.torets} value={property.parking || 'N/A'} />
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
                  <Calendar size={14} /> {property.createdAt}
                </span>
                  <span className="flex items-center gap-1">
                  <Shield size={14} /> {dict.details.verified}
                </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <PropertySidebar
                  title={property.title || 'N/A'}
                  district={property.district || 'N/A'}
                  floors={`${property.rooms || 'N/A'}/${property.floor || 'N/A'}/${property.totalFloors || 'N/A'}`}
                  price={property.price}
                  rieltor={property.rieltor}
                  phone={property.phone}
                  dict={dict}
              />
            </div>
          </div>
        </div>
      </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
  );
}