// components/PropertySidebar.tsx - Fixed version with safe checks
'use client';

import { useState } from 'react';
import { Phone, MessageCircle, User, Mail, Send } from 'lucide-react';
import Image from 'next/image';

interface PropertySidebarProps {
    title: string;
    district: string;
    floors: string;
    price?: number; // ✅ Optional
    rieltor?: string | {
        name: string;
        phone: string;
        avatar?: string;
    };
    phone?: string;
    dict: any;
}

export function PropertySidebar({
                                    title,
                                    district,
                                    floors,
                                    price,
                                    rieltor,
                                    phone,
                                    dict,
                                }: PropertySidebarProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: `Salom! Men ${title} ob'ekti haqida ma'lumot olmoqchiman.`,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Parse rieltor data
    const rieltorName = typeof rieltor === 'string' ? rieltor : rieltor?.name;
    const rieltorPhone = typeof rieltor === 'object' ? rieltor?.phone : phone;
    const rieltorAvatar = typeof rieltor === 'object' ? rieltor?.avatar : undefined;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    message: formData.message,
                    property: title,
                    district: district,
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', phone: '', message: '' });
                setTimeout(() => setShowForm(false), 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="sticky top-24">
            {/* Desktop Title */}
            <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
                <p className="text-slate-600">{district}</p>
                {price && (
                    <p className="text-3xl font-bold text-emerald-600 mt-4">
                        ${price.toLocaleString()}
                    </p>
                )}
            </div>

            {/* Contact Card - Original Design */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                {/* Rieltor Info */}
                {rieltorName && (
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                            {rieltorAvatar ? (
                                <Image
                                    src={rieltorAvatar}
                                    alt={rieltorName}
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                />
                            ) : (
                                <User size={32} className="text-slate-600" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Sizning rieltorigiz</p>
                            <p className="text-lg font-bold text-slate-900">{rieltorName}</p>
                        </div>
                    </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {dict.details?.contact_title || 'Bog\'lanish'}
                </h3>

                {/* Contact Buttons - Original Colors */}
                <div className="space-y-3">
                    {rieltorPhone && (
                        <>
                            <a
                                href={`tel:${rieltorPhone}`}
                                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                            >
                                <Phone size={20} />
                                <span>{rieltorPhone}</span>
                            </a>

                            <a
                                href={`https://wa.me/${rieltorPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                            >
                                <MessageCircle size={20} />
                                <span>WhatsApp</span>
                            </a>
                        </>
                    )}

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Mail size={20} />
                        <span>{showForm ? 'Formani yopish' : 'Xabar yuborish'}</span>
                    </button>
                </div>

                {/* Contact Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4 pt-6 border-t border-slate-200">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {dict.contact?.form?.name || 'Ism'}
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Ismingiz"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {dict.contact?.form?.phone || 'Telefon'}
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="+998 XX XXX XX XX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {dict.contact?.form?.message || 'Xabar'}
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Xabaringiz..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Yuborilmoqda...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>{dict.contact?.form?.submit || 'Yuborish'}</span>
                                </>
                            )}
                        </button>

                        {submitStatus === 'success' && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                                ✅ Xabar muvaffaqiyatli yuborildi!
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                                ❌ Xatolik yuz berdi. Qaytadan urinib ko'ring.
                            </div>
                        )}
                    </form>
                )}

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                        📍 {district} | 🏢 {floors}
                    </p>
                </div>
            </div>

            {/* Trust Badges - Original Design */}
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-emerald-600 text-lg">✓</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Tekshirilgan</p>
                            <p className="text-xs text-slate-500">Barcha ma'lumotlar tasdiklangan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-blue-600 text-lg">🛡️</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Xavfsiz</p>
                            <p className="text-xs text-slate-500">Yuridik kafolat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-purple-600 text-lg">⚡</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Tez javob</p>
                            <p className="text-xs text-slate-500">24/7 qo'llab-quvvatlash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}