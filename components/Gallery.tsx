'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';

interface GalleryProps {
    images: string[];
    title: string;
}

export function Gallery({ images, title }: GalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
    console.log(images);
    // ✅ Keyboard navigation
    useState(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    });

    if (!images || images.length === 0) {
        return (
            <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-slate-500">Rasmlar mavjud emas</p>
            </div>
        );
    }

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set([...prev, index]));
    };

    const handleImageError = (index: number) => {
        setFailedImages(prev => new Set([...prev, index]));
        console.error(`❌ Image failed to load: ${images[index]}`);
    };

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length);
        }
    };

    // Filter out failed images
    const validImages = images.filter((_, index) => !failedImages.has(index));

    return (
        <>
            {/* Main Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Main Image */}
                <div
                    className="relative h-[400px] md:h-[500px] bg-slate-100 cursor-pointer group"
                    onClick={() => openLightbox(0)}
                >
                    {!loadedImages.has(0) && !failedImages.has(0) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
                        </div>
                    )}

                    {!failedImages.has(0) && (
                        <Image
                            src={images[0]}
                            alt={`${title} - Main`}
                            fill
                            className={`object-contain transition-opacity duration-300 ${
                                loadedImages.has(0) ? 'opacity-100' : 'opacity-0'
                            }`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                            priority
                            onLoad={() => handleImageLoad(0)}
                            onError={() => handleImageError(0)}
                            unoptimized={images[0].includes('194.163.140.30')} // Skip optimization for local server
                        />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-semibold">
              🔍 Ko'rish
            </span>
                    </div>
                </div>

                {/* Thumbnails */}
                {validImages.length > 1 && (
                    <div className="p-4 bg-slate-50">
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {validImages.slice(0, 8).map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                        index === 0
                                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                                            : 'border-slate-200 hover:border-emerald-400'
                                    }`}
                                    onClick={() => openLightbox(index)}
                                >
                                    {!loadedImages.has(index) && !failedImages.has(index) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                                            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                        </div>
                                    )}

                                    <Image
                                        src={image}
                                        alt={`${title} - ${index + 1}`}
                                        fill
                                        className={`object-cover transition-all duration-300 ${
                                            loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        sizes="150px"
                                        onLoad={() => handleImageLoad(index)}
                                        onError={() => handleImageError(index)}
                                        unoptimized={image.includes('194.163.140.30')}
                                    />
                                </div>
                            ))}

                            {validImages.length > 8 && (
                                <div
                                    className="relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 border-slate-200 hover:border-emerald-400 bg-slate-200 flex items-center justify-center"
                                    onClick={() => openLightbox(8)}
                                >
                  <span className="text-slate-600 font-bold text-sm">
                    +{validImages.length - 8}
                  </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white hover:text-emerald-400 transition-colors z-10"
                        onClick={closeLightbox}
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 text-white hover:text-emerald-400 transition-colors z-10 bg-black bg-opacity-50 p-3 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                            >
                                <ChevronLeft size={32} />
                            </button>

                            <button
                                className="absolute right-4 text-white hover:text-emerald-400 transition-colors z-10 bg-black bg-opacity-50 p-3 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 text-white font-semibold text-lg bg-black bg-opacity-50 px-4 py-2 rounded-full">
                        {selectedImage + 1} / {validImages.length}
                    </div>

                    {/* Main Image */}
                    <div
                        className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!loadedImages.has(selectedImage) && !failedImages.has(selectedImage) && (
                            <Loader2 className="w-16 h-16 text-white animate-spin absolute" />
                        )}

                        <Image
                            src={validImages[selectedImage]}
                            alt={`${title} - ${selectedImage + 1}`}
                            fill
                            className={`object-contain transition-opacity duration-300 ${
                                loadedImages.has(selectedImage) ? 'opacity-100' : 'opacity-0'
                            }`}
                            sizes="100vw"
                            priority
                            onLoad={() => handleImageLoad(selectedImage)}
                            onError={() => handleImageError(selectedImage)}
                            unoptimized={validImages[selectedImage].includes('194.163.140.30')}
                        />
                    </div>

                    {/* Keyboard Hint */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
                        ← → klavishlar bilan boshqaring • ESC yopish
                    </div>
                </div>
            )}
        </>
    );
}