"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Truck, ArrowRight, ShieldCheck, Leaf, MessageCircle, ShoppingBag, Percent, Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { DeliveryModal } from '@/components/cart/DeliveryModal';
import { DeliveryDetails } from '@/store/useCartStore';
import { useSettings } from '@/context/SettingsContext';
import { useProductModalStore } from '@/store/useProductModalStore';
import { PRODUCTS } from '@/data/products';

export default function Cart() {
    const { items, removeItem, updateQuantity, updateItemColor, getTotal, currency, exchangeRate, deliveryMethod, setDeliveryMethod, deliveryDetails, setDeliveryDetails } = useCartStore();
    const openModal = useProductModalStore((state) => state.openModal);
    const { getSetting } = useSettings();
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
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-32 h-32 bg-white/50 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center shadow-2xl">
                        <ShoppingBag className="w-12 h-12 text-primary/60" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-background-dark mb-4 tracking-tighter uppercase italic">Tu bolsa está vacía</h1>
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Left Column: Cart items & Suggested */}
                <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-background-dark tracking-tighter uppercase italic">Mi Bolsa</h1>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {items.map((item, index) => {
                                const isWholesale = item.wholesalePrice && item.wholesaleMin && item.quantity >= item.wholesaleMin;
                                const priceUSD = isWholesale ? item.wholesalePrice! : item.priceUSD;
                                const itemPrice = currency === 'USD' ? priceUSD : priceUSD * exchangeRate;
                                const itemTotal = itemPrice * item.quantity;

                                return (
                                    <div
                                        key={`${item.id}-${item.selectedColor || 'none'}`}
                                        className="group bg-white p-4 rounded-[2rem] flex flex-row items-center gap-4 border border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm"
                                    >
                                        <div
                                            className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-50 cursor-pointer"
                                            onClick={() => openModal(item)}
                                        >
                                            <Image src={item.image} fill className="object-cover" alt={item.name} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-sm md:text-lg text-background-dark truncate">{item.name}</h3>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</p>

                                            {/* Visual Progress Bar for Wholesale Incentive */}
                                            {!isWholesale && item.wholesaleMin && (
                                                <div className="mt-2 w-full max-w-[180px]">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[8px] font-black uppercase text-primary/60">Progreso Mayorista</span>
                                                        <span className="text-[8px] font-black text-primary">{item.quantity}/{item.wholesaleMin}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-primary/5">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary/40 to-primary transition-all duration-1000 ease-out"
                                                            style={{ width: `${(item.quantity / item.wholesaleMin) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[7px] font-bold text-slate-400 mt-1">
                                                        Faltan <span className="text-primary">{item.wholesaleMin - item.quantity}</span> para precio especial
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity, -1, item.selectedColor); }} className="p-1"><Minus className="w-3 h-3" /></button>
                                                    <span className="px-2 font-black text-xs">{item.quantity}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity, 1, item.selectedColor); }} className="p-1"><Plus className="w-3 h-3" /></button>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id, item.selectedColor); }} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm md:text-xl font-black text-background-dark leading-none">
                                                {currency === 'USD' ? `$${itemTotal.toFixed(2)}` : `${itemTotal.toFixed(2)} Bs`}
                                            </p>
                                            {isWholesale && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase inline-block mt-1">Mayorista</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cross-selling Section */}
                    <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-black text-background-dark tracking-tighter uppercase italic">Completa tu Look</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {suggestedProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => openModal(product)}
                                    className="group bg-slate-50 p-3 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                                        <Image src={product.image} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                                    </div>
                                    <h4 className="text-[10px] font-black text-background-dark truncate leading-tight mb-1">{product.name}</h4>
                                    <p className="text-[11px] font-black text-primary">${product.priceUSD}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Summary (Desktop Only) */}
                <div className="lg:w-[400px]">
                    <div className="bg-[#18131e] text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-28 space-y-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />

                        <div className="relative space-y-6">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Resumen</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                    <span className="font-bold text-white">${subtotalUSD.toFixed(2)}</span>
                                </div>

                                {/* Delivery Selector */}
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Método de Entrega</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['pickup', 'local_delivery', 'national_shipping'].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setDeliveryMethod(m as any)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-tight transition-all",
                                                    deliveryMethod === m ? "bg-primary text-white" : "bg-white/5 text-slate-400"
                                                )}
                                            >
                                                {m === 'pickup' ? 'Tienda' : m === 'local_delivery' ? 'Delivery' : 'Nacional'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total</p>
                                        <div className="text-4xl font-black tracking-tighter">
                                            {currency === 'USD' ? `$${totalUSD.toFixed(2)}` : `${totalBs.toFixed(2)} Bs`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {hasDiscount && <span className="text-green-400 text-[10px] font-black block mb-1">Ahorraste 25%</span>}
                                        <span className="text-slate-400 font-bold text-xs">{currency === 'USD' ? `${totalBs.toFixed(2)} Bs` : `$${totalUSD.toFixed(2)}`}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Elements */}
                            <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5">
                                <div className="flex flex-col items-center text-center gap-1 opacity-60">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                    <span className="text-[8px] font-black uppercase">Seguro</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1 opacity-60">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <span className="text-[8px] font-black uppercase">Rápido</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1 opacity-60">
                                    <Heart className="w-5 h-5 text-amber-400" />
                                    <span className="text-[8px] font-black uppercase">Original</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#25D366] text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Pagar por WhatsApp
                                <MessageCircle className="w-6 h-6" />
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
        </div>
    );
}
