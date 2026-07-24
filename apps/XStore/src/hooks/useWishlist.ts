// apps/mobile/src/hooks/useWishlist.ts
import { useWishlistStore } from '../store/slices/wishlist.slice';
import { useAuth } from './useAuth';
import { Alert } from 'react-native';

export const useWishlist = () => {
  const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuth();

  const toggleWishlist = (product: any) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to save items to your wishlist',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation?.navigate('Auth') },
        ]
      );
      return false;
    }

    if (isInWishlist(product.id)) {
      removeItem(product.id);
      return false;
    } else {
      addItem(product);
      return true;
    }
  };

  return {
    items,
    addItem,
    removeItem,
    isInWishlist,
    toggleWishlist,
    count: items.length,
  };
};