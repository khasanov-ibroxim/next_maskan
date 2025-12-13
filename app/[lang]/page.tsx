import { getProperties } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { HeroSection } from "@/components/HeroSection";
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

// ✅ Generate metadata for home page
export async function generateMetadata({ params, searchParams }: HomeProps): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';
  const canonicalUrl = `${baseUrl}/${lang}`;

  // Build title based on filters
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

  // ✅ Parse search params for API
  const filters = {
    rooms: typeof sp.rooms === 'string' ? sp.rooms : undefined,
    location: typeof sp.location === 'string' ? sp.location : undefined,
    type: typeof sp.type === 'string' ? (sp.type as 'Sotuv' | 'Arenda') : undefined,
  };

  // ✅ Fetch from real server
  const properties = await getProperties({
    lang,
    ...filters
  });

  // Group by rooms
  const propertiesByRooms = [1, 2, 3, 4, 5].map(roomCount => {
    const props = properties.filter(p =>
        roomCount === 5 ? p.rooms >= 5 : p.rooms === roomCount
    );
    return { roomCount, props };
  }).filter(group => group.props.length > 0);

  // ✅ JSON-LD for ItemList
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
          price: property.price,
          priceCurrency: 'USD',
        },
      },
    })),
  };

  return (
      <>
        {/* ✅ Structured Data */}
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

          {/* Properties grouped by rooms */}
          {propertiesByRooms.map((group) => (
              <section
                  key={group.roomCount}
                  className="container mx-auto px-4"
                  itemScope
                  itemType="https://schema.org/OfferCatalog"
              >
                <meta itemProp="name" content={`${group.roomCount} xonali kvartiralar`} />

                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-8 bg-emerald-500 mr-3 rounded-full"></span>
                    {group.roomCount === 5
                        ? dict.home.rooms_5plus_title
                        : `${group.roomCount} ${dict.home.rooms_title}`
                    }
                  </h2>
                  <span className="text-slate-500 text-sm">
                {/*{group.props.length} {dict.home.properties || 'ta'}*/}
              </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.props.map((property) => (
                      <PropertyCard
                          key={property.id}
                          property={property}
                          lang={lang}
                          dict={dict}
                      />
                  ))}
                </div>
              </section>
          ))}
        </div>

        <ContactSection dict={dict} />
      </>
  );
}