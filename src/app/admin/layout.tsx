"use client";

import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Star,
    LogOut,
    Settings,
    ChevronRight,
    Menu,
    X,
    LayoutGrid,
    MessageSquare,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createSupabaseBrowserClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Productos', href: '/admin/products', icon: Package },
        { label: 'Categorías', href: '/admin/categories', icon: LayoutGrid },
        { label: 'Testimonios', href: '/admin/testimonials', icon: MessageCircle },
        { label: 'Producto Semana', href: '/admin/featured', icon: Star },
        { label: 'FAQ', href: '/admin/faq', icon: MessageSquare },
        { label: 'Ajustes', href: '/admin/settings', icon: Settings },
    ];

    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#0f0a15] text-white flex flex-col md:flex-row font-brand">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#18131e] border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
                <span className="font-black uppercase tracking-tighter text-xl italic text-primary">Loyafu Admin</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#a8a3b5]">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-0 z-40 md:relative md:flex md:w-64 flex-col bg-[#18131e] border-r border-white/5 transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-8 hidden md:block">
                    <span className="font-black uppercase tracking-tighter text-2xl italic text-primary">Loyafu</span>
                    <p className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest mt-1">Control Panel</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group",
                                pathname === item.href
                                    ? "bg-primary text-white shadow-[0_8px_20px_rgba(157,51,247,0.2)]"
                                    : "text-[#a8a3b5] hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-primary/40 group-hover:text-primary transition-colors")} />
                            {item.label}
                            {pathname === item.href && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[#a8a3b5] hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] bg-fixed">
                <div className="p-4 md:p-8 min-h-screen">
                    {children}
                </div>
            </main>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
