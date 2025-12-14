// components/Gallery.tsx - Improved version
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';

interface GalleryProps {
    images: string[];
    title: string;
}

export function Gallery({ images, title }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

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

    // ✅ Keyboard navigation
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'Escape':
                    setIsModalOpen(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, selectedIndex]);

    // ✅ Touch/Swipe handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrevious();
        }
    };

    // ✅ Mouse wheel handler for desktop
    const handleWheel = (e: React.WheelEvent) => {
        if (!isModalOpen) return;

        e.preventDefault();
        if (e.deltaY > 0) {
            handleNext();
        } else if (e.deltaY < 0) {
            handlePrevious();
        }
    };

    // ✅ Image loading handler
    const handleImageLoad = (index: number) => {
        setLoadingImages((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    };

    const handleImageLoadStart = (index: number) => {
        setLoadingImages((prev) => new Set(prev).add(index));
    };

    // ✅ Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    return (
        <>
            {/* Main Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                {/* Main Image */}
                <div
                    className="relative h-[400px] md:h-[500px] bg-slate-100"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Loading Spinner */}
                    {loadingImages.has(selectedIndex) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        </div>
                    )}

                    <Image
                        src={images[selectedIndex]}
                        alt={`${title} - Rasm ${selectedIndex + 1}`}
                        fill
                        className="object-contain cursor-pointer"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority={selectedIndex === 0}
                        loading={selectedIndex === 0 ? 'eager' : 'lazy'}
                        onClick={() => setIsModalOpen(true)}
                        onLoadingComplete={() => handleImageLoad(selectedIndex)}
                        onLoadStart={() => handleImageLoadStart(selectedIndex)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                            handleImageLoad(selectedIndex);
                        }}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20"
                                aria-label="Oldingi rasm"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20"
                                aria-label="Keyingi rasm"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium z-20">
                        {selectedIndex + 1} / {images.length}
                    </div>

                    {/* Swipe Indicator (Mobile) */}
                    <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-xs z-20">
                        ← Surish →
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
                                            ? 'border-emerald-600 scale-105 ring-2 ring-emerald-200'
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
                    ref={modalRef}
                    style={{margin:"0"}}
                    className="fixed top-0 m-0 inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setIsModalOpen(false)}
                    onWheel={handleWheel}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(false);
                        }}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-30 backdrop-blur-sm"
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-30 backdrop-blur-sm"
                                aria-label="Oldingi"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-30 backdrop-blur-sm"
                                aria-label="Keyingi"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Counter & Instructions */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
                        <div className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium">
                            {selectedIndex + 1} / {images.length}
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-white/70 text-sm">
                            <span>← → Klaviatura</span>
                            <span>•</span>
                            <span>ESC Yopish</span>
                            <span>•</span>
                            <span>Mouse wheel</span>
                        </div>
                        <div className="md:hidden text-white/70 text-sm">
                            Surish yoki bosing
                        </div>
                    </div>

                    {/* Loading Spinner in Modal */}
                    {loadingImages.has(selectedIndex) && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <Loader2 className="w-16 h-16 text-white animate-spin" />
                        </div>
                    )}

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
                            onLoadingComplete={() => handleImageLoad(selectedIndex)}
                            onLoadStart={() => handleImageLoadStart(selectedIndex)}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.jpg';
                                handleImageLoad(selectedIndex);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}