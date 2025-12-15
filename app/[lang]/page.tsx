// app/[lang]/page.tsx - Debug panel bilan
import { getProperties } from "@/lib/api";
import { PropertyCard } from "../../components/PropertyCard";
import { HeroSection } from "../../components/HeroSection";
import { ContactSection } from "@/components/ContactSection";
import { Filter } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";
import { Metadata } from "next";

interface HomeProps {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: HomeProps): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';
  const canonicalUrl = `${baseUrl}/${lang}`;

  let title = 'Maskan Lux - Ko\'chmas Mulk Toshkentda';
  let description = 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari. Kvartira sotish va ijaraga berish.';

  if (sp.rooms) {
    title = `${sp.rooms} xonali kvartiralar - Maskan Lux`;
    description = `${sp.rooms} xonali kvartiralar Toshkentda. Qulay narxlar, professional xizmat.`;
  }

  if (sp.location) {
    title = `Ko'chmas mulk ${sp.location} - Maskan Lux`;
    description = `${sp.location} tumanidagi kvartiralar. Sotish va ijara.`;
  }

  if (sp.type === 'Sotuv') {
    title = `Kvartira sotish - ${title}`;
    description = `Kvartira sotish Toshkentda. ${description}`;
  } else if (sp.type === 'Arenda') {
    title = `Kvartira ijara - ${title}`;
    description = `Kvartira ijaraga olish Toshkentda. ${description}`;
  }

  return {
    title,
    description,
    keywords: [
      'kvartira',
      sp.location || 'Toshkent',
      sp.type === 'Sotuv' ? 'sotish' : 'ijara',
      sp.rooms ? `${sp.rooms} xona` : '',
      'ko\'chmas mulk',
      'maskan',
    ].filter(Boolean).join(', '),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: lang,
      siteName: 'Maskan Lux',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `${baseUrl}/uz`,
        'ru': `${baseUrl}/ru`,
        'en': `${baseUrl}/en`,
        'uz-Cyrl': `${baseUrl}/uz-cy`,
      },
    },
  };
}

export default async function Home({ params, searchParams }: HomeProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const dict = await getDictionary(lang);

  const filters = {
    rooms: typeof sp.rooms === 'string' ? sp.rooms : undefined,
    location: typeof sp.location === 'string' ? sp.location : undefined,
    type: typeof sp.type === 'string' ? (sp.type as 'Sotuv' | 'Arenda') : undefined,
  };

  // ✅ Fetch properties
  let properties = await getProperties({
    lang,
    ...filters
  });

  // ✅ Console log for debugging
  console.log('📊 API Response:', {
    total: properties.length,
    sample: properties[0],
    allFields: properties.length > 0 ? Object.keys(properties[0]) : []
  });

  // ✅ Sort by date
  if (Array.isArray(properties) && properties.length > 0) {
    properties = [...properties].sort((a, b) => {
      try {
        const parseDate = (dateStr: string) => {
          if (dateStr.includes('.')) {
            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('.');
            return new Date(`${year}-${month}-${day}${timePart ? ` ${timePart}` : ''}`).getTime();
          }
          return new Date(dateStr).getTime();
        };

        const dateA = parseDate(a.createdAt);
        const dateB = parseDate(b.createdAt);

        if (isNaN(dateA) || isNaN(dateB)) return 0;

        return dateB - dateA;
      } catch (error) {
        console.error('Error sorting by date:', error);
        return 0;
      }
    });
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.slice(0, 10).map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: property.title,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/object/${property.id}`,
        offers: {
          '@type': 'Offer',
          price: property?.price,
          priceCurrency: 'USD',
        },
      },
    })),
  };

  return (
      <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />

        <HeroSection initialFilters={filters} lang={lang} dict={dict} />

        <div className="bg-slate-50 py-16 space-y-16">
          {/* No Results */}
          {properties.length === 0 && (
              <div className="text-center py-20 text-slate-500 container mx-auto">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl">{dict.home.no_results}</p>
                <Link
                    href={`/${lang}`}
                    className="text-emerald-600 hover:underline mt-4 inline-block"
                >
                  {dict.home.clear_filter}
                </Link>
              </div>
          )}

          {/* Properties List */}
          {properties.length > 0 && (
              <section
                  className="container mx-auto px-4"
                  itemScope
                  itemType="https://schema.org/OfferCatalog"
              >
                {/* Stats */}
                {/*<div className="mb-8 text-center">*/}
                {/*  <p className="text-slate-600">*/}
                {/*    Jami <strong className="text-emerald-600">{properties.length}</strong> ta ob'ekt topildi*/}
                {/*  </p>*/}
                {/*</div>*/}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {properties.map((property) => (
                      <PropertyCard
                          key={property.id}
                          property={property}
                          lang={lang}
                          dict={dict}
                      />
                  ))}
                </div>
              </section>
          )}
        </div>

        <ContactSection dict={dict} />

      </>
  );
}