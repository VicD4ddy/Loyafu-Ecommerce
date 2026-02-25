"use client";

import Image from 'next/image';
import { ShoppingCart, Heart, Sparkles, Percent, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore, Product } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useProductModalStore } from '@/store/useProductModalStore';
import { getProductDescription, getWholesalePrice, getWholesaleMin } from '@/lib/product-descriptions';
import { useToastStore } from '@/components/ui/Toast';
import { useState, useEffect } from 'react';

// Auto-detect badge from product description
function detectBadge(product: Product): Product['badge'] | undefined {
    const desc = (product.description || '').toLowerCase();
    if (desc.includes('promo') || desc.includes('2 x') || desc.includes('2x') || desc.includes('oferta')) return 'promo';
    if (desc.includes('agotado') || desc.includes('solo disponible una')) return 'agotado';
    return undefined;
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    // Detect badge from data or description
    const badge = product.badge || detectBadge(product);
    const addToCart = useCartStore((state) => state.addItem);
    const currency = useCartStore((state) => state.currency);
    const exchangeRate = useCartStore((state) => state.exchangeRate);

    const [mounted, setMounted] = useState(false);

    // Safety check for hooks
    const favorites = useFavoritesStore((state) => state.favorites);
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
    const openModal = useProductModalStore((state) => state.openModal);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const hasMultipleImages = product.images && product.images.length > 1;
    const allImages = hasMultipleImages ? product.images! : [product.image];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const isFavorite = mounted ? favorites.some((p) => p.id === product.id) : false;

    const price = currency === 'USD' ? product.priceUSD : product.priceUSD * exchangeRate;
    const currencySymbol = currency === 'USD' ? '$' : 'Bs.';

    // Calculate wholesale price
    const wholesalePriceStr = getWholesalePrice(product);
    let wholesalePriceDisplay = null;

    if (wholesalePriceStr) {
        const wholesaleUSD = parseFloat(wholesalePriceStr);
        if (!isNaN(wholesaleUSD)) {
            const wholesaleVal = currency === 'USD' ? wholesaleUSD : wholesaleUSD * exchangeRate;
            wholesalePriceDisplay = `${currencySymbol}${wholesaleVal.toFixed(2)}`;
        }
    }

    const showToast = useToastStore((state) => state.showToast);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        showToast(`✓ ${product.name} agregado al carrito`);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(product);
    };

    const handleCardClick = () => {
        openModal(product);
    };

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={() => hasMultipleImages && mounted && window.innerWidth > 768 && setCurrentImageIndex(1)}
            onMouseLeave={() => hasMultipleImages && mounted && window.innerWidth > 768 && setCurrentImageIndex(0)}
            className="group relative bg-white rounded-xl p-2.5 md:p-3 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10 shadow-xl shadow-primary/5 border border-transparent hover:border-primary/5 cursor-pointer animate-fadeInUp"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-2 bg-gray-100">
                {/* Badge */}
                {badge && (
                    <span className={cn(
                        "absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md",
                        badge === 'nuevo' && "bg-blue-500 text-white",
                        badge === 'promo' && "bg-amber-400 text-amber-900",
                        badge === 'agotado' && "bg-red-500 text-white"
                    )}>
                        {badge === 'nuevo' && <><Sparkles className="w-3 h-3" /> Nuevo</>}
                        {badge === 'promo' && <><Percent className="w-3 h-3" /> Promo</>}
                        {badge === 'agotado' && <><AlertCircle className="w-3 h-3" /> Agotado</>}
                    </span>
                )}
                <div className="flex transition-transform duration-500 ease-out h-full w-full" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {allImages.map((img, idx) => (
                        <div key={idx} className="relative flex-shrink-0 w-full h-full">
                            <Image
                                src={img}
                                alt={`${product.name} ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 250px"
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Multiple Images Indicators */}
                {hasMultipleImages && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {allImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    currentImageIndex === idx ? "bg-primary w-3" : "bg-primary/20"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile Tap Arrows (Only visible if multiple images) */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Invisible tap areas for mobile swipe simulation */}
                        <div className="md:hidden absolute inset-y-0 left-0 w-1/3 z-10" onClick={prevImage} />
                        <div className="md:hidden absolute inset-y-0 right-0 w-1/3 z-10" onClick={nextImage} />
                    </>
                )}

                {/* Favorite Button - Premium Glassmorphism */}
                <button
                    onClick={handleToggleFavorite}
                    className={cn(
                        "absolute top-3 right-3 w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-xl z-20 group/fav",
                        isFavorite
                            ? "text-red-500 bg-white/95 ring-1 ring-red-100 scale-105"
                            : "text-primary/40 bg-white/40 hover:bg-white hover:text-primary border border-white/20"
                    )}
                >
                    <Heart className={cn(
                        "w-4.5 h-4.5 transition-all duration-300 group-active/fav:scale-75",
                        isFavorite && "fill-current animate-hover-pop"
                    )} />
                </button>

                {/* Quick Add Button — Mobile Only */}
                <div className="absolute bottom-3 right-3 z-30 md:hidden">
                    <button
                        onClick={handleAddToCart}
                        disabled={badge === 'agotado'}
                        className={cn(
                            "w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-95 group/cart",
                            badge === 'agotado'
                                ? "bg-slate-300/80 backdrop-blur-sm text-slate-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 shadow-primary/40 ring-4 ring-primary/10"
                        )}
                    >
                        <ShoppingCart className="w-5 h-5 transition-transform group-hover/cart:scale-110" />

                        {/* Shimmer Effect on hover */}
                        {!badge && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cart:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        )}
                    </button>
                </div>

                {/* Desktop "Agregar" Bar (Still present for desktop hover feel) */}
                <div className="hidden md:block absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20">
                    <button
                        onClick={handleAddToCart}
                        disabled={badge === 'agotado'}
                        className="w-full bg-primary/95 backdrop-blur-md text-white font-bold py-2.5 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {badge === 'agotado' ? 'Agotado' : 'Agrega'}
                    </button>
                </div>
            </div>

            <div className="space-y-0">

                <h3 className="font-bold text-base md:text-lg text-background-dark group-hover:text-primary transition-colors truncate">
                    {product.name}
                </h3>
                <p className="text-[10px] md:text-sm text-primary/60 font-medium">{product.category}</p>
                <p className="hidden md:block text-[10px] text-slate-500 mt-0.5 line-clamp-2 italic">
                    {getProductDescription(product)}
                </p>

                <div className="flex items-center justify-between pt-0.5">
                    <div className="flex flex-col">
                        {product.priceUSD === 0 ? (
                            <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                                Consultar precio
                            </span>
                        ) : (
                            <>
                                <span className="text-lg font-black text-primary">
                                    {currencySymbol}{price.toFixed(2)}
                                    {currency === 'USD' && (
                                        <span className="text-xs font-medium text-slate-400 ml-1">
                                            / Bs.{(product.priceUSD * exchangeRate).toFixed(2)}
                                        </span>
                                    )}
                                </span>
                                {wholesalePriceDisplay && (
                                    <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 border border-green-100 flex items-center gap-1 w-fit">
                                        Mayor: {wholesalePriceDisplay}
                                        {getWholesaleMin(product) && (
                                            <span className="opacity-60 font-black">
                                                (min. {getWholesaleMin(product)})
                                            </span>
                                        )}
                                    </span>
                                )}
                                <span className="text-[8px] md:text-[9px] text-slate-400 font-medium italic mt-0.5">
                                    Nuestros precios no incluyen IVA
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
