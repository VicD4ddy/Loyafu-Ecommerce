"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import { Save, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useToastStore } from '@/components/ui/Toast';

export default function FeaturedProductAdmin() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const { showToast } = useToastStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [buttonText, setButtonText] = useState('Comprar Ahora');
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProductData();
    }, []);

    const fetchProductData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('featured_product')
            .select('*')
            .order('id', { ascending: true })
            .limit(1)
            .single();

        if (data) {
            setTitle(data.title);
            setDescription(data.description);
            setButtonText(data.button_text || 'Comprar Ahora');
            setCurrentImageUrl(data.image_url);
        } else if (error && error.code !== 'PGRST116') {
            console.error('Error fetching data:', error);
            showToast('Error cargando la información.');
        }
        setLoading(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let finalImageUrl = currentImageUrl;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `featured_${Date.now()}.${fileExt}`;
            const filePath = `featured/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('featured-images')
                .upload(filePath, imageFile, { upsert: true });

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                showToast('Error subiendo la imagen.');
                setSaving(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('featured-images')
                .getPublicUrl(filePath);

            finalImageUrl = publicUrlData.publicUrl;
        }

        const { error: updateError } = await supabase
            .from('featured_product')
            .update({
                title,
                description,
                button_text: buttonText,
                image_url: finalImageUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1);

        if (updateError) {
            console.error('Update Error:', updateError);
            showToast('Error guardando los cambios.');
        } else {
            showToast('¡Producto destacado actualizado!');
            setCurrentImageUrl(finalImageUrl);
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-[#a8a3b5] font-brand uppercase tracking-widest text-xs">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-white font-brand uppercase tracking-tighter">Producto de la Semana</h1>
                <p className="text-[#a8a3b5] text-sm">Gestiona la información principal del Home Page</p>
            </div>

            <div className="bg-[#18131e] rounded-[2rem] p-8 shadow-2xl border border-white/5">
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest">Imagen Promocional</label>
                            <div
                                className="relative aspect-square w-full max-w-[300px] rounded-3xl overflow-hidden border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-[#251e30] group cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {(imagePreview || currentImageUrl) ? (
                                    <>
                                        <Image
                                            src={imagePreview || currentImageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover group-hover:opacity-50 transition-opacity"
                                            unoptimized={currentImageUrl.includes('.gif') || Boolean(imagePreview)}
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            <UploadCloud className="w-8 h-8 mb-2 drop-shadow-md" />
                                            <span className="text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Cambiar Imagen</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-[#6d667c] flex flex-col items-center">
                                        <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Subir Imagen</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Título Principal</label>
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#251e30] border border-white/5 text-white p-4 rounded-xl focus:outline-none focus:border-primary font-black text-xl italic font-brand h-24 resize-none leading-tight"
                                    placeholder="TU MEJOR VERSIÓN EMPIEZA HOY"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Descripción Breve</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#251e30] border border-white/5 text-[#a8a3b5] p-4 rounded-xl focus:outline-none focus:border-primary text-sm h-32 resize-none"
                                    placeholder="Lleva los productos esenciales..."
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6d667c] uppercase tracking-widest pl-1">Texto del Botón</label>
                                <input
                                    type="text"
                                    value={buttonText}
                                    onChange={(e) => setButtonText(e.target.value)}
                                    className="w-full bg-[#251e30] border border-white/5 text-white p-4 rounded-xl focus:outline-none focus:border-primary font-bold text-sm"
                                    placeholder="Comprar Ahora"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary hover:bg-[#a844ff] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_10px_25px_rgba(157,51,247,0.3)] active:scale-[0.98]"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? 'Guardando...' : 'Publicar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
