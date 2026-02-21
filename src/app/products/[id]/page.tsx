"use client";


import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star, Truck, ShieldCheck, ShoppingBag, ChevronDown } from 'lucide-react';
import { Product, useCartStore } from '@/store/useCartStore';

// Mock Product Data for PDP (ID 1)
const PRODUCT: Product & { description: string, reviews: number } = {
    id: '1',
    name: 'Ultra-Glow Serum',
    priceUSD: 38.00,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1887',
    description: 'Instant radiance boost with Vitamin C & Hyaluronic Acid.',
    reviews: 1240
}

export default function ProductDetail({ params }: { params: { id: string } }) {
    // In a real app, verify params.id here

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-primary/60 mb-8 font-medium">
                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/catalog" className="hover:text-primary transition-colors">Cuidado de Piel</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-bold">{PRODUCT.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left: Image Gallery */}
                <div className="space-y-6">
                    <div className="relative group">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-xl shadow-primary/5 border border-primary/10 relative">
                            <Image
                                src={PRODUCT.image}
                                alt={PRODUCT.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Más Vendido</span>
                            <span className="bg-white text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md border border-primary/10">Vegano</span>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {[1, 2, 3, 4].map((i) => (
                            <button key={i} className={`shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${i === 1 ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                                <div className="relative w-full h-full bg-gray-100">
                                    {/* Placeholder for thumbnails */}
                                    <Image src={PRODUCT.image} alt="Thumbnail" fill className="object-cover opacity-80" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Details (Sticky) */}
                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-1 text-primary">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                            <span className="text-sm font-bold ml-2 text-slate-600">4.8 (1.2k reviews)</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-background-dark">
                            Ultra-Glow <span className="text-primary italic">Serum</span>
                        </h1>
                        <p className="text-lg text-primary/70 font-medium leading-relaxed">
                            {PRODUCT.description}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-extrabold text-background-dark">$38.00</span>
                        <span className="text-xl text-primary/40 line-through font-bold">$45.00</span>
                    </div>

                    {/* Purchase Options */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer transition-all hover:bg-primary/10 group relative">
                            <div className="flex items-center h-5">
                                <input type="radio" name="purchase_type" defaultChecked className="w-5 h-5 text-primary focus:ring-primary/50 border-gray-300" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-lg text-background-dark">Únete al Club y Ahorra</p>
                                <p className="text-sm text-primary/70">Suscríbete y obtén 15% de descuento en cada orden</p>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-primary">$32.30</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/10 hover:border-primary/30 cursor-pointer transition-all group">
                            <div className="flex items-center h-5">
                                <input type="radio" name="purchase_type" className="w-5 h-5 text-primary focus:ring-primary/50 border-gray-300" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-lg text-background-dark">Compra única</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary/60">$38.00</p>
                            </div>
                        </label>
                    </div>

                    {/* CTA */}
                    <button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-5 rounded-full text-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3">
                        <ShoppingBag className="w-6 h-6" />
                        Unirse al Club y Comprar
                    </button>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary/5 shadow-sm">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Cruelty Free</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary/5 shadow-sm">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Envío Gratis</span>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="border-t border-primary/10 pt-4 space-y-2">
                        <details className="group border-b border-primary/5 pb-4">
                            <summary className="flex items-center justify-between cursor-pointer list-none py-2 font-bold hover:text-primary transition-colors text-slate-700">
                                <span>Cómo Usar</span>
                                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <p className="text-sm leading-relaxed text-primary/70 py-2">
                                Apply 3-5 drops to clean, dry face and neck. Gently massage in upward circular motions until fully absorbed. For best results, use morning and night before your moisturizer.
                            </p>
                        </details>
                        <details className="group border-b border-primary/5 pb-4">
                            <summary className="flex items-center justify-between cursor-pointer list-none py-2 font-bold hover:text-primary transition-colors text-slate-700">
                                <span>Ingredientes Clave</span>
                                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <p className="text-sm leading-relaxed text-primary/70 py-2">
                                Pure Vitamin C (L-Ascorbic Acid), Triple Molecular Weight Hyaluronic Acid, Organic Rosehip Oil, and Niacinamide.
                            </p>
                        </details>
                    </div>

                </div>
            </div>
        </div>
    );
}
