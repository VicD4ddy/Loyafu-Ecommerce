"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
    Box
} from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/components/ui/Toast';

export default function NewProductPage() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const { showToast } = useToastStore();

    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new (window as any).Image();
                img.src = event.target?.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(blob || file);
                    }, 'image/jpeg', 0.85);
                };
            };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let imageUrl = '';

        try {
            // 1. Upload Image to Storage if exists
            if (imageFile) {
                const compressedBlob = await compressImage(imageFile);
                const fileExt = 'jpg'; // We compress to jpeg
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, compressedBlob, {
                        contentType: 'image/jpeg'
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrlData.publicUrl;
            }

            // 2. Insert into Database
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    id: formData.id || `prod_${Date.now()}`,
                    name: formData.name,
                    price_usd: parseFloat(formData.price_usd),
                    description: formData.description,
                    category: formData.category,
                    image_url: imageUrl,
                    wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : null,
                    wholesale_min: formData.wholesale_min ? parseInt(formData.wholesale_min) : null,
                    colors: colors,
                    updated_at: new Date().toISOString()
                });

            if (insertError) throw insertError;

            showToast('¡Producto creado con éxito!');
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving product:', error);
            showToast(`Error: ${error.message || 'No se pudo guardar el producto'}`);
        } finally {
            setSaving(false);
        }
    };

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
                    <h1 className="text-3xl font-black text-white font-brand uppercase tracking-tighter">Nuevo Producto</h1>
                    <p className="text-[#a8a3b5] text-sm">Completa los detalles para añadir al catálogo</p>
                </div>
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
                                    {imagePreview ? (
                                        <>
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover group-hover:opacity-40 transition-opacity"
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
                                            <span className="text-[9px] font-medium opacity-50">Click para seleccionar archivo</span>
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
                                        <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">ID Personalizado (Opcional)</label>
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleInputChange}
                                            placeholder="Ej: lipstick-red-01"
                                            className="w-full bg-[#251e30] border border-white/5 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold placeholder:opacity-20"
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
                                        <option value="Combos">Combos (Especiales)</option>
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
                                Creando Producto...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
