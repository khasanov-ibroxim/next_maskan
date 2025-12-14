// app/[lang]/contact/page.tsx - Server Component with SEO
import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACT_PHONE } from '@/constants';
import { ContactForm } from '@/components/ContactForm';
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
    const canonicalUrl = `${baseUrl}/${lang}/contact`;

    return {
        title: `${dict.contact_page?.title || 'Aloqa'} | Maskan Lux`,
        description: dict.contact_page?.subtitle || 'Maskan Lux bilan bog\'lanish. Toshkent, professional ko\'chmas mulk xizmatlari.',
        keywords: [
            'aloqa',
            'kontakt',
            'contact',
            'Maskan Lux',
            'ko\'chmas mulk',
            'Toshkent',
            'telefon',
            'manzil',
        ].join(', '),
        openGraph: {
            title: `${dict.contact_page?.title || 'Aloqa'} | Maskan Lux`,
            description: dict.contact_page?.subtitle || 'Maskan Lux bilan bog\'lanish',
            url: canonicalUrl,
            type: 'website',
            locale: lang,
            siteName: 'Maskan Lux',
        },
        twitter: {
            card: 'summary',
            title: `${dict.contact_page?.title || 'Aloqa'} | Maskan Lux`,
            description: dict.contact_page?.subtitle || 'Maskan Lux bilan bog\'lanish',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'uz': `${baseUrl}/uz/contact`,
                'ru': `${baseUrl}/ru/contact`,
                'en': `${baseUrl}/en/contact`,
                'uz-Cyrl': `${baseUrl}/uz-cy/contact`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ContactPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';

    // ✅ LocalBusiness JSON-LD
    const localBusinessJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'Maskan Lux',
        image: `${baseUrl}/logo.png`,
        '@id': baseUrl,
        url: baseUrl,
        telephone: CONTACT_PHONE,
        email: 'info@maskanlux.uz',
        address: {
            '@type': 'PostalAddress',
            streetAddress: dict.contact_page?.address_value || 'Yunusobod tumani',
            addressLocality: 'Toshkent',
            addressRegion: 'Toshkent',
            postalCode: '100000',
            addressCountry: 'UZ',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.370609,
            longitude: 69.264079,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '09:00',
            closes: '20:00',
        },
        sameAs: [
            'https://t.me/Khasanov_ibroxim',
            'https://www.instagram.com/_maskan_lux',
        ],
    };

    // ✅ ContactPage JSON-LD
    const contactPageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: dict.contact_page?.title || 'Aloqa',
        description: dict.contact_page?.subtitle || 'Maskan Lux bilan bog\'lanish',
        url: `${baseUrl}/${lang}/contact`,
        mainEntity: {
            '@type': 'Organization',
            name: 'Maskan Lux',
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: CONTACT_PHONE,
                contactType: 'Customer Service',
                availableLanguage: ['uz', 'ru', 'en'],
                areaServed: 'UZ',
            },
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
                name: dict.contact_page?.title || 'Aloqa',
                item: `${baseUrl}/${lang}/contact`,
            },
        ],
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* ✅ Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Header */}
            <div className="bg-slate-900 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">{dict.contact_page.title}</h1>
                <p className="text-emerald-400 text-lg">{dict.contact_page.subtitle}</p>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Card */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">
                            {dict.contact_page.info_title}
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4" itemScope itemType="https://schema.org/PostalAddress">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">
                                        {dict.contact_page.address_label}
                                    </p>
                                    <p className="text-slate-900 font-semibold" itemProp="streetAddress">
                                        {dict.contact_page.address_value}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Phone className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">
                                        {dict.contact_page.phone_label}
                                    </p>
                                    <a
                                        href={`tel:${CONTACT_PHONE}`}
                                        className="text-slate-900 font-semibold hover:text-emerald-600 transition-colors"
                                        itemProp="telephone"
                                    >
                                        {CONTACT_PHONE}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">
                                        {dict.contact_page.email_label}
                                    </p>
                                    <a
                                        href="mailto:info@maskanlux.uz"
                                        className="text-slate-900 font-semibold hover:text-emerald-600 transition-colors"
                                        itemProp="email"
                                    >
                                        info@maskanlux.uz
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Clock className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">
                                        {dict.contact_page.working_hours_label}
                                    </p>
                                    <p className="text-slate-900 font-semibold">
                                        {dict.contact_page.working_hours_value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form and Map */}
                    <div className="lg:col-span-2 space-y-8 z-0 mt-8 lg:mt-0">
                        {/* Contact Form - Client Component */}
                        <ContactForm dict={dict} />

                        {/* Map */}
                        <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 h-[400px] overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d748.5399929399592!2d69.2640792695981!3d41.370609004638915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDIyJzE0LjIiTiA2OcKwMTUnNTMuMCJF!5e0!3m2!1sru!2s!4v1765701131620!5m2!1sru!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '20px' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Maskan Lux manzili"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}