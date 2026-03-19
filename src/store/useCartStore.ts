import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    priceUSD: number;
    image: string;
    images?: string[];
    description?: string;
    category: string;
    wholesalePrice?: number;
    wholesaleMin?: number;
    badge?: 'nuevo' | 'promo' | 'agotado';
    colors?: string[]; // Available colors/tones
    requiredTonesCount?: number; // Requires a specific count of different tones for wholesale
    tonesImage?: string; // Optional image specifically for showing the tones/swatches
}

export interface CartItem extends Product {
    quantity: number;
    selectedColor?: string;
}

export type DeliveryMethod = 'pickup' | 'local_delivery' | 'national_shipping';

export interface DeliveryDetails {
    senderName: string;
    senderPhone: string;
    receiverName: string; // Used mostly for local delivery logic, but can be same as sender in national
    receiverPhone: string;
    needsLocationLink: boolean;
    // Specifics for National Shipping
    idNumber?: string;
    email?: string;
    agency?: string;
    agencyAddress?: string;
    agencyCode?: string;
}

interface CartState {
    items: CartItem[];
    currency: 'USD' | 'VES';
    exchangeRate: number; // VES per USD
    deliveryMethod: DeliveryMethod;
    deliveryDetails: DeliveryDetails | null;
    setDeliveryMethod: (method: DeliveryMethod) => void;
    setDeliveryDetails: (details: DeliveryDetails | null) => void;
    addItem: (product: Product, color?: string) => void;
    removeItem: (productId: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, color?: string) => void;
    updateItemColor: (productId: string, oldColor: string | undefined, newColor: string) => void;
    setCurrency: (currency: 'USD' | 'VES') => void;
    setExchangeRate: (rate: number) => void;
    clearCart: () => void;
    getCartTotal: () => { totalUSD: number; totalVES: number };
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            currency: 'USD',
            exchangeRate: 36.5, // Default mock rate, to be updated via API
            deliveryMethod: 'pickup',
            deliveryDetails: null,
            setDeliveryMethod: (method) => set({ deliveryMethod: method }),
            setDeliveryDetails: (details) => set({ deliveryDetails: details }),
            addItem: (product, color) =>
                set((state) => {
                    // Find item with same ID AND same color
                    const existingItem = state.items.find(
                        (item) => item.id === product.id && item.selectedColor === color
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id && item.selectedColor === color
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...product, quantity: 1, selectedColor: color }]
                    };
                }),
            removeItem: (productId, color) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.id === productId && item.selectedColor === color)
                    ),
                })),
            updateQuantity: (productId, quantity, color) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        (item.id === productId && item.selectedColor === color)
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                })),
            updateItemColor: (productId, oldColor, newColor) =>
                set((state) => {
                    // Check if there's already an item with the NEW color
                    const existingWithNewColor = state.items.find(
                        (item) => item.id === productId && item.selectedColor === newColor
                    );

                    if (existingWithNewColor) {
                        // Merge them
                        const sourceItem = state.items.find(
                            (item) => item.id === productId && item.selectedColor === oldColor
                        );
                        if (!sourceItem) return state;

                        return {
                            items: state.items
                                .filter((item) => !(item.id === productId && item.selectedColor === oldColor))
                                .map((item) =>
                                    (item.id === productId && item.selectedColor === newColor)
                                        ? { ...item, quantity: item.quantity + sourceItem.quantity }
                                        : item
                                )
                        };
                    }

                    // Just update the color
                    return {
                        items: state.items.map((item) =>
                            (item.id === productId && item.selectedColor === oldColor)
                                ? { ...item, selectedColor: newColor }
                                : item
                        )
                    };
                }),
            setCurrency: (currency) => set({ currency }),
            setExchangeRate: (rate) => set({ exchangeRate: rate }),
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                const state = get();
                const totalUSD = state.items.reduce((sum, item) => {
                    const totalQtyForProduct = state.items.reduce((qSum, i) => i.id === item.id ? qSum + i.quantity : qSum, 0);

                    let meetsTonesVariety = false;
                    if (item.requiredTonesCount !== undefined && item.requiredTonesCount > 0) {
                        const tonesForThisProduct = state.items
                            .filter(i => i.id === item.id)
                            .map(i => i.selectedColor)
                            .filter(Boolean) as string[];
                        const uniqueTones = new Set(tonesForThisProduct);
                        meetsTonesVariety = uniqueTones.size >= item.requiredTonesCount;
                    } else if (item.requiredTonesCount === undefined && (item as any).requiresAllTones === true) {
                        const tonesForThisProduct = state.items.filter(i => i.id === item.id).map(i => i.selectedColor).filter(Boolean) as string[];
                        meetsTonesVariety = new Set(tonesForThisProduct).size >= (item.colors?.length || 1);
                    }

                    const meetsMinQty = !!(item.wholesaleMin && totalQtyForProduct >= item.wholesaleMin);

                    const isWholesale = !!(item.wholesalePrice && (meetsMinQty || meetsTonesVariety));
                    const price = isWholesale ? item.wholesalePrice! : item.priceUSD;

                    return sum + price * item.quantity;
                }, 0);
                return {
                    totalUSD,
                    totalVES: totalUSD * state.exchangeRate,
                };
            },
            getTotal: () => {
                const state = get();
                return state.items.reduce((sum, item) => {
                    const totalQtyForProduct = state.items.reduce((qSum, i) => i.id === item.id ? qSum + i.quantity : qSum, 0);

                    let meetsTonesVariety = false;
                    if (item.requiredTonesCount !== undefined && item.requiredTonesCount > 0) {
                        const tonesForThisProduct = state.items
                            .filter(i => i.id === item.id)
                            .map(i => i.selectedColor)
                            .filter(Boolean) as string[];
                        const uniqueTones = new Set(tonesForThisProduct);
                        meetsTonesVariety = uniqueTones.size >= item.requiredTonesCount;
                    } else if (item.requiredTonesCount === undefined && (item as any).requiresAllTones === true) {
                        const tonesForThisProduct = state.items.filter(i => i.id === item.id).map(i => i.selectedColor).filter(Boolean) as string[];
                        meetsTonesVariety = new Set(tonesForThisProduct).size >= (item.colors?.length || 1);
                    }

                    const meetsMinQty = !!(item.wholesaleMin && totalQtyForProduct >= item.wholesaleMin);

                    const isWholesale = !!(item.wholesalePrice && (meetsMinQty || meetsTonesVariety));
                    const price = isWholesale ? item.wholesalePrice! : item.priceUSD;

                    return sum + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'loyafu-cart-storage',
            partialize: (state) => ({ items: state.items, currency: state.currency }),
        }
    )
);
