"use client";

import { useFavoritesStore } from '@/store/useFavoritesStore';
import ProductCard from '@/components/product/ProductCard';
import { Heart, ChevronRight, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
    const favorites = useFavoritesStore((state) => state.favorites);
    const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 min-h-[80vh]">

            {/* Breadcrumbs & Hero - Only shown if there are items */}
            {favorites.length > 0 && (
                <div className="mb-6 md:mb-8 space-y-1 md:space-y-2">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <ChevronRight className="w-2.5 h-2.5" />
                        <span className="text-primary">Mis Favoritos</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-1 text-background-dark leading-none">Tus Favoritos</h1>
                            <p className="text-sm md:text-lg text-primary/60 font-semibold max-w-xl leading-snug">
                                Aquí están los productos que has guardado. ¡No los dejes escapar!
                            </p>
                        </div>
                        <button
                            onClick={clearFavorites}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-red-500/20 active:scale-95 group"
                        >
                            <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            Vaciar Favoritos
                        </button>
                    </div>
                </div>
            )}

            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative w-32 h-32 bg-white/50 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center shadow-2xl">
                            <Heart className="w-12 h-12 text-primary/60" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-background-dark mb-4 tracking-tighter uppercase italic">Tu lista está vacía</h2>
                    <p className="text-lg text-primary/60 max-w-md mb-8">
                        Aún no has agregado ningún producto a tus favoritos. Explora nuestro catálogo y guarda lo que más te guste.
                    </p>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-background-dark text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 group"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Explorar Catálogo
                    </Link>
                </div>
            )}
        </div>
    );
}
