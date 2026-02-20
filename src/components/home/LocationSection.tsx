"use client";

import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LocationSection({ className }: { className?: string }) {
    return (
        <section className={cn("py-12 md:py-24 px-6 relative overflow-hidden bg-white", className)}>
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Location Info Card */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                            <MapPin className="w-4 h-4" />
                            Ubicación Física
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-background-dark tracking-tighter uppercase italic leading-[0.9]">
                                Visítanos en <br />
                                <span className="text-primary">Valencia</span>
                            </h2>
                            <p className="text-slate-500 text-lg font-medium max-w-md">
                                Encuentra todo nuestro catálogo y atención personalizada en nuestra tienda física.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-black text-background-dark uppercase tracking-tight mb-2">CC Gran Bazar Centro</h3>
                                <div className="space-y-2 text-slate-600 font-medium">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Local ML 171, planta alta
                                    </p>
                                    <p className="text-sm leading-relaxed">
                                        Calle Comercio, entre las avenidas Montes de Oca y Carabobo. Centro de Valencia, Estado Carabobo.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-3 text-primary mb-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Horarios de Atención</span>
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Lunes a Viernes</span>
                                            <span className="text-sm font-black text-background-dark tracking-tight">10:00am - 04:00pm</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Sábados</span>
                                            <span className="text-sm font-black text-background-dark tracking-tight">11:00am - 04:00pm</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl border border-primary/10">
                                            <span className="text-xs font-bold text-primary/60 uppercase">Domingos</span>
                                            <span className="text-sm font-black text-primary/40 uppercase italic tracking-tighter">Cerrado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atención al Cliente</p>
                                        <p className="text-sm font-bold text-background-dark">Valencia, Centro</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://maps.app.goo.gl/FvKmDk5Gk1p2Yv7L6" // Constructed search URL or exact link if known
                            target="_blank"
                            className="inline-flex items-center gap-3 bg-background-dark text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group"
                        >
                            Ver en Google Maps
                            <Navigation className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                    {/* Map Iframe with Premium Frame */}
                    <div className="relative group animate-in fade-in slide-in-from-right-10 duration-1000">
                        {/* Decorative elements */}
                        <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.314!2d-68.00547!3d10.17993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e80628e9c3e9d89%3A0x8849646b19a0a4c2!2sC.C.%20Gran%20Bazar%20Centro!5e0!3m2!1ses-419!2sve!4v1708450000000!5m2!1ses-419!2sve"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                            />

                            {/* Floating Address Badge Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 md:p-6 bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/20 shadow-xl pointer-events-none transform group-hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">C.C. Gran Bazar Centro</p>
                                <p className="text-xs md:text-sm font-bold text-background-dark leading-snug">
                                    Local ML 171 planta alta, Calle Comercio.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
