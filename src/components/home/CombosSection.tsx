import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS } from '@/data/products';

export default function CombosSection() {
    const combos = PRODUCTS.filter(p => p.category === 'Combos');

    return (
        <section id="promociones" className="py-8 md:py-20 px-6 bg-gradient-to-b from-white to-primary/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-sm uppercase tracking-wider animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        Ofertas Especiales
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-background-dark tracking-tight">
                        Combos Emprendedores
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Inicia tu negocio con nuestros paquetes todo-en-uno. ¡Máxima rentabilidad asegurada!
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 justify-center">
                    {combos.map((product) => (
                        <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-400 italic">
                        * Los tonos de los productos en los combos pueden variar según disponibilidad.
                    </p>
                </div>
            </div>
        </section>
    );
}
