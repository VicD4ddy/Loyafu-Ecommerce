"use client";

import { Sparkles, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function CombosSection() {
    const [combos, setCombos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        async function fetchCombos() {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', 'Combos')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching combos:', error);
            } else {
                // Map database fields to application fields if necessary
                const mappedData = data?.map((p: any) => ({
                    ...p,
                    priceUSD: p.price_usd,
                    wholesalePrice: p.wholesale_price,
                    wholesaleMin: p.wholesale_min,
                    image: p.image_url
                })) || [];
                setCombos(mappedData);
            }
            setLoading(false);
        }

        fetchCombos();
    }, [supabase]);

    if (!loading && combos.length === 0) return null;

    return (
        <section id="promociones" className="py-8 md:py-20 px-6 bg-gradient-to-b from-white to-primary/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-sm uppercase tracking-wider animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        Ofertas Especiales
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-background-dark tracking-tighter uppercase font-brand italic leading-[0.85]">
                        COMBOS <span className="text-primary">EMPRENDEDORES</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Inicia tu negocio con nuestros paquetes todo-en-uno. ¡Máxima rentabilidad asegurada!
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 justify-center">
                        {combos.map((product) => (
                            <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-400 italic">
                        * Los tonos de los productos en los combos pueden variar según disponibilidad.
                    </p>
                </div>
            </div>
        </section>
    );
}
