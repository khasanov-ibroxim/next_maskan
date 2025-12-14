// app/[lang]/contact/page.tsx - Server Component
import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACT_PHONE } from '@/constants';
import { ContactForm } from '@/components/ContactForm.tsx';

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

export async function generateMetadata({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return {
        title: `${dict.contact_page?.title || 'Aloqa'} | Maskan Lux`,
        description: dict.contact_page?.subtitle || 'Maskan Lux bilan bog\'lanish.',
    };
}

export default async function ContactPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">{dict.contact_page.title}</h1>
                <p className="text-emerald-400 text-lg">{dict.contact_page.subtitle}</p>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Card */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">{dict.contact_page.info_title}</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">{dict.contact_page.address_label}</p>
                                    <p className="text-slate-900 font-semibold">{dict.contact_page.address_value}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Phone className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">{dict.contact_page.phone_label}</p>
                                    <p className="text-slate-900 font-semibold">{CONTACT_PHONE}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">{dict.contact_page.email_label}</p>
                                    <p className="text-slate-900 font-semibold">info@maskanlux.uz</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Clock className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">{dict.contact_page.working_hours_label}</p>
                                    <p className="text-slate-900 font-semibold">{dict.contact_page.working_hours_value}</p>
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
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}