"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    Package,
    Filter,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/components/ui/Toast';

export default function AdminProductsPage() {
    const supabase = createSupabaseBrowserClient();
    const { showToast } = useToastStore();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            showToast('Error cargando productos.');
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) return;

        setDeletingId(id);
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            showToast('Error al eliminar el producto.');
        } else {
            showToast('Producto eliminado correctamente.');
            setProducts(products.filter(p => p.id !== id));
        }
        setDeletingId(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-[#a8a3b5] font-brand uppercase tracking-widest text-xs">Cargando inventario...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white font-brand uppercase tracking-tighter">Gestión de Catálogo</h1>
                    <p className="text-[#a8a3b5] text-sm">Administra el inventario de productos de Loyafu</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-primary hover:bg-[#a844ff] text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_8px_20px_rgba(157,51,247,0.3)] active:scale-[0.98] text-sm"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d667c]" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#18131e] border border-white/5 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="bg-[#18131e] border border-white/5 text-[#a8a3b5] px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-white/5 transition-colors text-sm font-bold">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                    <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-[#a8a3b5] text-sm font-bold flex items-center">
                        {filteredProducts.length} Productos
                    </div>
                </div>
            </div>

            {/* Products Table/Grid */}
            <div className="bg-[#18131e] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                {filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-black text-[#6d667c] uppercase tracking-widest">Producto</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#6d667c] uppercase tracking-widest">Categoría</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#6d667c] uppercase tracking-widest">Precio</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#6d667c] uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#251e30] flex-shrink-0 border border-white/5">
                                                    {product.image_url ? (
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-[#6d667c]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{product.name}</p>
                                                    <p className="text-[#6d667c] text-[10px] uppercase font-black tracking-tight truncate">{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[#a8a3b5] text-[10px] font-bold uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-black text-sm">${product.price_usd?.toFixed(2)}</p>
                                            {product.wholesale_price && (
                                                <p className="text-primary/60 text-[10px] font-bold italic">W: ${product.wholesale_price?.toFixed(2)}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-[#a8a3b5] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 text-[#a8a3b5] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                                    title="Eliminar"
                                                >
                                                    {deletingId === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <Link
                                                    href={`/catalog`}
                                                    target="_blank"
                                                    className="p-2 text-[#a8a3b5] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                    title="Ver en vivo"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-10 h-10 text-[#6d667c]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">No hay productos disponibles</h3>
                        <p className="text-[#6d667c] text-sm max-w-sm">
                            {searchTerm
                                ? `No se encontraron resultados para "${searchTerm}". Prueba con otra búsqueda.`
                                : "Tu catálogo está vacío. Comienza añadiendo tu primer producto."}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/admin/products/new"
                                className="mt-8 text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-3 transition-all"
                            >
                                Añadir Producto <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
