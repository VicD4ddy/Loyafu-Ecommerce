"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
    Star,
    CheckCircle,
    XCircle,
    Trash2,
    Search,
    MessageSquare,
    Clock,
    User,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number;
    badge: string;
    is_approved: boolean;
    created_at: string;
}

export default function AdminTestimonials() {
    const supabase = createSupabaseBrowserClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
        } else {
            setTestimonials(data || []);
        }
        setLoading(false);
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('testimonials')
            .update({ is_approved: !currentStatus })
            .eq('id', id);

        if (!error) {
            setTestimonials(testimonials.map(t =>
                t.id === id ? { ...t, is_approved: !currentStatus } : t
            ));
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este testimonio?')) return;

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (!error) {
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    const filtered = testimonials.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' ||
            (filter === 'PENDING' && !t.is_approved) ||
            (filter === 'APPROVED' && t.is_approved);
        return matchesSearch && matchesFilter;
    });

    const pendingCount = testimonials.filter(t => !t.is_approved).length;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gestión de Testimonios</h1>
                    <p className="text-[#6d667c] text-xs font-bold uppercase tracking-widest mt-1">
                        Aprueba o elimina los comentarios de tus clientes
                    </p>
                </div>
                {pendingCount > 0 && (
                    <div className="bg-primary/20 border border-primary/30 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-primary font-black uppercase text-xs tracking-widest">
                            {pendingCount} Pendientes por revisar
                        </span>
                    </div>
                )}
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d667c] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o contenido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#18131e] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-[#6d667c] focus:outline-none focus:border-primary/50 transition-all font-bold"
                    />
                </div>
                <div className="flex bg-[#18131e] border border-white/5 rounded-2xl p-1">
                    {(['ALL', 'PENDING', 'APPROVED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-white/10 text-white" : "text-[#6d667c] hover:text-white"
                            )}
                        >
                            {f === 'ALL' ? 'Todos' : f === 'PENDING' ? 'Pendientes' : 'Aprobados'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-[#18131e] rounded-[2rem] animate-pulse" />
                    ))
                ) : filtered.length > 0 ? (
                    filtered.map((t) => (
                        <div key={t.id} className={cn(
                            "bg-[#18131e] border rounded-[2.5rem] p-8 transition-all group relative",
                            t.is_approved ? "border-white/5" : "border-primary/40 shadow-2xl shadow-primary/10"
                        )}>
                            {!t.is_approved && (
                                <div className="absolute top-6 right-8 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Nuevo</span>
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#6d667c]">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-black uppercase tracking-tighter italic text-lg">{t.name}</h4>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    i < t.rating ? "text-amber-400 fill-current" : "text-white/10"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[#a8a3b5] font-medium leading-relaxed mb-8 italic">
                                "{t.text}"
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#6d667c] text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                                        {t.badge}
                                    </span>
                                    <span className="text-[#6d667c] text-[10px] font-bold uppercase tracking-tight">
                                        {new Date(t.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleApproval(t.id, t.is_approved)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            t.is_approved
                                                ? "bg-white/5 text-[#6d667c] hover:bg-white/10"
                                                : "bg-primary text-white hover:scale-105 shadow-xl shadow-primary/20"
                                        )}
                                    >
                                        {t.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                        {t.is_approved ? 'Desaprobar' : 'Aprobar'}
                                    </button>
                                    <button
                                        onClick={() => deleteTestimonial(t.id)}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-[#18131e] rounded-[3rem] border border-white/5 text-center">
                        <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-white font-black uppercase italic text-xl tracking-tighter">No hay testimonios</h3>
                        <p className="text-[#6d667c] font-black uppercase text-[10px] tracking-widest mt-2">Prueba cambiando los filtros de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
}
