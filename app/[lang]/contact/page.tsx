import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { CONTACT_PHONE } from '@/constants';
import { Button } from '@/components/ui/Button';

interface Props {
  params: Promise<{ lang: Locale }>;
}

export const metadata = {
  title: 'Aloqa | Maskan Lux',
  description: 'Maskan Lux bilan bog\'lanish.',
};

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
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-xl font-bold text-slate-900 mb-6">{dict.contact.title}</h3>
               <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.name}</label>
                      <input type="text" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.phone}</label>
                      <input type="tel" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+998" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.message}</label>
                    <textarea rows={5} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder={dict.contact.form.message_placeholder}></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button size="lg" className="w-full md:w-auto">
                      <Send size={18} className="mr-2" /> {dict.contact.form.submit}
                    </Button>
                  </div>
               </form>
            </div>

            {/* Map */}
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 h-[400px] overflow-hidden">
               <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.2642674987034!2d69.2796248!3d41.2995958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8ad5a7a53609%3A0x6b4c9197c36b4e07!2sOybek%20metro%20station!5e0!3m2!1sen!2s!4v1716300000000!5m2!1sen!2s" 
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