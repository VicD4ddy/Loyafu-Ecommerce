"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
    HelpCircle,
    ChevronDown,
    MessageSquare,
    Search,
    ShieldCheck,
    Clock,
    Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    order: number;
}

export default function PublicFAQ() {
    const supabase = createSupabaseBrowserClient();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('faq')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching FAQs:', error);
        } else {
            setFaqs(data || []);
        }
        setLoading(false);
    };

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = Array.from(new Set(faqs.map(f => f.category)));

    return (
        <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-background-dark mb-4 tracking-tighter italic uppercase">Centro de Ayuda</h1>
                <p className="text-slate-500 max-w-lg mx-auto font-bold uppercase tracking-widest text-xs">
                    Resolvemos tus dudas para que tu experiencia sea perfecta
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-12 max-w-xl mx-auto group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-primary/10 rounded-3xl py-5 pl-14 pr-6 text-background-dark placeholder:text-slate-400 focus:outline-none focus:border-primary/50 transition-all shadow-xl shadow-primary/5 font-bold"
                />
            </div>

            {/* Quick Links / Static Policies Integration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                <Link href="/policies" className="group p-6 bg-white border border-primary/5 rounded-3xl hover:border-primary/20 transition-all">
                    <ShieldCheck className="w-8 h-8 text-primary/40 group-hover:text-primary mb-4 transition-colors" />
                    <h3 className="font-black text-background-dark uppercase tracking-tighter italic">Garantías</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ver políticas de cambios</p>
                </Link>
                <div className="p-6 bg-white border border-primary/5 rounded-3xl">
                    <Truck className="w-8 h-8 text-primary/40 mb-4" />
                    <h3 className="font-black text-background-dark uppercase tracking-tighter italic">Envíos</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Nacional via MRW/Zoom</p>
                </div>
                <div className="p-6 bg-white border border-primary/5 rounded-3xl">
                    <Clock className="w-8 h-8 text-primary/40 mb-4" />
                    <h3 className="font-black text-background-dark uppercase tracking-tighter italic">Atención</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Lun-Vie 8AM - 6PM</p>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-20 bg-white/50 rounded-2xl animate-pulse" />
                    ))
                ) : filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className={cn(
                                "group bg-white border rounded-2xl overflow-hidden transition-all duration-300",
                                openId === faq.id ? "border-primary/30 shadow-lg shadow-primary/5" : "border-primary/5 hover:border-primary/20"
                            )}
                        >
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        openId === faq.id ? "bg-primary scale-125" : "bg-primary/20"
                                    )} />
                                    <span className="font-black text-background-dark uppercase tracking-tighter italic md:text-lg">
                                        {faq.question}
                                    </span>
                                </div>
                                <ChevronDown className={cn(
                                    "w-5 h-5 text-primary/40 transition-transform duration-300",
                                    openId === faq.id ? "rotate-180 text-primary" : ""
                                )} />
                            </button>
                            <div
                                className={cn(
                                    "transition-all duration-300 overflow-hidden",
                                    openId === faq.id ? "max-h-96" : "max-h-0"
                                )}
                            >
                                <div className="p-6 pt-0 border-t border-primary/5 bg-primary/5 font-medium text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-primary/5 rounded-3xl">
                        <HelpCircle className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                        <p className="text-primary font-black uppercase tracking-widest text-sm italic">No encontramos lo que buscas...</p>
                        <p className="text-slate-500 text-xs mt-2">Prueba con palabras clave más generales</p>
                    </div>
                )}
            </div>

            {/* Contact CTA */}
            <div className="mt-20 p-8 md:p-12 bg-background-dark rounded-[3rem] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                        ¿Aún tienes dudas?
                    </h2>
                    <p className="text-[#a8a3b5] mb-8 font-bold uppercase tracking-widest text-xs">
                        Nuestro equipo está listo para asesorarte personalmente
                    </p>
                    <a
                        href="https://wa.me/584244096534"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Chatear por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
