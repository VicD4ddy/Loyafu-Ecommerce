"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Truck, ArrowRight, ShieldCheck, Leaf, MessageCircle, ShoppingBag, Percent } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { DeliveryModal } from '@/components/cart/DeliveryModal';
import { DeliveryDetails } from '@/store/useCartStore';

export default function Cart() {
    const { items, removeItem, updateQuantity, updateItemColor, getTotal, currency, exchangeRate, deliveryMethod, setDeliveryMethod, deliveryDetails, setDeliveryDetails } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pago_movil' | 'binance' | 'divisa'>('pago_movil');

    const isNationalShipping = deliveryMethod === 'national_shipping';

    // Divisa is not allowed for national shipping. If selected somehow, fallback to pago_movil in UI
    // Note: Hooks MUST be called before any early returns (like the !mounted check below)
    useEffect(() => {
        if (isNationalShipping && paymentMethod === 'divisa') {
            setPaymentMethod('pago_movil');
        }
    }, [isNationalShipping, paymentMethod]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotalUSD = getTotal();
    const hasDiscount = isNationalShipping
        ? (paymentMethod === 'binance' || paymentMethod === 'pago_movil')
        : (paymentMethod === 'binance' || paymentMethod === 'divisa');
    const discountAmount = hasDiscount ? subtotalUSD * 0.25 : 0;
    const totalUSD = subtotalUSD - discountAmount;

    const totalBs = totalUSD * exchangeRate;
    const currencySymbol = currency === 'USD' ? '$' : 'Bs.';

    const handleQuantityChange = (id: string, current: number, delta: number, color?: string) => {
        const newQuantity = current + delta;
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity, color);
    };

    const generateWhatsAppLink = (detailsToUse: DeliveryDetails | null = deliveryDetails) => {
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

        const deliveryText = deliveryMethod === 'pickup' ? 'Retiro en Tienda (CC Gran Bazar)' :
            deliveryMethod === 'local_delivery' ? 'Delivery Local (Valencia)' :
                'Envío Nacional';

        message += `\n📦 Entrega: ${deliveryText}`;

        if (detailsToUse && deliveryMethod !== 'pickup') {
            message += `\n\n--- Datos de Envío ---`;
            if (deliveryMethod === 'national_shipping') {
                message += `\nNombre completo: ${detailsToUse.receiverName}`;
                message += `\nCédula: ${detailsToUse.idNumber}`;
                message += `\nNúmero de teléfono: ${detailsToUse.receiverPhone}`;
                message += `\nCorreo electrónico: ${detailsToUse.email}`;
                message += `\nAgencia: ${detailsToUse.agency}`;
                message += `\nDirección y nombre de la oficina: ${detailsToUse.agencyAddress}`;
                if (detailsToUse.agencyCode) message += `\nCódigo de agencia: ${detailsToUse.agencyCode}`;
                message += `\n\n* El envío es cobro destino\n`;
            } else {
                message += `\nEnvía: ${detailsToUse.senderName} (${detailsToUse.senderPhone})`;
                message += `\nRecibe: ${detailsToUse.receiverName} (${detailsToUse.receiverPhone})`;
                message += `\n📍 Ubicación: Adjuntar por Google Maps\n`;
            }
        }

        message += `\n💳 Método de Pago: ${paymentMethod === 'binance' ? 'Binance' : paymentMethod === 'divisa' ? 'Divisa (Efectivo)' : 'Pago Móvil'}\n`;

        if (hasDiscount) {
            message += `Subtotal: ${currencySymbol}${subtotalUSD.toFixed(2)}\n`;
            message += `Descuento (25% off): -${currencySymbol}${discountAmount.toFixed(2)}\n`;
        }

        const currentTotal = currency === 'USD' ? totalUSD : totalBs;
        message += `Total Final: ${currencySymbol}${currentTotal.toFixed(2)}`;

        // Only show Bs equivalent if paying in local currency (Pago Móvil)
        if (exchangeRate > 0 && paymentMethod === 'pago_movil') {
            const totalBsFinal = totalUSD * exchangeRate;
            message += ` / Bs.${totalBsFinal.toFixed(2)}`;
        }

        if (paymentMethod === 'pago_movil') {
            message += `\n\n(Tasa ref: ${exchangeRate.toFixed(2)})`;
        }
        message += `\n* Precios no incluyen IVA.`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const handleCheckout = () => {
        if (deliveryMethod === 'pickup') {
            window.open(generateWhatsAppLink(), '_blank');
        } else {
            setIsDeliveryModalOpen(true);
        }
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
                                <div className="space-y-4 py-3 border-t border-white/10">
                                    {/* Delivery Method Selector (Mobile) */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método de Entrega</span>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {[
                                                { id: 'pickup', label: 'Retiro Local' },
                                                { id: 'local_delivery', label: 'Delivery' },
                                                { id: 'national_shipping', label: 'Nacional' }
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setDeliveryMethod(method.id as any)}
                                                    className={cn(
                                                        "py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border",
                                                        deliveryMethod === method.id
                                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                                            : "bg-[#2a2435] text-slate-400 border-white/5 hover:bg-[#342e40]"
                                                    )}
                                                >
                                                    {method.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Method Selector (Mobile) */}
                                    <div className="space-y-2 pt-2 border-t border-dashed border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método de Pago</span>
                                            {hasDiscount && <span className="text-[9px] font-bold text-green-400">-25% Aplicado</span>}
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {[
                                                { id: 'pago_movil', label: 'Pago Móvil', discount: isNationalShipping },
                                                { id: 'divisa', label: 'Divisa', discount: !isNationalShipping, disabled: isNationalShipping },
                                                { id: 'binance', label: 'Binance', discount: true }
                                            ].map((method) => {
                                                if (method.disabled) return null;
                                                return (
                                                    <button
                                                        key={method.id}
                                                        onClick={() => setPaymentMethod(method.id as any)}
                                                        className={cn(
                                                            "relative py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border",
                                                            paymentMethod === method.id
                                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 z-10"
                                                                : "bg-[#2a2435] text-slate-400 border-white/5 hover:bg-[#342e40]"
                                                        )}
                                                    >
                                                        {method.label}
                                                        {method.discount && (
                                                            <span className="absolute -top-1.5 -right-1 bg-green-500 text-white text-[6px] px-1 rounded-full animate-pulse shadow-sm shadow-green-500/50">
                                                                -25%
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
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

                                {/* CTA WhatsApp Button (Mobile) */}
                                <button
                                    onClick={handleCheckout}
                                    className="group w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-sm shadow-2xl flex items-center justify-center gap-3 border-b-4 border-green-700 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    Pagar por WhatsApp
                                    <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </button>
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
                <div className="lg:w-[420px] hidden lg:block">
                    {/* Modern Premium Dark Card matches the uploaded reference image */}
                    <div className="bg-[#18131e] text-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(157,51,247,0.2)] border border-[#ffffff10] sticky top-28 overflow-hidden font-sans">
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-7">
                            <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                <span className="font-brand uppercase tracking-widest text-[#a8a3b5] font-black text-[13px]">Subtotal</span>
                                <div className="text-right">
                                    <div className="text-2xl font-black">${subtotalUSD.toFixed(2)}</div>
                                    <div className="text-primary-light/60 font-bold text-[11px]">({(subtotalUSD * exchangeRate).toFixed(2)} BS)</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="font-brand uppercase tracking-widest text-[#a8a3b5] font-black text-[11px]">Tasa Ref. BCV</span>
                                <span className="text-[#a8a3b5] font-black text-[13px]">{exchangeRate.toFixed(2)} BS/$</span>
                            </div>

                            {/* Delivery Method Section */}
                            <div className="space-y-3">
                                <h4 className="font-brand uppercase tracking-widest text-[#a8a3b5] font-black text-[11px]">Método de Entrega</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'pickup', label: 'Retiro en Tienda' },
                                        { id: 'local_delivery', label: 'Delivery' },
                                        { id: 'national_shipping', label: 'Nacional' }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setDeliveryMethod(method.id as any)}
                                            className={cn(
                                                "py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-tight transition-all border",
                                                deliveryMethod === method.id
                                                    ? "bg-primary text-white border-primary shadow-[0_8px_16px_rgba(157,51,247,0.3)]"
                                                    : "bg-[#251e30] border-transparent text-[#9a93ab] hover:bg-[#2d2539]"
                                            )}
                                        >
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-brand uppercase tracking-widest text-[#a8a3b5] font-black text-[11px]">Método de Pago</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'pago_movil', label: 'Pago Móvil', discount: isNationalShipping },
                                        { id: 'divisa', label: 'Divisa', discount: !isNationalShipping, disabled: isNationalShipping },
                                        { id: 'binance', label: 'Binance', discount: true }
                                    ].map((method) => {
                                        if (method.disabled) return null;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={cn(
                                                    "relative py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-tight transition-all border",
                                                    paymentMethod === method.id
                                                        ? "bg-primary text-white border-primary shadow-[0_8px_16px_rgba(157,51,247,0.3)]"
                                                        : "bg-[#251e30] border-transparent text-[#9a93ab] hover:bg-[#2d2539]"
                                                )}
                                            >
                                                {method.label}
                                                {method.discount && (
                                                    <span className="absolute -top-1.5 -right-1 bg-[#1fe96c] text-[#124225] font-black text-[8px] px-1.5 py-0.5 rounded-md shadow-md">
                                                        -25%
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Total Final Structure matching design exactly */}
                            <div className="pt-6 border-t border-white/5 space-y-1">
                                <div className="flex justify-between items-end">
                                    <span className="font-brand uppercase tracking-tighter text-white font-black text-[15px]">Total Final</span>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl leading-none">
                                            ${totalUSD.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {hasDiscount && (
                                            <span className="text-[#1fe96c] font-black text-[10px] uppercase tracking-wider">Ahorro: -${discountAmount.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="text-[#a8a3b5] font-black text-[14px]">
                                        {totalBs.toFixed(2)} Bs
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] text-[#6d667c] font-medium text-center italic mt-1">
                                * Nuestros precios no incluyen IVA
                            </div>

                            {/* CTA WhatsApp Button */}
                            <div className="pt-2">
                                <button
                                    onClick={handleCheckout}
                                    className="group w-full bg-[#1fe96c] text-[#124225] p-5 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(31,233,108,0.2)] hover:bg-[#25ff78] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-[#129d47] cursor-pointer"
                                >
                                    Pagar por WhatsApp
                                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <DeliveryModal
                isOpen={isDeliveryModalOpen}
                deliveryMethod={deliveryMethod}
                onClose={() => setIsDeliveryModalOpen(false)}
                onConfirm={(details) => {
                    setDeliveryDetails(details);
                    setIsDeliveryModalOpen(false);
                    // Open WhatsApp automatically upon saving details
                    window.open(generateWhatsAppLink(details), '_blank');
                }}
                initialData={deliveryDetails}
            />
        </div>
    );
}
