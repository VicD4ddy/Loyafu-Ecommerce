"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, MessageCircle, Banknote, Smartphone, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

export default function Footer() {
    const pathname = usePathname();

    // Pages where the footer should be hidden ON MOBILE only
    const hideOnMobilePaths = ['/catalog', '/favorites', '/cart'];
    const shouldHideOnMobile = hideOnMobilePaths.includes(pathname);

    return (
        <footer className={cn(
            "bg-white border-t border-primary/5 py-16 md:py-24 relative overflow-hidden",
            shouldHideOnMobile && "hidden md:block" // Hidden on mobile, shown on desktop for specific routes
        )}>
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 space-y-8">
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="w-12 h-12 relative transition-transform duration-500 group-hover:rotate-[360deg]">
                                <Logo className="w-full h-full text-primary" />
                            </div>
                            <span className="font-brand font-black text-2xl tracking-tighter text-background-dark italic">LOYAFU</span>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-background-dark">Nuestra Historia</h4>
                            <p className="text-primary/60 text-sm font-medium leading-relaxed max-w-xs text-balance">
                                Nacimos para potenciar tu viaje de belleza con productos que celebran quién eres. Cosmética premium, ética y en tendencia para la mujer de hoy.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="https://www.instagram.com/loyafu.ve/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20"
                            >
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://wa.me/584128824608"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links Group */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-background-dark mb-8 opacity-50">Colecciones</h4>
                        <ul className="space-y-4 text-sm font-bold text-primary/60">
                            <li><Link href="/catalog" className="hover:text-primary transition-colors flex items-center gap-2">Maquillaje</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary transition-colors flex items-center gap-2">Skincare</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary transition-colors flex items-center gap-2">Accesorios</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary transition-colors flex items-center gap-2 text-primary">Combos ✨</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-background-dark mb-8 opacity-50">Soporte</h4>
                        <ul className="space-y-4 text-sm font-bold text-primary/60">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">Preguntas</Link></li>
                            <li><Link href="/policies" className="hover:text-primary transition-colors">Envíos</Link></li>
                            <li><Link href="/policies" className="hover:text-primary transition-colors">Pagos</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors text-background-dark/80">Ayuda</Link></li>
                        </ul>
                    </div>

                    {/* Contact/Trust Column */}
                    <div className="col-span-2 md:col-span-4 space-y-8">
                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">Confianza Loyafu</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-background-dark/80">Envíos a Nivel Nacional</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-background-dark/80">Compra 100% Segura</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <RotateCcw className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-background-dark/80">Garantía de Calidad</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">
                        <p>© {new Date().getFullYear()} LOYAFU BEAUTY.</p>
                        <div className="hidden md:block w-1 h-1 bg-primary/20 rounded-full"></div>
                        <div className="flex gap-6">
                            <Link href="/policies" className="hover:text-primary transition-colors">Privacidad</Link>
                            <Link href="/policies" className="hover:text-primary transition-colors">Condiciones</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 opacity-60">
                        <div className="flex gap-3">
                            <div className="px-3 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                <Banknote className="w-3 h-3" />
                                EFECTIVO
                            </div>
                            <div className="px-3 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                <Smartphone className="w-3 h-3" />
                                PAGO MÓVIL
                            </div>
                            <div className="px-3 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                <span className="text-xs font-black">Z</span>
                                ZELLE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
