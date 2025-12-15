// components/PropertySidebar.tsx - With Share functionality
'use client';

import { useState } from 'react';
import { Phone, User, Mail, Send, Share2 } from 'lucide-react';
import Image from 'next/image';
import {formatPrice} from "@/lib/api.ts";

interface PropertySidebarProps {
    title: string;
    district: string;
    floors: string;
    price?: number;
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
        message: `Salom! Men ${district} , ${floors} ob'ekti haqida ma'lumot olmoqchiman. rieltor ${rieltor} ning uyi`,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [shareSuccess, setShareSuccess] = useState(false);

    // Parse rieltor data
    const rieltorName = typeof rieltor === 'string' ? rieltor : rieltor?.name;
    const rieltorPhone = typeof rieltor === 'object' ? rieltor?.phone : phone;
    const rieltorAvatar = typeof rieltor === 'object' ? rieltor?.avatar : undefined;

    // ✅ Share functionality
    const handleShare = async () => {
        const shareData = {
            title: title,
            text: `${title}\n📍 ${district}\n${price ? `💰 Narx: $${price.toLocaleString()}` : ''}\n🏢 ${floors}`,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            // Web Share API (mobile & modern browsers)
            if (navigator.share) {
                await navigator.share(shareData);
                setShareSuccess(true);
                setTimeout(() => setShareSuccess(false), 2000);
            } else {
                // Fallback: Copy to clipboard
                const textToCopy = `${shareData.title}\n${shareData.text}\n\n🔗 ${shareData.url}`;
                await navigator.clipboard.writeText(textToCopy);
                setShareSuccess(true);
                setTimeout(() => setShareSuccess(false), 2000);
            }
        } catch (error) {
            console.error('Share error:', error);
        }
    };

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
                <p className="text-slate-600">📍 {district} | 🏢 {floors}</p>
                {price && (
                    <p className="text-3xl font-bold text-emerald-600 mt-4">
                        {formatPrice(price)} y.e.
                    </p>
                )}
            </div>

            {/* Contact Card */}
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
                            <p className="text-sm text-slate-500">{dict.details.realtor}</p>
                            <p className="text-lg font-bold text-slate-900">{rieltorName}</p>
                        </div>
                    </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {dict.contact_page?.title || 'Bog\'lanish'}
                </h3>

                {/* Contact Buttons */}
                <div className="space-y-3">
                    {/* Main Phone - Always visible */}
                    <a
                        href="tel:+998970850604"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Phone size={20} />
                        <span>+998 97 085 06 04</span>
                    </a>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm relative"
                    >
                        <Share2 size={20} />
                        <span>{dict.details?.share}</span>
                        {shareSuccess && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                                ✓
                            </span>
                        )}
                    </button>

                    {/* Show Form Button */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Mail size={20} />
                        <span>{showForm ? dict.contact?.form.close_form : dict.contact?.form.send_msg}</span>
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
                                placeholder={dict.contact?.form?.name}
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
                                placeholder={dict.contact?.form?.message}
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
                                    <span>{dict.contact?.form?.sending}</span>
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
                                ✅ {dict.contact?.form?.success_title}  {dict.contact?.form?.success_desc}
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                                ❌ {dict.contact?.form?.error} <a href="tel:+998970850604">+998 97 085 06 04</a>
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

            {/* Trust Badges */}
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-emerald-600 text-lg">✓</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{dict.details.check}</p>
                            <p className="text-xs text-slate-500">{dict.details.check_dsc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-blue-600 text-lg">🛡️</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{dict.details.privat}</p>
                            <p className="text-xs text-slate-500">{dict.details.privat_dsc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-purple-600 text-lg">⚡</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{dict.details.fast_msg}</p>
                            <p className="text-xs text-slate-500">{dict.details.fast_msg_dsc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}