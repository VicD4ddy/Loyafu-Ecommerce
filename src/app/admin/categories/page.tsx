"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    FolderOpen,
    Image as ImageIcon,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    order: number;
}

export default function CategoriesPage() {
    const supabase = createSupabaseBrowserClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image_url: '',
        order: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const categoryData = {
            ...formData,
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
        };

        let error;
        if (editingCategory) {
            const { error: updateError } = await supabase
                .from('categories')
                .update(categoryData)
                .eq('id', editingCategory.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('categories')
                .insert([categoryData]);
            error = insertError;
        }

        if (error) {
            alert('Error al guardar categoría: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image_url: '', order: categories.length });
            fetchCategories();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Esto podría afectar a los productos asociados.')) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            fetchCategories();
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            image_url: category.image_url || '',
            order: category.order
        });
        setIsModalOpen(true);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gestión de Categorías</h1>
                    <p className="text-[#a8a3b5] text-sm uppercase tracking-widest font-bold">Organiza tus productos por marca o tipo</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', slug: '', image_url: '', order: categories.length });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d667c] group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#18131e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#6d667c] focus:outline-none focus:border-primary/50 transition-all shadow-xl"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-[#18131e] rounded-[2rem] border border-white/5 animate-pulse" />
                    ))
                ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <div key={category.id} className="group relative bg-[#18131e] border border-white/5 rounded-[2rem] p-6 shadow-xl hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl text-primary">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="p-2 bg-white/5 hover:bg-primary/20 text-[#a8a3b5] hover:text-primary rounded-xl transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 bg-white/5 hover:bg-red-500/20 text-[#a8a3b5] hover:text-red-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1 truncate">
                                {category.name}
                            </h3>
                            <p className="text-[#6d667c] text-xs font-bold uppercase tracking-widest mb-4">
                                /{category.slug}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <span className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest">
                                    Orden: #{category.order}
                                </span>
                                {category.image_url && (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                        <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-[#18131e] rounded-[2rem] border border-white/5 border-dashed">
                        <FolderOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-[#a8a3b5] font-bold uppercase tracking-widest text-sm">No se encontraron categorías</p>
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
                    <div className="relative w-full max-w-lg bg-[#1b1622] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6">
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Nombre de Categoría</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Salome Makeup"
                                    className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">Slug (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="salome-makeup"
                                        className="w-full bg-[#18131e] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                                    />
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
                                <label className="block text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-2 ml-4">URL de Imagen (Opcional)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d667c] w-4 h-4" />
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-[#18131e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
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
                                        editingCategory ? 'Actualizar' : 'Crear Categoría'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
