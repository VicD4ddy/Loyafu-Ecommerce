"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search, ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function BottomNav() {
    const pathname = usePathname();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const favorites = useFavoritesStore((state) => state.favorites);
    const favCount = favorites.length;

    const navItems = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/catalog', label: 'Tienda', icon: ShoppingBag },
        { href: '/favorites', label: 'Favoritos', icon: Heart, count: favCount },
        { href: '/cart', label: 'Carrito', icon: ShoppingCart, count: cartCount },
    ];

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
            <nav className="bg-white/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl shadow-primary/20 px-6 py-3 flex items-center justify-between pointer-events-auto">
                {navItems.map((item) => {
                    const Active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center gap-1 transition-all duration-300",
                                Active ? "text-primary scale-110" : "text-slate-400 hover:text-primary/70"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-500",
                                Active ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <Icon className={cn("w-5 h-5", Active ? "fill-current" : "")} />
                            </div>

                            {item.count !== undefined && item.count > 0 && (
                                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white border-2 border-white shadow-sm -translate-y-1 translate-x-1 animate-in zoom-in duration-300">
                                    {item.count}
                                </span>
                            )}

                            {/* Active Dot */}
                            {Active && (
                                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-in fade-in duration-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
