"use client";

import { Star, MessageCircle, Quote, Sparkles } from 'lucide-react';

const testimonials = [
    {
        name: 'María G.',
        text: 'Pedí los polvos Salome y me llegaron al día siguiente, demasiado rápido. La atención por WhatsApp fue súper atenta, me ayudaron a escoger los tonos. Repetiré seguro 💜',
        rating: 5,
        badge: 'Cliente fiel',
    },
    {
        name: 'Laura P.',
        text: 'Arranqué con el combo de $40 para vender en mi local y la verdad los productos se mueven rápido. Ya voy por mi tercer pedido, los márgenes son buenos de verdad.',
        rating: 5,
        badge: 'Emprendedora',
    },
    {
        name: 'Andrea M.',
        text: 'El corrector Salome es lo mejor que he probado, aguanta todo el día sin retoque. Lo recomiendo full, sobre todo para las que trabajamos todo el día.',
        rating: 5,
        badge: 'Verificada',
    },
    {
        name: 'Daniela R.',
        text: 'Me encanta que el carrito te calcula el precio de mayor automático, no tienes que estar preguntando. Hice mi pedido en 5 minutos, súper práctico.',
        rating: 5,
        badge: 'Mayorista',
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                        <Sparkles className="w-3.5 h-3.5" />
                        TESTIMONIOS REALES
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-background-dark tracking-tighter uppercase font-brand italic">
                        LA EXPERIENCIA <span className="text-primary">LOYAFU</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto">
                        Lo que dicen nuestras clientas sobre la rapidez, calidad y atención que nos define.
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 border border-primary/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20"
                        >
                            {/* Glow Ornament */}
                            <div className="absolute -top-px -left-px w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-[2.5rem]"></div>

                            {/* Quote icon */}
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <Quote className="w-6 h-6 fill-current" />
                            </div>

                            {/* Text */}
                            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 font-medium italic italic-none">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            {/* Footer Info */}
                            <div className="pt-6 border-t border-primary/5 flex items-end justify-between">
                                <div className="space-y-1">
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(t.rating)].map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="font-black text-background-dark text-sm uppercase tracking-tight">{t.name}</p>
                                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{t.badge}</span>
                                </div>
                                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                                    <MessageCircle className="w-5 h-5 mb-0.5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
