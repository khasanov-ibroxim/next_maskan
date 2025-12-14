// app/[lang]/about/page.tsx
import React from 'react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';
import { Shield, Clock, Users, Award, Briefcase, Smile, Building } from 'lucide-react';
import { ContactSection } from '@/components/ContactSection';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ lang: Locale }>;
}

// ✅ Generate static params for all languages
export async function generateStaticParams() {
  return [
    { lang: 'uz' },
    { lang: 'ru' },
    { lang: 'en' },
    { lang: 'uz-cy' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';
  const canonicalUrl = `${baseUrl}/${lang}/about`;

  return {
    title: `${dict.about_page?.title || 'Biz haqimizda'} | Maskan Lux`,
    description: dict.about_page?.subtitle || 'Maskan Lux - Toshkentdagi yetakchi ko\'chmas mulk agentligi. 20+ yillik tajriba, 1200+ mijozlar, professional xizmat.',
    keywords: [
      'Maskan Lux',
      'biz haqimizda',
      'ko\'chmas mulk agentligi',
      'Toshkent',
      'professional xizmat',
      'tajriba',
      'ishonch',
    ].join(', '),
    openGraph: {
      title: `${dict.about_page?.title || 'Biz haqimizda'} | Maskan Lux`,
      description: dict.about_page?.subtitle || 'Maskan Lux - Toshkentdagi yetakchi ko\'chmas mulk agentligi',
      url: canonicalUrl,
      type: 'website',
      locale: lang,
      siteName: 'Maskan Lux',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
          width: 1200,
          height: 630,
          alt: 'Maskan Lux Office',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.about_page?.title || 'Biz haqimizda'} | Maskan Lux`,
      description: dict.about_page?.subtitle || 'Maskan Lux - Toshkentdagi yetakchi ko\'chmas mulk agentligi',
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': `${baseUrl}/uz/about`,
        'ru': `${baseUrl}/ru/about`,
        'en': `${baseUrl}/en/about`,
        'uz-Cyrl': `${baseUrl}/uz-cy/about`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';

  const stats = [
    { icon: Clock, value: "20+", label: dict.about_page.stats.years },
    { icon: Smile, value: "1200+", label: dict.about_page.stats.clients },
    { icon: Building, value: "850+", label: dict.about_page.stats.objects },
    { icon: Users, value: "25+", label: dict.about_page.stats.agents },
  ];

  // ✅ AboutPage JSON-LD
  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: dict.about_page?.title || 'Biz haqimizda',
    description: dict.about_page?.subtitle || 'Maskan Lux haqida ma\'lumot',
    url: `${baseUrl}/${lang}/about`,
    mainEntity: {
      '@type': 'RealEstateAgent',
      name: 'Maskan Lux',
      description: dict.about_page?.story_desc,
      foundingDate: '2004',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: 25,
      },
      knowsAbout: [
        'Real Estate',
        'Property Sales',
        'Property Rental',
        'Real Estate Consulting',
      ],
      areaServed: {
        '@type': 'City',
        name: 'Tashkent',
      },
    },
  };

  // ✅ Organization JSON-LD with awards
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maskan Lux',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: dict.about_page?.story_desc,
    foundingDate: '2004',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toshkent',
      addressRegion: 'Toshkent',
      addressCountry: 'UZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['uz', 'ru', 'en'],
    },
    numberOfEmployees: 25,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1200',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ✅ Breadcrumb JSON-LD
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
        name: dict.about_page?.title || 'Biz haqimizda',
        item: `${baseUrl}/${lang}/about`,
      },
    ],
  };

  return (
      <div className="bg-slate-50 min-h-screen">
        {/* ✅ Structured Data */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                alt="Maskan Lux Office"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-slate-900/70" />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{dict.about_page.title}</h1>
            <p className="text-xl text-emerald-400 font-medium">{dict.about_page.subtitle}</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">{dict.about_page.story_title}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {dict.about_page.story_desc}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg text-emerald-700 font-medium border border-emerald-100">
                  <Shield size={20} />
                  <span>{dict.about_page.values.protect}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium border border-blue-100">
                  <Award size={20} />
                  <span>{dict.about_page.values.sertfc}</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative h-[400px] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                  alt="Maskan Lux Team meeting"
                  fill
                  className="object-cover"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20" itemScope itemType="https://schema.org/ItemList">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-2xl text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    itemProp="itemListElement"
                >
                  <meta itemProp="position" content={String(idx + 1)} />
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200">
                    <stat.icon size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1" itemProp="name">{stat.value}</h3>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
            ))}
          </div>

          {/* Values Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{dict.about_page.values.title}</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
                <Shield className="w-12 h-12 text-emerald-500 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{dict.about_page.values.v1_title}</h3>
                <p className="text-slate-600">{dict.about_page.values.v1_desc}</p>
              </article>
              <article className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
                <Clock className="w-12 h-12 text-emerald-500 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{dict.about_page.values.v2_title}</h3>
                <p className="text-slate-600">{dict.about_page.values.v2_desc}</p>
              </article>
              <article className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
                <Briefcase className="w-12 h-12 text-emerald-500 mb-6 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{dict.about_page.values.v3_title}</h3>
                <p className="text-slate-600">{dict.about_page.values.v3_desc}</p>
              </article>
            </div>
          </div>
        </section>

        <ContactSection dict={dict} />
      </div>
  );
}