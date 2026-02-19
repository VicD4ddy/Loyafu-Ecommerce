"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, ArrowRight, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { cn } from '@/lib/utils';
// import Logo from '@/components/ui/Logo'; // Removed in favor of image logo

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const setExchangeRate = useCartStore((state) => state.setExchangeRate);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
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
                // Attempt to fetch from API
                const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
                    next: { revalidate: 3600 } // Cache for 1 hour
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
            // Fallback rate if API fails (e.g. 60.00) or just leave as null
            // setBcvRate(60.00); 
        };
        fetchRate();
    }, []);

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const term = e.currentTarget.value.trim();
            if (term) {
                router.push(`/catalog?q=${encodeURIComponent(term)}`);
                setIsSearchOpen(false);
            }
        }
    };

    return (
        <>
            <nav className={cn(
                "fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out",
                scrolled ? "top-4" : "top-0"
            )}>
                <div className={cn(
                    "relative mx-auto transition-all duration-500 ease-in-out flex items-center justify-between",
                    scrolled
                        ? "w-[95%] max-w-5xl bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-full shadow-2xl shadow-primary/10 border border-primary/20 px-3 md:px-6 py-1.5 md:py-1"
                        : "w-full max-w-7xl px-4 md:px-6 py-2 bg-transparent"
                )}>
                    {/* High-End Glow Line (on scroll) */}
                    {scrolled && (
                        <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-in fade-in zoom-in duration-1000" />
                    )}

                    {/* Mobile: Left Action (Search) */}
                    <div className="md:hidden flex items-center">
                        <button
                            className={cn(
                                "p-2 rounded-full hover:bg-primary/5 text-primary transition-all",
                                isOpen && "opacity-0 pointer-events-none"
                            )}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Logo Section */}
                    {/* Logo Section - Centered on Mobile, Left on Desktop */}
                    <div className={cn(
                        "flex items-center gap-8",
                        "absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
                    )}>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className={cn(
                                "relative transition-all duration-500",
                                scrolled
                                    ? "w-28 h-8 md:w-56 md:h-16"
                                    : "w-36 h-12 md:w-64 md:h-20",
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

                        {/* Desktop Links with Active State & Dropdown */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/catalog"
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                                    isActive('/catalog') ? "bg-primary/10 text-primary" : "text-slate-700 hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                Tienda
                            </Link>


                            <Link
                                href="/#promociones"
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                                    isActive('/#promociones') ? "bg-primary/10 text-primary" : "text-slate-700 hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                Promociones
                            </Link>
                        </div>
                    </div>

                    {/* Actions Section - Desktop */}
                    <div className="hidden md:flex items-center gap-1.5 sm:gap-3">


                        {/* Search Bar - Desktop */}
                        <div className={cn(
                            "hidden sm:flex bg-primary/5 hover:bg-primary/10 rounded-full px-4 py-2 items-center gap-2 border border-primary/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all cursor-text group",
                            isOpen && "opacity-0 pointer-events-none"
                        )}>
                            <Search className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm p-0 w-24 lg:w-40 placeholder:text-primary/40 text-primary font-bold focus:outline-none"
                                placeholder="Buscar..."
                                type="text"
                                onKeyDown={handleSearch}
                            />
                        </div>

                        {/* Favorites Button (Desktop) */}
                        <Link
                            href="/favorites"
                            className={cn(
                                "relative bg-white/70 backdrop-blur-sm p-2 sm:p-2.5 rounded-full border border-primary/10 shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-background-dark group",
                                favAnimate && "animate-bounce"
                            )}
                        >
                            <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5 group-hover:fill-current transition-all", favCount > 0 ? "text-red-500 fill-current" : "")} />
                            {favCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                    {favCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Button (Desktop) */}
                        <Link
                            href="/cart"
                            className={cn(
                                "relative bg-white/70 backdrop-blur-sm p-2 sm:p-2.5 rounded-full border border-primary/10 shadow-sm hover:bg-primary/20 hover:border-primary/30 transition-all text-background-dark group",
                                cartAnimate && "animate-bounce"
                            )}
                        >
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-primary transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-[9px] sm:text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle (Already handled by the previous step, but let's ensure it's inside the flex container) */}
                    <div className="md:hidden flex items-center">
                        <button
                            className={cn(
                                "p-2 rounded-full hover:bg-primary/5 transition-all text-background-dark",
                                isOpen && "text-primary"
                            )}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar Expandable */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-b border-primary/10 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
                            <Search className="w-5 h-5 text-primary" />
                            <input
                                className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-primary/50 text-primary font-bold focus:outline-none"
                                placeholder="¿Qué buscas hoy?..."
                                type="text"
                                autoFocus
                                onKeyDown={handleSearch}
                            />
                            <button onClick={() => setIsSearchOpen(false)} className="p-1">
                                <X className="w-4 h-4 text-primary/50" />
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Menu Dropdown - Premium Glassmorphic */}
            <div className={cn(
                "fixed left-1/2 -translate-x-1/2 top-20 z-50 w-[92%] max-w-sm md:hidden transition-all duration-500 ease-out origin-top",
                isOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none -translate-y-4"
            )}>
                <div className="bg-white/90 backdrop-blur-2xl border border-primary/20 rounded-[2.5rem] shadow-2xl shadow-primary/20 overflow-hidden relative">
                    {/* Pattern Background */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <Image src="/assets/brand/pattern.jpg" alt="" fill className="object-cover" />
                    </div>

                    <div className="relative z-10 p-6 space-y-4">
                        {/* Navigation Links Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { href: '/catalog?sort=new', label: 'Novedades', icon: <Sparkles className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
                                { href: '/catalog', label: 'Tienda', icon: <ShoppingBag className="w-5 h-5" />, color: "bg-primary/10 text-primary" },
                                { href: '/favorites', label: 'Favoritos', icon: <Heart className="w-5 h-5" />, color: "bg-red-50 text-red-500", count: favCount },
                                { href: '/#promociones', label: 'Promos', icon: <ArrowRight className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                            ].map((item, i) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-3 p-5 rounded-3xl transition-all duration-300 active:scale-95 group border border-transparent shadow-sm",
                                        isActive(item.href) ? "bg-white border-primary/20 shadow-lg" : "bg-white/50 hover:bg-white hover:shadow-md"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 relative",
                                        item.color
                                    )}>
                                        {item.icon}
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-background-dark/80">{item.label}</span>
                                </Link>
                            ))}
                        </div>


                        {/* Footer Socials */}
                        <div className="pt-2 border-t border-primary/10 leading-none">
                            <div className="flex items-center justify-center gap-6 py-4">
                                <a href="https://instagram.com/loyafu.ve" target="_blank" className="text-slate-400 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                                <a href="https://wa.me/584244096534" target="_blank" className="text-slate-400 hover:text-green-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.95 7.05a10 10 0 0 0-14.1 0 10 10 0 0 0 .53 14.65L3 22l4.8-1.5a10 10 0 0 0 14.15-5.45" /></svg>
                                </a>
                                <Link href="/faq" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
