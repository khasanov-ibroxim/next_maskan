"use client";

import React, { useState } from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface ContactProps {
  dict: any;
}

export const ContactSection = ({ dict }: ContactProps) => {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setStatus('success');
      setForm({ name: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };


  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{dict.contact.title}</h2>
            <p className="text-slate-300 mb-8 text-lg">
              {dict.contact.desc}
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">{dict.contact.call}</p>
                <p className="text-xl font-bold">+998 97 085 06 04</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl text-slate-900 shadow-2xl">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{dict.contact.form.success_title}</h3>
                <p className="text-slate-500 text-center">{dict.contact.form.success_desc}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.name}</label>
                  <input required type="text" className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                         onChange={e => setForm({ ...form, name: e.target.value })}
                         value={form.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.phone}</label>
                  <input required type="tel" className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+998"
                         value={form.phone}
                         onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{dict.contact.form.message}</label>
                  <textarea rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder={dict.contact.form.message_placeholder}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>
                <Button type="submit" fullWidth variant="secondary" size="lg">
                  {dict.contact.form.submit}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};