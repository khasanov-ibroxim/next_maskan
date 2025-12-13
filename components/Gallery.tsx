'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
    images: string[];
    title: string;
}

export function Gallery({ images, title }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Handle empty or invalid images
    if (!images || images.length === 0) {
        return (
            <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-slate-500">Rasmlar yuklanmoqda...</p>
            </div>
        );
    }

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isModalOpen) return;

        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') setIsModalOpen(false);
    };

    // ✅ Add keyboard listeners
    useState(() => {
        window.addEventListener('keydown', handleKeyDown as any);
        return () => window.removeEventListener('keydown', handleKeyDown as any);
    });

    return (
        <>
            {/* Main Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                {/* Main Image */}
                <div className="relative h-[400px] md:h-[500px] bg-slate-100">
                    <Image
                        src={images[selectedIndex]}
                        alt={`${title} - Rasm ${selectedIndex + 1}`}
                        fill
                        className="object-contain cursor-pointer"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority
                        onClick={() => setIsModalOpen(true)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                        }}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                aria-label="Oldingi rasm"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                aria-label="Keyingi rasm"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="p-4 bg-slate-50">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                        index === selectedIndex
                                            ? 'border-emerald-600 scale-105'
                                            : 'border-transparent hover:border-slate-300'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder.jpg';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Full Screen Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all z-10"
                        aria-label="Yopish"
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-10"
                                aria-label="Oldingi"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-10"
                                aria-label="Keyingi"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-6 py-3 rounded-full text-lg font-medium z-10">
                        {selectedIndex + 1} / {images.length}
                    </div>

                    {/* Image */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - Rasm ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.jpg';
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}