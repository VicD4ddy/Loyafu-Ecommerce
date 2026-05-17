"use client";

import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LocationSection({ className }: { className?: string }) {
    return (
        <section className={cn("py-8 md:py-16 px-4 md:px-8 relative overflow-x-hidden overflow-y-visible bg-background-dark", className)}>
            {/* Ambient Purple Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10 w-full overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center">

                    {/* Location Info Card */}
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 w-full min-w-0 overflow-hidden">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/5 text-primary-light font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                            <MapPin className="w-4 h-4" />
                            Ubicación Física
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase font-brand italic leading-[0.85] text-white">
                                VISÍTANOS EN <br />
                                <span className="text-primary-light">VALENCIA</span>
                            </h2>
                            <p className="text-slate-300 text-base md:text-lg font-medium max-w-[450px]">
                                Encuentra todo nuestro catálogo y atención personalizada en nuestra tienda física.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-5 w-full overflow-hidden">
                            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300">
                                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2">CC Gran Bazar Centro</h3>
                                <div className="space-y-1.5 text-slate-300 font-medium">
                                    <p className="flex items-center gap-2 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-light shadow-[0_0_10px_2px_rgba(140,43,238,0.3)] flex-shrink-0" />
                                        Local ML 171, planta alta
                                    </p>
                                    <p className="text-xs md:text-sm leading-relaxed text-slate-400">
                                        Calle Comercio, entre las avenidas Montes de Oca y Carabobo. Centro de Valencia, Estado Carabobo.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 w-full overflow-hidden">
                                <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3 shadow-xl">
                                    <div className="flex items-center gap-3 text-primary-light mb-1">
                                        <Clock className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Horarios de Atención</span>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex justify-between items-center bg-white/10 px-3 py-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5">
                                            <span className="text-[10px] md:text-xs font-bold text-slate-300 uppercase">Lun - Vie</span>
                                            <span className="text-[10px] md:text-sm font-black text-white tracking-tight">10:00am - 04:00pm</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/10 px-3 py-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5">
                                            <span className="text-[10px] md:text-xs font-bold text-slate-300 uppercase">Sábados</span>
                                            <span className="text-[10px] md:text-sm font-black text-white tracking-tight">11:00am - 04:00pm</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-primary/10 px-3 py-2 md:p-3 rounded-xl md:rounded-2xl border border-primary/20">
                                            <span className="text-[10px] md:text-xs font-bold text-primary-light uppercase">Domingos</span>
                                            <span className="text-[10px] md:text-sm font-black text-primary/60 uppercase italic tracking-tighter">Cerrado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-primary-light flex-shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Atención al Cliente</p>
                                        <p className="text-xs md:text-sm font-bold text-white truncate">Valencia, Centro</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=CC+Gran+Bazar+Centro+Valencia"
                            target="_blank"
                            className="inline-flex w-full md:w-auto justify-center items-center gap-3 bg-white text-background-dark px-6 md:px-8 py-4 rounded-full font-black text-sm md:text-base uppercase tracking-wider md:tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_var(--primary)] group mt-2"
                        >
                            Ver en Google Maps
                            <Navigation className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                    {/* Map Iframe with Premium Frame */}
                    <div className="relative group animate-in fade-in slide-in-from-right-10 duration-1000 w-full h-full min-h-[400px] overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute inset-0 bg-primary/30 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative w-full h-full md:h-[600px] xl:h-full aspect-square md:aspect-auto rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                            <iframe
                                src="https://maps.google.com/maps?q=10.17993,-68.00547&t=&z=18&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100 absolute inset-0"
                            />

                            {/* Floating Address Badge Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-background-dark/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl pointer-events-none transform group-hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-[9px] md:text-[10px] font-black uppercase text-primary-light tracking-widest mb-1">C.C. Gran Bazar Centro</p>
                                <p className="text-xs md:text-sm font-bold text-white leading-snug">
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
