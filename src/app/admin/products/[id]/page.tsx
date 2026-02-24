"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import {
    ChevronLeft,
    Save,
    Loader2,
    UploadCloud,
    Image as ImageIcon,
    X,
    Plus,
    Box,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/components/ui/Toast';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const supabase = createSupabaseBrowserClient();
    const { showToast } = useToastStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price_usd: '',
        description: '',
        category: '',
        wholesale_price: '',
        wholesale_min: '',
    });

    const [colors, setColors] = useState<string[]>([]);
    const [newColor, setNewColor] = useState('');

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            showToast('Error cargando el producto.');
            router.push('/admin/products');
        } else if (data) {
            setFormData({
                id: data.id,
                name: data.name,
                price_usd: data.price_usd.toString(),
                description: data.description || '',
                category: data.category,
                wholesale_price: data.wholesale_price?.toString() || '',
                wholesale_min: data.wholesale_min?.toString() || '',
            });
            setColors(data.colors || []);
            setCurrentImageUrl(data.image_url || '');
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddColor = () => {
        if (newColor.trim() && !colors.includes(newColor.trim())) {
            setColors([...colors, newColor.trim()]);
            setNewColor('');
        }
    };

    const removeColor = (color: string) => {
        setColors(colors.filter(c => c !== color));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let finalImageUrl = currentImageUrl;

        try {
            // 1. Upload new image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrlData.publicUrl;
            }

            // 2. Update Database
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    price_usd: parseFloat(formData.price_usd),
                    description: formData.description,
                    category: formData.category,
                    image_url: finalImageUrl,
                    wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : null,
                    wholesale_min: formData.wholesale_min ? parseInt(formData.wholesale_min) : null,
                    colors: colors,
                    updated_at: new Date().toISOString()
                })
                .eq('id', productId);

            if (updateError) throw updateError;

            showToast('¡Producto actualizado con éxito!');
            router.refresh();
            // Don't auto-redirect, allow more edits if needed
            setCurrentImageUrl(finalImageUrl);
            setImageFile(null);
            setImagePreview(null);
        } catch (error: any) {
            console.error('Error saving product:', error);
            showToast(`Error: ${error.message || 'No se pudo guardar el producto'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-[#a8a3b5] font-brand uppercase tracking-widest text-xs">Cargando producto...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Link
                href="/admin/products"
                className="flex items-center gap-2 text-[#a8a3b5] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver al inventario
            </Link>

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white font-brand uppercase tracking-tighter">Editar Producto</h1>
                    <p className="text-[#a8a3b5] text-sm">Modifica los detalles del producto</p>
                </div>
                <button
                    onClick={() => {
                        if (confirm('¿Estás seguro de eliminar este producto?')) {
                            supabase.from('products').delete().eq('id', productId).then(() => {
                                showToast('Producto eliminado');
                                router.push('/admin/products');
                            });
                        }
                    }}
                    className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all"
                    title="Eliminar producto"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-[#18131e] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Left Column: Image */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest mb-4 block pl-1">Imagen del Producto</label>
                                <div
                                    className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-[#251e30] group cursor-pointer hover:border-primary/50 transition-all shadow-inner"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {(imagePreview || currentImageUrl) ? (
                                        <>
                                            <Image
                                                src={imagePreview || currentImageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover group-hover:opacity-40 transition-opacity"
                                                unoptimized={currentImageUrl?.includes('.gif') || !!imagePreview}
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                                <UploadCloud className="w-10 h-10 mb-2" />
                                                <span className="text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Cambiar Imagen</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-[#6d667c] flex flex-col items-center p-8 text-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <ImageIcon className="w-8 h-8 opacity-50" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest mb-1">Subir Imagen Principal</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <p className="text-[10px] text-[#6d667c] mt-4 italic text-center">Formato cuadrado (1:1) recomendado.</p>
                            </div>

                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-primary" /> Inventario y Colores
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">ID del Producto (No editable)</label>
                                        <input
                                            type="text"
                                            value={formData.id}
                                            disabled
                                            className="w-full bg-[#251e30]/50 border border-white/5 text-[#a8a3b5] px-4 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Colores / Tonos</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newColor}
                                                onChange={(e) => setNewColor(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                                                placeholder="Nombre o Hex"
                                                className="flex-1 bg-[#251e30] border border-white/5 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-primary transition-all text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddColor}
                                                className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-xl transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {colors.map(color => (
                                                <span
                                                    key={color}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20"
                                                >
                                                    {color}
                                                    <button onClick={() => removeColor(color)} className="hover:text-white">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Nombre del Producto</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nombre impactante del producto"
                                    className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-primary transition-all text-lg font-black font-brand italic"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Categoría</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold appearance-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Salome Makeup">Salome Makeup</option>
                                        <option value="Dolce Bella">Dolce Bella</option>
                                        <option value="Importado">Importado</option>
                                        <option value="Aria Cosmetics">Aria Cosmetics</option>
                                        <option value="Ushas">Ushas</option>
                                        <option value="Brochas">Brochas</option>
                                        <option value="Cuidado Del Cabello">Cuidado Del Cabello</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Precio Detal ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price_usd"
                                        required
                                        value={formData.price_usd}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-primary transition-all text-base font-black"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Escribe los beneficios, usos y detalles del producto..."
                                    className="w-full bg-[#251e30] border border-white/5 text-[#a8a3b5] px-4 py-4 rounded-xl focus:outline-none focus:border-primary transition-all text-sm resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Información de Mayorista (Opcional)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Precio Mayor ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="wholesale_price"
                                            value={formData.wholesale_price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Min. Unidades</label>
                                        <input
                                            type="number"
                                            name="wholesale_min"
                                            value={formData.wholesale_min}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 3"
                                            className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-[#a844ff] text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_30px_rgba(157,51,247,0.4)] active:scale-[0.97]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando Cambios...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Publicar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
