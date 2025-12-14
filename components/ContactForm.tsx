// components/ContactForm.tsx - Client Component
'use client';

import React, {useState} from 'react';
import {Send, CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/Button';

interface ContactFormProps {
    dict: any;
}

export function ContactForm({dict}: ContactFormProps) {
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setStatus('success');
            setForm({name: '', phone: '', message: ''});
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div
                        className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32}/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {dict.contact?.form?.success_title || 'Muvaffaqiyatli yuborildi!'}
                    </h3>
                    <p className="text-slate-500 text-center">
                        {dict.contact?.form?.success_desc || "Tez orada siz bilan bog'lanamiz"}
                    </p>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                        {dict.contact?.title || 'Aloqa'}
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {dict.contact?.form?.name || 'Ism'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    value={form.name}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {dict.contact?.form?.phone || 'Telefon'}
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="+998"
                                    value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {dict.contact?.form?.message || 'Xabar'}
                            </label>
                            <textarea
                                rows={5}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder={dict.contact?.form?.message_placeholder || 'Xabaringizni yozing...'}
                                value={form.message}
                                onChange={(e) => setForm({...form, message: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" size="lg" className="w-full md:w-auto">
                                <Send size={18} className="mr-2"/>
                                {dict.contact?.form?.submit || 'Yuborish'}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}