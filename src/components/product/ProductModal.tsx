"use client";

import { useProductModalStore } from '@/store/useProductModalStore';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { getProductDescription, getWholesalePrice } from '@/lib/product-descriptions';
import { X, ShoppingBag, Heart, Star, Check, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';


export default function ProductModal() {
    const { isOpen, selectedProduct, closeModal } = useProductModalStore();
    const addToCart = useCartStore((state) => state.addItem);
    const currency = useCartStore((state) => state.currency);
    const exchangeRate = useCartStore((state) => state.exchangeRate);


    // Safety check: hooks need to be called unconditionally, but logic depends on selectedProduct
    const [isFavorite, setIsFavorite] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const isFavoriteStore = useFavoritesStore((state) => state.isFavorite);
    const toggleFavoriteStore = useFavoritesStore((state) => state.toggleFavorite);

    // Swipe to dismiss states
    const [startY, setStartY] = useState(0);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (selectedProduct) {
            setIsFavorite(isFavoriteStore(selectedProduct.id));
            setAddedToCart(false);
            setDragY(0);
            // Auto-select first color if product has colors
            setSelectedColor(selectedProduct.colors && selectedProduct.colors.length > 0 ? selectedProduct.colors[0] : undefined);
        }
    }, [selectedProduct, isFavoriteStore, isOpen]);

    // Handle closing on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Only allow downward drag
        if (deltaY > 0) {
            setDragY(deltaY);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        const modalHeight = containerRef.current?.offsetHeight || 0;
        const threshold = modalHeight * 0.5;

        if (dragY > threshold && threshold > 0) {
            closeModal();
        } else {
            setDragY(0);
        }
    };

    if (!isOpen || !selectedProduct) return null;

    const price = currency === 'USD' ? selectedProduct.priceUSD : selectedProduct.priceUSD * exchangeRate;
    const currencySymbol = currency === 'USD' ? '$' : 'Bs.';

    const wholesalePriceUSD = selectedProduct.wholesalePrice;
    const wholesaleMin = selectedProduct.wholesaleMin;
    let wholesalePriceDisplay = null;

    if (wholesalePriceUSD && wholesalePriceUSD > 0) {
        const wholesaleVal = currency === 'USD' ? wholesalePriceUSD : wholesalePriceUSD * exchangeRate;
        let minLabel = '';
        if (wholesaleMin && selectedProduct.requiredTonesCount) {
             minLabel = ` (x${wholesaleMin} unid. o min. ${selectedProduct.requiredTonesCount} tonos distintos)`;
        } else if (wholesaleMin) {
             minLabel = ` (x${wholesaleMin} unid.)`;
        } else if (selectedProduct.requiredTonesCount) {
             minLabel = ` (min. ${selectedProduct.requiredTonesCount} tonos distintos)`;
        }
        wholesalePriceDisplay = `${currencySymbol}${wholesaleVal.toFixed(2)}${minLabel}`;
    }

    const hasColors = selectedProduct.colors && selectedProduct.colors.length > 0;

    const handleAddToCart = () => {
        addToCart(selectedProduct, selectedColor);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleToggleFavorite = () => {
        toggleFavoriteStore(selectedProduct);
        setIsFavorite(!isFavorite); // Optimistic update
    };



    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={closeModal}
            />

            {/* Modal Content - Bottom Sheet on Mobile, Centered Modal on Desktop */}
            <div
                ref={containerRef}
                style={{
                    transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                className={cn(
                    "relative w-full bg-white shadow-2xl overflow-hidden will-change-transform",
                    // Mobile: Bottom Sheet
                    "rounded-t-[32px] max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-500",
                    // Desktop: Centered Modal
                    "md:m-6 md:max-w-4xl md:rounded-3xl md:flex-row md:max-h-[600px] md:animate-in md:zoom-in-95"
                )}
            >
                {/* Mobile Handle Pill - Gesture Zone */}
                <div
                    className="flex justify-center pt-4 pb-4 md:hidden cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* Close Button - Absolute top right */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/40 backdrop-blur-md rounded-full text-slate-800 hover:bg-white hover:text-black transition-all shadow-sm"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Left Side: Product Media (Desktop Only) */}
                <div className="hidden md:flex w-1/2 bg-[#f8f7fa] relative flex-col overflow-hidden">
                    <div className="flex-1 relative w-full h-full">
                        <Image
                            src={selectedProduct.tonesImage && activeImageIndex === 1 ? selectedProduct.tonesImage : selectedProduct.image}
                            alt={selectedProduct.name}
                            fill
                            className="object-contain p-12 drop-shadow-2xl transition-all duration-500 hover:scale-105"
                            priority
                            unoptimized={selectedProduct.image?.includes('.gif')}
                        />
                        {/* Decorative background glow */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none" />
                    </div>

                    {/* Thumbnails Navigator */}
                    {selectedProduct.tonesImage && (
                        <div className="absolute bottom-8 w-full flex justify-center gap-4 px-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <button
                                onClick={() => setActiveImageIndex(0)}
                                className={cn(
                                    "w-16 h-16 relative rounded-[1rem] overflow-hidden border-[3px] transition-all bg-white shadow-xl hover:scale-110",
                                    activeImageIndex === 0 ? "border-primary opacity-100 ring-4 ring-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image src={selectedProduct.image} alt="Main" fill className="object-cover" />
                            </button>
                            <button
                                onClick={() => setActiveImageIndex(1)}
                                className={cn(
                                    "w-16 h-16 relative rounded-[1rem] overflow-hidden border-[3px] transition-all bg-white shadow-xl hover:scale-110",
                                    activeImageIndex === 1 ? "border-primary opacity-100 ring-4 ring-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image src={selectedProduct.tonesImage} alt="Tones" fill className="object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-1 pt-4">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">Tonos</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side / Mobile Main Scroll Area */}
                <div className="w-full md:w-1/2 flex flex-col min-h-0">
                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto pt-2 md:pt-0 min-h-0">

                            {/* Product Media (Mobile Only - Horizontal Carousel) */}
                            <div className="md:hidden w-full bg-gray-50 relative aspect-[14/10] mb-4">
                                <div
                                    className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
                                    onScroll={(e) => {
                                        const container = e.currentTarget;
                                        const index = Math.round(container.scrollLeft / container.clientWidth);
                                        setActiveImageIndex(index);
                                    }}
                                >
                                    {selectedProduct.tonesImage ? (
                                        <>
                                            <div className="flex-shrink-0 w-full h-full relative snap-center bg-[#f8f7fa]">
                                                <Image
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.name}
                                                    fill
                                                    className="object-contain p-6 drop-shadow-xl"
                                                    priority
                                                    unoptimized={selectedProduct.image?.includes('.gif')}
                                                />
                                            </div>
                                            <div className="flex-shrink-0 w-full h-full relative snap-center bg-[#f8f7fa]">
                                                <Image
                                                    src={selectedProduct.tonesImage}
                                                    alt={`${selectedProduct.name} Tonos`}
                                                    fill
                                                    className="object-contain p-6 drop-shadow-xl"
                                                />
                                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xl px-3 py-1.5 text-white rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg border border-white/10">
                                                    Referencia de Tonos
                                                </div>
                                            </div>
                                        </>
                                    ) : selectedProduct.images && selectedProduct.images.length > 0 ? (
                                        selectedProduct.images.map((img, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-full h-full relative snap-center bg-[#f8f7fa]">
                                                <Image
                                                    src={img}
                                                    alt={`${selectedProduct.name} ${idx + 1}`}
                                                    fill
                                                    className="object-contain p-6 drop-shadow-xl"
                                                    priority={idx === 0}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-shrink-0 w-full h-full relative snap-center bg-[#f8f7fa]">
                                            <Image
                                                src={selectedProduct.image}
                                                alt={selectedProduct.name}
                                                fill
                                                className="object-contain p-6 drop-shadow-xl"
                                                priority
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    {(selectedProduct.tonesImage ? [0, 1] : selectedProduct.images && selectedProduct.images.length > 1 ? selectedProduct.images : []).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                activeImageIndex === idx ? "bg-white w-4 scale-110 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/40"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Floating Info Badge on Image (Mobile) */}
                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary border border-primary/20 shadow-sm uppercase tracking-wider">
                                        {selectedProduct.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 md:p-10 space-y-6">
                                {/* Header Content */}
                                <div>
                                    <p className="hidden md:block text-primary font-bold text-sm uppercase tracking-wider mb-1">
                                        {selectedProduct.category}
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-black text-background-dark leading-tight font-brand uppercase italic">
                                        {selectedProduct.name}
                                    </h2>

                                </div>

                                {/* Price Display */}
                                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <span className="text-3xl font-black text-primary">
                                            {currencySymbol}{price.toFixed(2)}
                                        </span>
                                        {currency === 'USD' && (
                                            <span className="text-sm font-medium text-slate-400">
                                                / Bs.{(selectedProduct.priceUSD * exchangeRate).toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {wholesalePriceDisplay && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">
                                            <Sparkles className="w-3 h-3" />
                                            Precio Mayor: {wholesalePriceDisplay}
                                        </div>
                                    )}
                                </div>

                                {/* Product Description */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Descripción</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {getProductDescription(selectedProduct)}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            Envío inmediato
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            Original garantizado
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Sticky Action Bar */}
                        <div className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 mt-auto space-y-4">

                            {/* Color/Tone Selector */}
                            {hasColors && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tono seleccionado</p>
                                        {selectedColor && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedColor}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProduct.colors!.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all",
                                                    selectedColor === color
                                                        ? "bg-primary text-white border-primary shadow-md shadow-primary/30 scale-105"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
                                                )}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={selectedProduct.description?.toLowerCase().includes('agotado')}
                                    className={cn(
                                        "flex-1 relative py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                                        addedToCart
                                            ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                            : "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-xl shadow-primary/30 border-b-4 border-primary-dark/30 hover:brightness-110"
                                    )}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-5 h-5 animate-in zoom-in" />
                                            ¡Listo!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            Agregar
                                        </>
                                    )}
                                </button>

                            </div>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Eleva tu belleza • Calidad Premium
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    );
}
