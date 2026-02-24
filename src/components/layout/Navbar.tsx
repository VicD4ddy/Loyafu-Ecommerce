"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, ArrowRight, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const setExchangeRate = useCartStore((state) => state.setExchangeRate);
    const [scrolled, setScrolled] = useState(false);
    const [cartAnimate, setCartAnimate] = useState(false);
    const [favAnimate, setFavAnimate] = useState(false);
    const [bcvRate, setBcvRate] = useState<number | null>(null);

    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const favorites = useFavoritesStore((state) => state.favorites);
    const favCount = favorites.length;

    // Dynamic Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch BCV Rate
    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
                    next: { revalidate: 3600 }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.promedio) {
                        setBcvRate(data.promedio);
                        setExchangeRate(data.promedio);
                        return;
                    }
                }
            } catch (error) {
                console.warn("Could not fetch BCV rate, using fallback.", error);
            }
        };
        fetchRate();
    }, [setExchangeRate]);

    // Cart Animation Trigger
    useEffect(() => {
        if (cartCount > 0) {
            setCartAnimate(true);
            const timer = setTimeout(() => setCartAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    // Fav Animation Trigger
    useEffect(() => {
        if (favCount > 0) {
            setFavAnimate(true);
            const timer = setTimeout(() => setFavAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [favCount]);

    const isActive = (path: string) => pathname === path;

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const term = e.currentTarget.value.trim();
            if (term) {
                router.push(`/catalog?q=${encodeURIComponent(term)}`);
            }
        }
    };

    return (
        <>
            <nav className={cn(
                "fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out px-4",
                scrolled ? "top-4" : "top-0 md:top-2"
            )}>
                <div className={cn(
                    "relative mx-auto transition-all duration-500 ease-in-out flex items-center gap-3 md:gap-8",
                    scrolled
                        ? "w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-full shadow-2xl shadow-primary/10 border border-primary/20 px-3 md:px-6 py-1.5 md:py-1"
                        : "w-full max-w-7xl px-4 md:px-6 py-2 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm"
                )}>
                    {/* High-End Glow Line (on scroll) */}
                    {scrolled && (
                        <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-in fade-in zoom-in duration-1000" />
                    )}

                    {/* Logo Section - Left on Desktop, Hidden on Mobile (moved to right) */}
                    <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className={cn(
                                "relative transition-all duration-500",
                                scrolled ? "w-28 h-8 md:w-56 md:h-16" : "w-36 h-12 md:w-64 md:h-20",
                                "group-hover:scale-105"
                            )}>
                                <Image
                                    src="/assets/brand/logo-main.png"
                                    alt="Loyafu Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {['Inicio', 'Instrucciones', 'Promociones', 'Tienda'].map((label, idx) => {
                                const paths = ['/', '/instructions', '/#promociones', '/catalog'];
                                return (
                                    <Link
                                        key={label}
                                        href={paths[idx]}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-bold transition-all",
                                            isActive(paths[idx]) ? "bg-primary/10 text-primary" : "text-slate-700 hover:text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Bar - Aesthetic Mobile & Desktop */}
                    <div className="flex-1 flex items-center min-w-0">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                className="w-full bg-primary/5 border border-primary/10 rounded-2xl md:rounded-full py-2.5 md:py-2 pl-11 pr-4 text-sm font-bold placeholder:text-primary/30 text-background-dark focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all shadow-inner"
                                placeholder="Busca en Loyafu..."
                                type="text"
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Actions & Mobile Logo */}
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        {/* Favorites & Cart - Hidden on Mobile */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Favorites */}
                            <Link
                                href="/favorites"
                                className={cn(
                                    "relative p-2 md:p-2.5 rounded-xl md:rounded-full border border-primary/10 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-background-dark group",
                                    favAnimate && "animate-bounce"
                                )}
                            >
                                <Heart className={cn("w-5 h-5 group-hover:fill-current transition-all", favCount > 0 ? "text-red-500 fill-current" : "")} />
                                {favCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                        {favCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className={cn(
                                    "relative p-2 md:p-2.5 rounded-xl md:rounded-full border border-primary/10 hover:bg-primary/20 hover:border-primary/30 transition-all text-background-dark group",
                                    cartAnimate && "animate-bounce"
                                )}
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:text-primary transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Logo on the Right */}
                        <Link href="/" className="md:hidden flex-shrink-0 ml-1">
                            <div className={cn(
                                "relative transition-all duration-500",
                                scrolled ? "w-16 h-8" : "w-18 h-10"
                            )}>
                                <Image
                                    src="/assets/brand/logo-main.png"
                                    alt="Loyafu Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
