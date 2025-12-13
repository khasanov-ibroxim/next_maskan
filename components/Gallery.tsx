'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

interface GalleryProps {
    images: string[];
    title: string;
}

export function Gallery({ images, title }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    // ✅ Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isModalOpen) return;

        switch (e.key) {
            case 'Escape':
                setIsModalOpen(false);
                setZoom(1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                setZoom(1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                setSelectedIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                setZoom(1);
                break;
            case '+':
            case '=':
                e.preventDefault();
                setZoom(prev => Math.min(prev + 0.2, 3));
                break;
            case '-':
                e.preventDefault();
                setZoom(prev => Math.max(prev - 0.2, 0.5));
                break;
        }
    }, [isModalOpen, images.length]);

    // ✅ Add/remove keyboard listener
    useEffect(() => {
        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // ✅ Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, handleKeyDown]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
        setZoom(1);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setZoom(1);
    };

    const goToPrevious = () => {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
        setZoom(1);
    };

    const goToNext = () => {
        setSelectedIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
        setZoom(1);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.5));
    };

    if (images.length === 0) {
        return (
            <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-slate-500">Rasmlar yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
                {/* Main Image */}
                <div
                    className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => openModal(0)}
                >
                    <Image
                        src={images[0]}
                        alt={`${title} - Main`}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="opacity-0 group-hover:opacity-100 text-white transition-opacity" size={40} />
                    </div>
                </div>

                {/* Thumbnail Grid */}
                {images.slice(1, 5).map((image, index) => (
                    <div
                        key={index + 1}
                        className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
                        onClick={() => openModal(index + 1)}
                    >
                        <Image
                            src={image}
                            alt={`${title} - ${index + 2}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <ZoomIn className="opacity-0 group-hover:opacity-100 text-white transition-opacity" size={24} />
                        </div>
                        {index === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">+{images.length - 5}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Full-screen Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
                    onClick={closeModal}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-[10000] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 z-[10000] px-4 py-2 rounded-full bg-white/10 text-white font-medium">
                        {selectedIndex + 1} / {images.length}
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10000] flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleZoomOut();
                            }}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Zoom Out"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleZoomIn();
                            }}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Zoom In"
                        >
                            <ZoomIn size={20} />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 z-[10000] p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft size={32} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 z-[10000] p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* ✅ Main Image with zoom */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - ${selectedIndex + 1}`}
                            width={1920}
                            height={1080}
                            className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
                            priority
                        />
                    </div>

                    {/* ✅ Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] flex gap-2 overflow-x-auto max-w-[90vw] px-4 py-2 bg-black/30 rounded-full">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(index);
                                        setZoom(1);
                                    }}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                        index === selectedIndex
                                            ? 'border-emerald-500 scale-110'
                                            : 'border-white/30 hover:border-white/60'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ✅ Keyboard Hints */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[10000] text-white/60 text-sm text-center">
                        <p>← → : Navigate | ESC : Close | +/- : Zoom</p>
                    </div>
                </div>
            )}
        </>
    );
}