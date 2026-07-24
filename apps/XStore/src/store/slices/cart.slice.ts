// apps/XStore/src/store/slices/cart.slice.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

export interface CartItem {
  id: string;
  variantId: string;
  variantTitle?: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images?: { url: string }[];
  };
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  totalItems: number;
  totalPrice: number;
  coupon: string | null;
  discount: number;

  setCartId: (cartId: string) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  recalculateTotals: () => void;
  applyCoupon: (coupon: string, discount: number) => void;
  removeCoupon: () => void;
}

// SecureStore storage adapter for Zustand
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('SecureStore get error:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('SecureStore set error:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('SecureStore delete error:', error);
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      totalItems: 0,
      totalPrice: 0,
      coupon: null,
      discount: 0,

      setCartId: (cartId) => set({ cartId }),

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.variantId === item.variantId
        );

        let newItems;
        if (existingIndex !== -1) {
          // Update existing item
          newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
          };
        } else {
          // Add new item
          newItems = [...items, item];
        }

        set({ items: newItems });
        get().recalculateTotals();
      },

      updateQuantity: (itemId, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        get().recalculateTotals();
      },

      removeItem: (itemId) => {
        const items = get().items.filter((item) => item.id !== itemId);
        set({ items });
        get().recalculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          coupon: null,
          discount: 0,
        });
      },

      recalculateTotals: () => {
        const { items, discount } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce(
          (sum, item) => sum + (item.product.price || 0) * item.quantity,
          0
        );
        const totalPrice = Math.max(0, subtotal - discount);

        set({ totalItems, totalPrice });
      },

      applyCoupon: (coupon, discount) => {
        set({ coupon, discount });
        get().recalculateTotals();
      },

      removeCoupon: () => {
        set({ coupon: null, discount: 0 });
        get().recalculateTotals();
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);