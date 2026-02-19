"use client";

import { Sparkles, Star, Zap, Send } from 'lucide-react';

export default function Newsletter() {
    return (
        <section className="px-4 md:px-6 max-w-7xl mx-auto pb-16 md:pb-24">
            <div className="bg-background-dark rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden border border-white/5 shadow-2xl">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none overflow-hidden">
                    <span className="absolute top-10 -left-10 text-[120px] font-brand font-black italic whitespace-nowrap rotate-12">
                        LOYAFU BEAUTY LOYAFU BEAUTY
                    </span>
                    <span className="absolute bottom-10 -right-10 text-[120px] font-brand font-black italic whitespace-nowrap -rotate-12">
                        TU MEJOR VERSION TU MEJOR VERSION
                    </span>
                </div>

                {/* Glass Blur Circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-[0.3em]">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Comunidad Exclusiva
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase font-brand italic">
                            ÚNETE AL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">CLUB LOYAFU</span>
                        </h2>
                        <p className="text-white/60 max-w-md mx-auto font-medium text-base md:text-lg">
                            Obtén <span className="text-white font-bold">15% de descuento</span> en tu primera orden, acceso anticipado y tips de expertos.
                        </p>
                    </div>

                    <form
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative group"
                        onSubmit={(e) => { e.preventDefault(); alert("¡Bienvenida al club! ✨"); }}
                    >
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-2xl px-6 py-4 bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary/50 text-lg font-medium placeholder:text-white/20 transition-all outline-none"
                                placeholder="Tu mejor email..."
                                type="email"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-white text-background-dark px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl">
                            UNIRME
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-10 border-t border-white/5">
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Cruelty Free</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Vegano</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Reciclable</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
