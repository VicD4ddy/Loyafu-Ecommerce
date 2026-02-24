"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    MessageCircle,
    HelpCircle,
    ChevronUp,
    ChevronDown,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    order: number;
}

export default function FAQPage() {
    const supabase = createSupabaseBrowserClient();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        order: 0
    });

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        let error;
        if (editingFaq) {
            const { error: updateError } = await supabase
                .from('faq')
                .update(formData)
                .eq('id', editingFaq.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('faq')
                .insert([formData]);
            error = insertError;
        }

        if (error) {
            alert('Error al guardar FAQ: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingFaq(null);
            setFormData({ question: '', answer: '', category: 'General', order: faqs.length });
            fetchFaqs();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta pregunta frecuente?')) return;

        const { error } = await supabase
            .from('faq')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            fetchFaqs();
        }
    };

    const openEditModal = (faq: FAQ) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order
        });
        setIsModalOpen(true);
    };

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Centro de Ayuda (FAQ)</h1>
                    <p className="text-[#a8a3b5] text-sm uppercase tracking-widest font-bold">Gestiona las dudas frecuentes de tus clientes</p>
                </div>
                <button
                    onClick={() => {
                        setEditingFaq(null);
                        setFormData({ question: '', answer: '', category: 'General', order: faqs.length });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Pregunta
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d667c] group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar en preguntas, respuestas o categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#18131e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#6d667c] focus:outline-none focus:border-primary/50 transition-all shadow-xl"
                />
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-[#18131e] rounded-2xl border border-white/5 animate-pulse" />
                    ))
                ) : filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div key={faq.id} className="group relative bg-[#18131e] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {faq.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-[#6d667c] uppercase tracking-widest">
                                            Orden: #{faq.order}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-[#a8a3b5] text-sm leading-relaxed line-clamp-2">
                                        {faq.answer}
                                    </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(faq)}
                                        className="p-2 bg-white/5 hover:bg-primary/20 text-[#a8a3b5] hover:text-primary rounded-xl transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 bg-white/5 hover:bg-red-500/20 text-[#a8a3b5] hover:text-red-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-[#18131e] rounded-[2rem] border border-white/5 border-dashed">
                        <HelpCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-[#a8a3b5] font-bold uppercase tracking-widest text-sm">No hay preguntas frecuentes</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                        onClick={() => !isSaving && setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-[#1b1622] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6">
                            {editingFaq ? 'Editar Pregunta' : 'Nueva Pregunta FAQ'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 appearance-none"
                                    >
                                        <option value="General">General</option>
                                        <option value="Envíos">Envíos</option>
                                        <option value="Pagos">Pagos</option>
                                        <option value="Productos">Productos</option>
                                        <option value="Devoluciones">Devoluciones</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Orden</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Pregunta</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    placeholder="¿Cómo realizo un pedido?"
                                    className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Respuesta</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    placeholder="Detalla la respuesta aquí..."
                                    className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-white/5 rounded-2xl text-[#a8a3b5] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-4 bg-primary rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {editingFaq ? 'Actualizar' : 'Guardar FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
