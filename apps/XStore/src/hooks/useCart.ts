// apps/mobile/src/hooks/useCart.ts
import { useCartStore } from '../store/slices/cart.slice';
import { cartApi } from '../api/cart';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const useCart = () => {
  const { 
    items, 
    totalPrice, 
    totalItems,
    cartId,
    setCartId,
    addItem: addItemStore,
    updateQuantity: updateQuantityStore,
    removeItem: removeItemStore,
    clearCart: clearCartStore,
    recalculateTotals,
  } = useCartStore();

  const { user, isAuthenticated } = useAuth();

  // Get cart query
  const { data: cartData, refetch: refetchCart } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => cartApi.getCart(),
    enabled: !!cartId,
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: (data) => {
      // Update local store
      // We'll sync with server state
    },
    onError: (error: any) => {
      // Global interceptor handles 401; surface other errors locally
      console.error('addItemMutation error:', error);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) =>
      cartApi.updateItemQuantity(lineItemId, quantity),
    onError: (error: any) => {
      console.error('updateQuantityMutation error:', error);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (lineItemId: string) =>
      cartApi.removeItem(lineItemId),
    onError: (error: any) => {
      console.error('removeItemMutation error:', error);
    },
  });

  // Initialize cart
  const initializeCart = async () => {
    if (isAuthenticated && !cartId) {
      try {
        const response = await cartApi.getCart();
        if (response?.cart?.id) {
          setCartId(response.cart.id);
        }
      } catch (error) {
        console.error('Failed to initialize cart:', error);
      }
    }
  };

  // Sync local cart with server
  const syncCart = async () => {
    if (cartId) {
      try {
        const data = await cartApi.getCart();
        // Update local store with server data
        // This is a simplified version - you'll want to handle conflicts
        return data;
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  };

  // Add item with automatic cart creation
  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!cartId) {
      await initializeCart();
    }
    
    if (cartId) {
      try {
        await addItemMutation.mutateAsync({ variantId, quantity });
        await refetchCart();
      } catch (error) {
        console.error('Failed to add item:', error);
        throw error;
      }
    }
  };

  // Update quantity
  const updateQuantity = async (lineItemId: string, quantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({ lineItemId, quantity });
      await refetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };

  // Remove item
  const removeItem = async (lineItemId: string) => {
    try {
      await removeItemMutation.mutateAsync(lineItemId);
      await refetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // Remove all items one by one
      for (const item of items) {
        await cartApi.removeItem(item.id);
      }
      clearCartStore();
      await refetchCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  // Load cart on auth change
  useEffect(() => {
    if (isAuthenticated) {
      initializeCart();
    }
  }, [isAuthenticated]);

  // Sync cart when it changes
  useEffect(() => {
    if (cartId) {
      syncCart();
    }
  }, [cartId]);

  return {
    items,
    totalPrice,
    totalItems,
    cartId,
    isLoading: addItemMutation.isPending,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,
    refetchCart,
    cartData,
  };
};