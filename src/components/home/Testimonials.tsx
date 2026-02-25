"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Star, MessageCircle, Quote, Sparkles, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number;
    badge: string;
    created_at: string;
}

export default function Testimonials() {
    const supabase = createSupabaseBrowserClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        text: '',
        rating: 5,
        badge: 'Cliente'
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
            console.error('Error fetching testimonials:', error);
        } else {
            setTestimonials(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.text) return;

        setIsSubmitting(true);
        const { error } = await supabase
            .from('testimonials')
            .insert([{
                ...formData,
                is_approved: false // Always requires moderation
            }]);

        if (error) {
            console.error('Error submitting testimonial:', error);
            alert('Hubo un error al enviar tu testimonio.');
        } else {
            alert('¡Gracias! Tu testimonio ha sido enviado y aparecerá cuando el administrador lo apruebe.');
            setFormData({ name: '', text: '', rating: 5, badge: 'Cliente' });
            setIsModalOpen(false);
        }
        setIsSubmitting(false);
    };

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                            <Sparkles className="w-3.5 h-3.5" />
                            TESTIMONIOS REALES
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-background-dark tracking-tighter uppercase font-brand italic">
                            LA EXPERIENCIA <span className="text-primary">LOYAFU</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-lg">
                            Lo que dicen nuestras clientas sobre la rapidez, calidad y atención que nos define.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                        <MessageCircle className="w-5 h-5 mb-0.5" />
                        Dejar mi opinión
                    </button>
                </div>

                {/* Testimonial Container - Adjusted for Mobile Horizontal Scroll */}
                <div className="relative">
                    <div
                        className={cn(
                            "flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:gap-8",
                            loading ? "opacity-50" : "opacity-100"
                        )}
                    >
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="min-w-[calc(100vw-3rem)] md:min-w-0 h-64 bg-slate-50 rounded-[2.5rem] animate-pulse" />
                            ))
                        ) : testimonials.length > 0 ? (
                            testimonials.map((t) => (
                                <div
                                    key={t.id}
                                    className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 border border-primary/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 w-[calc(100vw-3rem)] md:w-full md:min-w-0 flex-shrink-0 snap-center"
                                >
                                    <div className="absolute -top-px -left-px w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-[2.5rem]"></div>

                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Quote className="w-6 h-6 fill-current" />
                                    </div>

                                    <p className="text-slate-600 text-[14px] leading-relaxed mb-6 font-medium italic min-h-[80px]">
                                        &ldquo;{t.text}&rdquo;
                                    </p>

                                    <div className="pt-6 border-t border-primary/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(t.rating)].map((_, j) => (
                                                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {new Date(t.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="font-black text-background-dark text-sm uppercase tracking-tight">{t.name}</p>
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-md">
                                                    <Sparkles className="w-2.5 h-2.5 text-primary" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t.badge || 'Cliente'}</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                                                <MessageCircle className="w-5 h-5 mb-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-20 bg-slate-50 rounded-[3rem] text-center flex-shrink-0">
                                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">¡Sé el primero en dejar un testimonio!</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hint - Only visible on small screens when multiple items exist */}
                    {!loading && testimonials.length > 1 && (
                        <div className="md:hidden flex justify-center mt-2 pointer-events-none">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 animate-pulse">
                                Desliza para ver más
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Opinión */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
                    <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)} />

                    <div className="relative w-full max-w-xl bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-500 max-h-[95vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-br from-[#9d33f7] to-[#8c2bee] p-8 md:p-10 text-white relative flex-shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-6 top-6 p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all z-[110] active:scale-90 flex items-center justify-center"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">Tu opinión nos impulsa</h3>
                                    <p className="text-white/70 font-bold text-[10px] uppercase tracking-[0.2em]">Experiencia Loyafu</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto flex-1 scrollbar-none">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Cómo te llamas?</label>
                                </div>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:outline-none focus:border-primary/50 text-background-dark font-bold text-sm shadow-inner transition-all"
                                    placeholder="Nombre completo"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Qué tipo de cliente eres?</label>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Cliente', 'Cliente Fiel', 'Emprendedora'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, badge: cat })}
                                            className={cn(
                                                "py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                formData.badge === cat
                                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                                    : "bg-slate-50 text-slate-400 border-slate-100 hover:border-primary/30"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Puntúa tu experiencia</label>
                                </div>
                                <div className="flex gap-4 justify-center bg-slate-50/50 border border-slate-50 p-6 rounded-[2.5rem]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="transform transition-all active:scale-95 group"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 transition-all drop-shadow-sm",
                                                    star <= formData.rating ? "text-amber-400 fill-current scale-110 rotate-3" : "text-slate-200 group-hover:text-amber-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuéntanos más</label>
                                </div>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 focus:outline-none focus:border-primary/50 text-background-dark font-medium text-sm resize-none leading-relaxed shadow-inner transition-all"
                                    placeholder="Me encantó el servicio porque..."
                                />
                            </div>

                            <div className="pt-4 pb-8 sm:pb-0">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full bg-background-dark text-white py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-primary shadow-xl shadow-slate-200 active:scale-[0.98]"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mb-0.5" />
                                            Enviar Opinión
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    * Moderado por el equipo Loyafu
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
