"use client";

import { useFavoritesStore } from '@/store/useFavoritesStore';
import ProductCard from '@/components/product/ProductCard';
import { Heart, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-8 min-h-[80vh]">

            {/* Breadcrumbs & Hero */}
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
                    {favorites.length > 0 && (
                        <button
                            onClick={clearFavorites}
                            className="text-red-500 hover:text-red-700 font-bold text-sm underline transition-colors"
                        >
                            Limpiar lista
                        </button>
                    )}
                </div>
            </div>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                    <div className="bg-primary/5 p-8 rounded-full mb-6">
                        <Heart className="w-16 h-16 text-primary/30" />
                    </div>
                    <h2 className="text-3xl font-black text-background-dark mb-4">Tu lista está vacía</h2>
                    <p className="text-lg text-primary/60 max-w-md mb-8">
                        Aún no has agregado ningún producto a tus favoritos. Explora nuestro catálogo y guarda lo que más te guste.
                    </p>
                    <Link
                        href="/catalog"
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Ir a la tienda
                    </Link>
                </div>
            )}
        </div>
    );
}
