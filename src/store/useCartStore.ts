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
}

export interface CartItem extends Product {
    quantity: number;
    selectedColor?: string;
}

export type DeliveryMethod = 'pickup' | 'local_delivery' | 'national_shipping';

interface CartState {
    items: CartItem[];
    currency: 'USD' | 'VES';
    exchangeRate: number; // VES per USD
    deliveryMethod: DeliveryMethod;
    setDeliveryMethod: (method: DeliveryMethod) => void;
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
            setDeliveryMethod: (method) => set({ deliveryMethod: method }),
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
                    const price = (item.wholesalePrice && item.wholesaleMin && item.quantity >= item.wholesaleMin)
                        ? item.wholesalePrice
                        : item.priceUSD;
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
                    const price = (item.wholesalePrice && item.wholesaleMin && item.quantity >= item.wholesaleMin)
                        ? item.wholesalePrice
                        : item.priceUSD;
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
