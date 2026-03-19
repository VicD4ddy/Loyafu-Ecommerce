"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Truck, ArrowRight, ShieldCheck, MessageCircle, ShoppingBag, Heart, ShoppingCart, Store, PackageCheck, Smartphone, Banknote, Bitcoin, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { DeliveryModal } from '@/components/cart/DeliveryModal';
import { DeliveryDetails } from '@/store/useCartStore';
import { useSettings } from '@/context/SettingsContext';
import { useProductModalStore } from '@/store/useProductModalStore';
import { PRODUCTS } from '@/data/products';

export default function Cart() {
    const { items, removeItem, updateQuantity, updateItemColor, getTotal, currency, exchangeRate, deliveryMethod, setDeliveryMethod, deliveryDetails, setDeliveryDetails, clearCart } = useCartStore();
    const openModal = useProductModalStore((state) => state.openModal);
    const { getSetting } = useSettings();
    const [mounted, setMounted] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pago_movil' | 'binance' | 'divisa'>('pago_movil');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const isNationalShipping = deliveryMethod === 'national_shipping';
    const NATIONAL_SHIPPING_MIN = 20;

    // Auto-reset delivery methods if cart drops below minimum
    useEffect(() => {
        const total = getTotal();
        if ((deliveryMethod === 'national_shipping' || deliveryMethod === 'local_delivery') && total < NATIONAL_SHIPPING_MIN) {
            setDeliveryMethod('pickup');
        }
    }, [deliveryMethod, items]);

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
    const canShipNationally = subtotalUSD >= NATIONAL_SHIPPING_MIN;
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

    const generateWhatsAppLink = (detailsToUse: DeliveryDetails | null = deliveryDetails) => {
        const phone = getSetting('whatsapp_number') || "584244096534";
        const storeName = getSetting('store_name') || "Loyafu";
        const welcomeMsg = getSetting('delivery_message') || "Hola! Quiero realizar el siguiente pedido";
        let message = `${welcomeMsg} en ${storeName}:\n\n`;

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

    // Cross-selling: Suggest 3 random products not in cart
    const suggestedProducts = PRODUCTS
        .filter(p => !items.some(item => item.id === p.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="relative w-40 h-40 bg-white/40 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(140,43,238,0.3)]">
                        <ShoppingBag className="w-16 h-16 text-primary/40 stroke-[1.5]" />
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-background-dark mb-6 tracking-tighter uppercase italic font-brand leading-none">
                    Tu bolsa está <span className="text-primary/40">vacía</span>
                </h1>
                <p className="text-slate-500 max-w-sm mb-10 font-medium leading-relaxed">
                    Parece que aún no has añadido nada a tu selección. ¡Explora nuestras colecciones exclusivas ahora!
                </p>
                <Link
                    href="/catalog"
                    className="group bg-background-dark text-white px-12 py-5 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 hover:shadow-primary/20"
                >
                    Explorar Catálogo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Left Column: Cart items & Suggested */}
                <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-5xl md:text-6xl font-black text-background-dark tracking-tighter uppercase italic font-brand leading-[0.85]">Mi <span className="text-primary">Bolsa</span></h1>
                            <button
                                onClick={() => { if (confirm('¿Vaciar toda la bolsa?')) clearCart(); }}
                                className="flex items-center gap-2 px-4 py-2.5 mt-1 rounded-full bg-red-50 text-red-500 border border-red-200 text-xs font-black uppercase hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Vaciar bolsa
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {(() => {
                                const groupedItems: Record<string, {
                                    baseItem: any;
                                    totalQuantity: number;
                                    variants: any[];
                                    uniqueTones: Set<string>;
                                }> = {};

                                items.forEach(item => {
                                    if (!groupedItems[item.id]) {
                                        groupedItems[item.id] = {
                                            baseItem: item,
                                            totalQuantity: 0,
                                            variants: [],
                                            uniqueTones: new Set()
                                        };
                                    }
                                    groupedItems[item.id].totalQuantity += item.quantity;
                                    groupedItems[item.id].variants.push(item);
                                    if (item.selectedColor) {
                                        groupedItems[item.id].uniqueTones.add(item.selectedColor);
                                    }
                                });

                                return Object.values(groupedItems).map((grouped, index) => {
                                    const { baseItem: item, totalQuantity: totalQtyForProduct, variants, uniqueTones: uniqueTonesInCart } = grouped;

                                    // Evaluate specific rule: requires a certain number of varied tones
                                    let meetsTonesVariety = false;

                                    if (item.requiredTonesCount !== undefined && Number(item.requiredTonesCount) > 0) {
                                        meetsTonesVariety = uniqueTonesInCart.size >= Number(item.requiredTonesCount);
                                    } else if (item.requiredTonesCount === undefined && (item as any).requiresAllTones === true) {
                                        meetsTonesVariety = uniqueTonesInCart.size >= (item.colors?.length || 1);
                                    }

                                    const meetsMinQty = item.wholesaleMin !== undefined && totalQtyForProduct >= item.wholesaleMin;
                                    const hasValidWholesalePrices = item.wholesalePrice !== undefined;
                                    const isWholesale = hasValidWholesalePrices && (meetsMinQty || meetsTonesVariety);

                                    const priceUSD = isWholesale ? item.wholesalePrice! : item.priceUSD;
                                    const itemPrice = currency === 'USD' ? priceUSD : priceUSD * exchangeRate;
                                    const groupTotal = itemPrice * totalQtyForProduct;

                                    return (
                                        <div
                                            key={item.id}
                                            className="group bg-white p-5 md:p-6 rounded-[1.5rem] flex flex-col sm:flex-row items-start gap-6 border border-primary/5 hover:border-primary/20 transition-all duration-500 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(140,43,238,0.1)] hover:-translate-y-0.5"
                                        >
                                            <div
                                                className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-50 cursor-pointer flex-shrink-0"
                                                onClick={() => openModal(item)}
                                            >
                                                <Image src={item.image} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                                            </div>

                                            <div className="flex-1 w-full min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full">
                                                    <div>
                                                        <h3 className="font-black text-xl md:text-2xl text-background-dark truncate font-brand italic tracking-tight leading-none mb-1">{item.name}</h3>
                                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</p>
                                                    </div>
                                                    <div className="sm:text-right flex items-center sm:block gap-3">
                                                        <p className="text-xl md:text-2xl font-black text-background-dark leading-none">
                                                            {currency === 'USD' ? `$${groupTotal.toFixed(2)}` : `${groupTotal.toFixed(2)} Bs`}
                                                        </p>
                                                        {isWholesale && <span className="text-[8px] md:text-[9px] bg-green-500 text-white px-2.5 py-1 rounded-full font-black uppercase inline-block mt-0 sm:mt-2">Mayorista</span>}
                                                    </div>
                                                </div>

                                                {/* Wholesale Progress Bar */}
                                                {item.wholesaleMin && item.wholesaleMin > 1 && (
                                                    <div className="mt-3 w-full max-w-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <span className="text-[9px] font-black uppercase text-primary/60 tracking-wider">Progreso Mayorista</span>
                                                            <span className="text-[9px] font-black text-primary">{totalQtyForProduct}/{item.wholesaleMin}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-out"
                                                                style={{ width: `${Math.min((totalQtyForProduct / item.wholesaleMin) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        {!isWholesale && (
                                                            <p className="text-[9px] font-bold text-slate-500 mt-2">
                                                                {item.wholesaleMin && item.requiredTonesCount ? (
                                                                    <span>Faltan <span className="text-primary">{item.wholesaleMin - totalQtyForProduct}</span> uds. o elegir min. <span className="text-primary">{item.requiredTonesCount}</span> tonos para dto</span>
                                                                ) : item.wholesaleMin ? (
                                                                    <span>Faltan <span className="text-primary">{item.wholesaleMin - totalQtyForProduct}</span> uds. para precio especial</span>
                                                                ) : item.requiredTonesCount ? (
                                                                    <span>Elige min. <span className="text-primary">{item.requiredTonesCount}</span> variedad de tonos para dto</span>
                                                                ) : null}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Variants Breakdown */}
                                                <div className="mt-4 grid gap-2">
                                                    {variants.map(variant => (
                                                        <div key={variant.selectedColor || 'base'} className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-primary/10 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">
                                                                    {variant.selectedColor ? `Tono: ${variant.selectedColor}` : 'Único'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(variant.id, variant.quantity, -1, variant.selectedColor); }} className="p-1 hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                                                                    <span className="px-3 font-black text-xs min-w-[20px] text-center text-background-dark">{variant.quantity}</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(variant.id, variant.quantity, 1, variant.selectedColor); }} className="p-1 hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                                                                </div>
                                                                <button onClick={(e) => { e.stopPropagation(); removeItem(variant.id, variant.selectedColor); }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all" title="Eliminar tono">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add another tone explicit button */}
                                                {item.colors && item.colors.length > 0 && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); openModal(item); }}
                                                        className="mt-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-primary bg-primary/5 hover:bg-primary/10 transition-colors inline-flex items-center gap-2 border border-primary/10"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Añadir otro tono
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    {/* Cross-selling Section */}
                    <div className="pt-12 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShoppingCart className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black text-background-dark tracking-tighter uppercase italic font-brand">Completa tu <span className="text-primary">Look</span></h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {suggestedProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => openModal(product)}
                                    className="group bg-white p-4 rounded-[1.5rem] border border-transparent hover:border-primary/10 hover:shadow-[0_10px_30px_-15px_rgba(140,43,238,0.15)] transition-all cursor-pointer text-center"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
                                        <Image src={product.image} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                                    </div>
                                    <h4 className="text-xs font-bold text-background-dark truncate leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                                    <p className="text-sm font-black text-primary">${product.priceUSD}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Summary (Desktop Only) */}
                <div className="lg:w-[420px]">
                    <div className="bg-[#120d18] text-white rounded-[2rem] p-8 shadow-[0_30px_100px_-20px_rgba(140,43,238,0.2)] sticky top-28 space-y-8 overflow-hidden border border-white/5 backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                        <div className="relative space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase font-brand">Resumen</h3>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                    <span className="font-bold text-white">${subtotalUSD.toFixed(2)}</span>
                                </div>

                                {/* Delivery Selector */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Método de Entrega</p>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { id: 'pickup', label: 'Tienda', icon: Store, disabled: false },
                                            { id: 'local_delivery', label: 'Delivery', icon: Truck, disabled: !canShipNationally },
                                            { id: 'national_shipping', label: 'Envío Nacional', icon: PackageCheck, disabled: !canShipNationally }
                                        ].map(m => {
                                            const Icon = m.icon;
                                            const active = deliveryMethod === m.id;
                                            const isDisabled = m.disabled;
                                            return (
                                                <button
                                                    key={m.id}
                                                    onClick={() => !isDisabled && setDeliveryMethod(m.id as any)}
                                                    disabled={isDisabled}
                                                    title={isDisabled ? `Mínimo $${NATIONAL_SHIPPING_MIN} para envío nacional` : undefined}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl text-[8px] font-black uppercase tracking-tight transition-all duration-300 border",
                                                        isDisabled
                                                            ? "opacity-40 cursor-not-allowed bg-white/5 text-slate-600 border-white/5"
                                                            : active
                                                                ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_20px_-5px_rgba(140,43,238,0.5)]"
                                                                : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300"
                                                    )}
                                                >
                                                    <Icon className={cn("w-4 h-4", isDisabled ? "text-slate-600" : active ? "text-primary" : "text-slate-500")} />
                                                    {m.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!canShipNationally && (
                                        <p className="text-[8px] text-amber-400/80 font-bold flex items-center gap-1">
                                            <span>⚠</span> Mínimo ${NATIONAL_SHIPPING_MIN} para Envío Nacional
                                        </p>
                                    )}
                                </div>

                                {/* Payment Selector */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Método de Pago</p>
                                        {hasDiscount && <span className="text-[8px] font-black text-green-400 animate-pulse">✦ 25% desc. activo</span>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { id: 'pago_movil', label: 'Pago Móvil', icon: Smartphone, discount: false, disabledWhen: false },
                                            { id: 'divisa', label: 'Efectivo', icon: Banknote, discount: true, disabledWhen: isNationalShipping },
                                            { id: 'binance', label: 'Binance', icon: Bitcoin, discount: true, disabledWhen: false }
                                        ].map(p => {
                                            const Icon = p.icon;
                                            const active = paymentMethod === p.id;
                                            const isPayDisabled = p.disabledWhen;
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => !isPayDisabled && setPaymentMethod(p.id as any)}
                                                    disabled={isPayDisabled}
                                                    title={isPayDisabled ? 'No disponible para Envío Nacional' : undefined}
                                                    className={cn(
                                                        "relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl text-[8px] font-black uppercase tracking-tight transition-all duration-300 border overflow-hidden",
                                                        isPayDisabled
                                                            ? "opacity-40 cursor-not-allowed bg-white/5 text-slate-600 border-white/5"
                                                            : active && p.discount
                                                                ? "bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)]"
                                                                : active
                                                                    ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_20px_-5px_rgba(140,43,238,0.5)]"
                                                                    : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300"
                                                    )}
                                                >
                                                    {p.discount && <span className="absolute top-1 right-1 text-[7px] font-black text-green-400 leading-none">-25%</span>}
                                                    <Icon className={cn("w-4 h-4", active && p.discount ? "text-green-400" : active ? "text-primary" : "text-slate-500")} />
                                                    {p.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Total Final</p>
                                        <div className="text-5xl font-black tracking-tighter font-brand italic text-white flex flex-col">
                                            <span>${totalUSD.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right pb-1 space-y-1">
                                        {hasDiscount && <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full block border border-green-500/30">25% OFF APLICADO</span>}
                                        {paymentMethod === 'pago_movil' && (
                                            <>
                                                <div className="text-sm font-black text-slate-300">
                                                    {totalBs.toFixed(2)} Bs
                                                </div>
                                                <div className="text-[8px] font-bold text-slate-500 uppercase">
                                                    Tasa BCV: {exchangeRate.toFixed(2)} Bs/$
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Trust Elements */}
                            <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5 relative z-10">
                                <div className="flex flex-col items-center text-center gap-2 group/trust">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/trust:bg-green-500/20 transition-colors duration-500">
                                        <ShieldCheck className="w-5 h-5 text-green-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Seguro</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2 group/trust">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/trust:bg-primary/20 transition-colors duration-500">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Rápido</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2 group/trust">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/trust:bg-amber-500/20 transition-colors duration-500">
                                        <Heart className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Original</span>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-3 mt-4 mb-6 relative z-10">
                                <label className="relative flex cursor-pointer items-start gap-4">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <div className="h-5 w-5 flex-shrink-0 rounded border border-white/20 bg-white/5 transition-all peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                                        <svg className={cn("h-3 w-3 text-white transition-opacity", termsAccepted ? "opacity-100" : "opacity-0")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="text-[11px] md:text-sm text-slate-400 font-medium leading-relaxed select-none">
                                        He leído y acepto las{' '}
                                        <Link href="/policies" className="text-primary-light hover:text-white transition-colors hover:underline font-bold" target="_blank" onClick={(e) => e.stopPropagation()}>
                                            políticas de compra, cambios y devoluciones
                                        </Link>
                                        {' '}de Loyafu.
                                    </div>
                                </label>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={!termsAccepted}
                                className={cn(
                                    "w-full py-5 rounded-3xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3",
                                    !termsAccepted
                                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-80"
                                        : deliveryMethod === 'pickup'
                                            ? "bg-[#25D366] text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-green-500/20 shadow-lg"
                                            : "bg-primary text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30 shadow-lg border-b-4 border-primary-dark/30"
                                )}
                            >
                                {deliveryMethod === 'pickup' ? (
                                    <>
                                        Pagar por WhatsApp
                                        <MessageCircle className="w-6 h-6" />
                                    </>
                                ) : (
                                    <>
                                        Continuar
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
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
                    window.open(generateWhatsAppLink(details), '_blank');
                }}
                initialData={deliveryDetails}
            />
        </div >
    );
}
