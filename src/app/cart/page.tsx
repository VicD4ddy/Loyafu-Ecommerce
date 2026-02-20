"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Truck, ArrowRight, ShieldCheck, Leaf, MessageCircle, ShoppingBag, Percent } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Cart() {
    const { items, removeItem, updateQuantity, updateItemColor, getTotal, currency, exchangeRate } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pago_movil' | 'binance' | 'divisa'>('pago_movil');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotalUSD = getTotal();
    const hasDiscount = paymentMethod === 'binance' || paymentMethod === 'divisa';
    const discountAmount = hasDiscount ? subtotalUSD * 0.25 : 0;
    const totalUSD = subtotalUSD - discountAmount;

    const totalBs = totalUSD * exchangeRate;
    const currencySymbol = currency === 'USD' ? '$' : 'Bs.';

    const handleQuantityChange = (id: string, current: number, delta: number, color?: string) => {
        const newQuantity = current + delta;
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity, color);
    };

    const generateWhatsAppLink = () => {
        const phone = "584244096534";
        let message = "Hola! Quiero realizar el siguiente pedido en Loyafu:\n\n";

        items.forEach(item => {
            const isWholesale = item.wholesalePrice && item.wholesaleMin && item.quantity >= item.wholesaleMin;
            const price = isWholesale ? item.wholesalePrice : item.priceUSD;
            const displayPrice = currency === 'USD' ? price : price! * exchangeRate;

            message += `- (${item.quantity}) ${item.name}`;
            if (item.selectedColor) message += ` [Tono: ${item.selectedColor}]`;
            message += ` - ${currencySymbol}${(displayPrice! * item.quantity).toFixed(2)}`;
            if (isWholesale) message += " (Mayorista)";
            message += "\n";
        });

        message += `\nMétodo de Pago: ${paymentMethod === 'binance' ? 'Binance' : paymentMethod === 'divisa' ? 'Divisa (Efectivo)' : 'Pago Móvil'}\n`;

        if (hasDiscount) {
            message += `Subtotal: ${currencySymbol}${subtotalUSD.toFixed(2)}\n`;
            message += `Descuento (25% off): -${currencySymbol}${discountAmount.toFixed(2)}\n`;
        }

        const currentTotal = currency === 'USD' ? totalUSD : totalBs;
        message += `Total Final: ${currencySymbol}${currentTotal.toFixed(2)}`;
        if (exchangeRate > 0) {
            const totalBsFinal = totalUSD * exchangeRate;
            message += ` / Bs.${totalBsFinal.toFixed(2)}`;
        }
        message += `\n\n(Tasa ref: ${exchangeRate.toFixed(2)})`;
        message += `\n* Precios no incluyen IVA.`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-32 h-32 bg-white/50 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center shadow-2xl">
                        <ShoppingBag className="w-12 h-12 text-primary/60" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-background-dark mb-4 tracking-tighter uppercase italic">Tu bolsa está vacía</h1>
                <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
                    Parece que aún no has descubierto tu próximo favorito. Explora nuestra colección curada y eleva tu rutina.
                </p>
                <Link
                    href="/catalog"
                    className="group bg-background-dark text-white px-10 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    Explorar Catálogo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

                {/* Left Column: Cart Content */}
                <div className="flex-1 space-y-6 md:space-y-8">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="hidden md:flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                            <span className="w-6 h-[2px] bg-primary/30" />
                            Checkout
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-background-dark tracking-tighter uppercase italic">Mi Bolsa</h1>
                    </div>
                    <p className="text-slate-400 font-medium text-sm">
                        Tienes <span className="text-primary font-bold">{items.length}</span> {items.length === 1 ? 'artículo' : 'artículos'} listo{items.length === 1 ? '' : 's'}.
                    </p>

                    {/* Cart Items List */}
                    <div className="space-y-3 md:space-y-4">
                        {items.map((item, index) => {
                            const isWholesale = item.wholesalePrice && item.wholesaleMin && item.quantity >= item.wholesaleMin;
                            const priceUSD = isWholesale ? item.wholesalePrice! : item.priceUSD;
                            const itemPrice = currency === 'USD' ? priceUSD : priceUSD * exchangeRate;
                            const itemTotal = itemPrice * item.quantity;
                            const regularPrice = currency === 'USD' ? item.priceUSD : item.priceUSD * exchangeRate;
                            const savings = (regularPrice - itemPrice) * item.quantity;

                            return (
                                <div
                                    key={`${item.id}-${item.selectedColor || 'none'}`}
                                    className="group relative bg-white/40 backdrop-blur-sm p-2.5 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] flex flex-row items-center gap-3 md:gap-5 border border-primary/5 hover:border-primary/20 hover:bg-white transition-all duration-500 shadow-lg shadow-primary/5 animate-fadeInUp"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Product Image - Optimized Mobile Size */}
                                    <div className="relative w-16 h-16 md:w-28 md:h-28 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner group-hover:scale-95 transition-transform duration-500">
                                        <Image src={item.image} fill className="object-cover" alt={item.name} />
                                        {isWholesale && (
                                            <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-background-dark text-white text-[7px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-full z-10 tracking-widest uppercase">
                                                Mayorista
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info & Controls - Highly Organized for Mobile */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                                        <div className="space-y-1 text-left">
                                            <h3 className="font-black text-[13px] md:text-lg text-background-dark tracking-tight leading-tight truncate md:whitespace-normal group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[8px] md:text-[10px] bg-primary/5 text-primary-dark px-1.5 md:px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                                                    {item.category}
                                                </span>

                                                {/* Color Selector */}
                                                {item.colors && item.colors.length > 0 && (
                                                    <div className="flex items-center gap-1.5 ml-1">
                                                        <select
                                                            value={item.selectedColor || ''}
                                                            onChange={(e) => updateItemColor(item.id, item.selectedColor, e.target.value)}
                                                            className="text-[9px] md:text-[11px] font-black uppercase tracking-widest bg-background-light border border-primary/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
                                                        >
                                                            {!item.selectedColor && <option value="">Seleccionar Tono</option>}
                                                            {item.colors.map(color => (
                                                                <option key={color} value={color}>Tono: {color}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Quantity Selector - Compact for Mobile */}
                                            <div className="flex items-center bg-background-light p-0.5 rounded-lg md:rounded-xl border border-primary/10">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1, item.selectedColor)}
                                                    className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg hover:bg-white hover:text-primary flex items-center justify-center transition-all text-slate-400 active:scale-90"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                                </button>
                                                <span className="px-1 md:px-3 font-black text-background-dark min-w-[24px] md:min-w-[36px] text-center text-[10px] md:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.selectedColor)}
                                                    className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg hover:bg-white hover:text-primary flex items-center justify-center transition-all text-slate-400 active:scale-90"
                                                >
                                                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                                </button>
                                            </div>

                                            {/* Delete Button - Tucked away for cleanliness */}
                                            <button
                                                onClick={() => removeItem(item.id, item.selectedColor)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors md:hidden"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id, item.selectedColor)}
                                                className="hidden md:flex text-[11px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest items-center gap-2 transition-colors py-2 px-3 hover:bg-red-50 rounded-xl"
                                            >
                                                <Trash2 className="w-4 h-4" /> Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Info - Fixed Right Positioning */}
                                    <div className="text-right flex flex-col justify-between items-end gap-0.5 md:gap-1 self-stretch py-1">
                                        <div className="space-y-0">
                                            <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Subtotal</p>
                                            <p className="text-sm md:text-xl font-black text-background-dark tabular-nums group-hover:text-primary transition-colors leading-none">
                                                {currency === 'USD' ? `$${itemTotal.toFixed(2)}` : `${itemTotal.toFixed(2)} Bs`}
                                            </p>
                                            <p className="text-[9px] md:text-[11px] font-bold text-primary/60 tabular-nums">
                                                {(priceUSD * exchangeRate).toFixed(2)} Bs
                                            </p>
                                        </div>
                                        {isWholesale && savings > 0 && (
                                            <div className="bg-green-100 text-green-700 text-[7px] md:text-[10px] font-black px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-sm">
                                                -{currencySymbol}{savings.toFixed(2)} OFF
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Summary Section - Integrated into flow */}
                    <div className="lg:hidden space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-background-dark text-white rounded-[1.5rem] p-4 shadow-xl shadow-primary/10">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <div className="text-right">
                                        <div className="text-white">${totalUSD.toFixed(2)}</div>
                                        <div className="text-primary-light/60 text-[10px]">({totalBs.toFixed(2)} Bs)</div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-white/50 font-bold text-[10px] uppercase tracking-widest px-1 pt-2 border-t border-white/5">
                                    <span>Tasa ref. BCV</span>
                                    <span className="text-primary-light">{exchangeRate.toFixed(2)} Bs/$</span>
                                </div>
                                <div className="space-y-2 py-3 border-t border-white/10">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método de Pago</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'pago_movil', label: 'Pago Móvil' },
                                            { id: 'divisa', label: 'Divisa', discount: true },
                                            { id: 'binance', label: 'Binance', discount: true }
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={cn(
                                                    "relative py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border",
                                                    paymentMethod === method.id
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                {method.label}
                                                {method.discount && (
                                                    <span className="absolute -top-1.5 -right-1 bg-green-500 text-white text-[6px] px-1 rounded-full animate-bounce">
                                                        -25%
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end py-3 border-t border-white/10">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-300">Total Final</span>
                                        {hasDiscount && (
                                            <div className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                                                <Percent className="w-3 h-3" /> Ahorraste ${discountAmount.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-primary-light tracking-tighter tabular-nums leading-none">
                                            {currency === 'USD' ? `$${totalUSD.toFixed(2)}` : `${totalBs.toFixed(2)} Bs`}
                                        </div>
                                        {currency === 'USD' ? (
                                            <span className="text-[10px] font-bold text-primary-light/60 mt-0.5 inline-block">{totalBs.toFixed(2)} Bs</span>
                                        ) : (
                                            <span className="text-[9px] font-bold text-slate-400 mt-0.5 inline-block">${totalUSD.toFixed(2)} USD</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-[9px] text-slate-500 text-center italic py-1">
                                    * Nuestros precios no incluyen IVA
                                </div>

                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-sm shadow-2xl flex items-center justify-center gap-3 border-b-4 border-green-700 active:scale-[0.98] transition-all"
                                >
                                    Pagar por WhatsApp
                                    <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
                                Al pagar, aceptas las <Link href="/policies" className="text-primary font-black hover:underline">Políticas de Compra</Link> de Loyafu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary (Desktop Only) */}
                <div className="lg:w-[380px] hidden lg:block">
                    <div className="bg-background-dark text-white rounded-[2rem] p-6 shadow-2xl shadow-primary/20 sticky top-28 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-xl font-black tracking-tighter mb-1">Resumen</h3>
                                <div className="w-8 h-1 bg-primary rounded-full" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <div className="text-right">
                                        <div className="text-white text-sm">${subtotalUSD.toFixed(2)}</div>
                                        <div className="text-primary-light/60 text-[10px]">({(subtotalUSD * exchangeRate).toFixed(2)} Bs)</div>
                                    </div>
                                </div>

                                {/* Payment Method Selector (Desktop) */}
                                <div className="space-y-3 py-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método de Pago</span>
                                        <span className="text-[10px] font-bold text-green-400 animate-pulse">25% OFF con Binance/Cash</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'pago_movil', label: 'Pago Móvil', sub: 'Tasa BCV' },
                                            { id: 'divisa', label: 'Divisa (Efectivo)', sub: '25% DESCUENTO' },
                                            { id: 'binance', label: 'Binance (USDT)', sub: '25% DESCUENTO' }
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all border group",
                                                    paymentMethod === method.id
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 translate-x-1"
                                                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                <span>{method.label}</span>
                                                <span className={cn(
                                                    "text-[9px] font-bold px-2 py-0.5 rounded-full",
                                                    paymentMethod === method.id ? "bg-white/20 text-white" : "bg-white/10 text-slate-500 group-hover:text-slate-300"
                                                )}>
                                                    {method.sub}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {hasDiscount && (
                                    <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-xl border border-green-500/20 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Percent className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase">Ahorro Aplicado (25%)</span>
                                        </div>
                                        <span className="text-sm font-black text-green-400">-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest pt-2 border-t border-white/5">
                                    <span>Tasa ref. BCV</span>
                                    <span className="text-primary-light">{exchangeRate.toFixed(2)} Bs/$</span>
                                </div>

                                <div className="py-4 border-y border-white/10 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-300">Total Final</span>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-primary-light tracking-tighter tabular-nums drop-shadow-2xl leading-none">
                                                {currency === 'USD' ? `$${totalUSD.toFixed(2)}` : `${totalBs.toFixed(2)} Bs`}
                                            </div>
                                            <div className="text-[10px] text-primary-light/60 font-bold mt-1">
                                                {currency === 'USD' ? `Ref: ${totalBs.toFixed(2)} Bs` : `Ref: $${totalUSD.toFixed(2)}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-primary-light/60 font-medium text-center italic border-t border-white/5 pt-2">
                                    * Nuestros precios no incluyen IVA
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center pt-1">
                                            <input
                                                type="checkbox"
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-white/10 bg-transparent transition-all checked:border-primary checked:bg-primary"
                                                id="policy-agreement"
                                            />
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <ShieldCheck className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                            Acepto las <Link href="/policies" className="text-primary-light font-black hover:underline">Políticas de Compra</Link>, envíos y garantías de Loyafu.
                                        </span>
                                    </label>
                                </div>

                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-green-700/50"
                                >
                                    Pagar por WhatsApp
                                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5">
                                    <ShieldCheck className="w-5 h-5 text-primary-light" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Pago Seguro</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5">
                                    <Leaf className="w-5 h-5 text-primary-light" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Boutique Pro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
