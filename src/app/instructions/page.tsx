"use client";

import { Info, BookOpen, MessageCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Instructions() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black text-background-dark tracking-tighter uppercase italic">Instrucciones de Compra</h1>
                <p className="text-slate-500 font-medium">Todo lo que necesitas saber para comprar en Loyafu</p>
            </div>

            <div className="grid gap-6">
                {[
                    {
                        title: "1. Explora y Selecciona",
                        desc: "Navega por nuestro catálogo y añade tus productos favoritos a la bolsa. Si el producto tiene tonos (como polvos o bases), podrás elegir el que prefieras.",
                        icon: <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">1</div>
                    },
                    {
                        title: "2. Revisa tu Pedido",
                        desc: "Entra a tu Bolsa de Compras para confirmar las cantidades y tonos seleccionados. El sistema calculará automáticamente si calificas para precios al mayor.",
                        icon: <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                    },
                    {
                        title: "3. Paga por WhatsApp",
                        desc: "Haz clic en 'Pagar por WhatsApp'. Se generará un mensaje automático con tu pedido detallado y el total en USD y Bs. Envíanoslo para concretar el pago y envío.",
                        icon: <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">3</div>
                    }
                ].map((step, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0">{step.icon}</div>
                        <div className="space-y-1">
                            <h3 className="font-black text-background-dark text-lg uppercase tracking-tight">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-background-dark text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-6 h-6 text-primary-light" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Métodos de Pago</h2>
                    </div>
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">%</div>
                            <div>
                                <h4 className="font-black uppercase text-sm tracking-tight">Divisas y Binance</h4>
                                <p className="text-xs text-slate-400 font-medium">¡Obtén un <span className="text-green-400 font-bold">25% de descuento</span> pagando por estos medios!</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold">$</div>
                            <div>
                                <h4 className="font-black uppercase text-sm tracking-tight">Pago Móvil</h4>
                                <p className="text-xs text-slate-400 font-medium">Aceptamos transferencias nacionales a tasa BCV del día.</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed text-sm">
                        * Recuerda que nuestros precios mostrados en el catálogo <span className="text-white font-bold italic">no incluyen IVA</span>.
                    </p>
                    <a
                        href="https://wa.me/584244096534"
                        target="_blank"
                        className="inline-flex bg-white text-background-dark px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        Contactar Soporte
                    </a>
                </div>
            </div>

            <div className="text-center pt-8">
                <Link href="/catalog" className="text-primary font-black uppercase text-xs tracking-[0.2em] hover:opacity-70 transition-opacity">
                    Volver a la tienda
                </Link>
            </div>
        </div>
    );
}
