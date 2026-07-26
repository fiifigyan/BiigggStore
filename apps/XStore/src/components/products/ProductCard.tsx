// apps/mobile/src/components/product/ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrencyShort } from '../../utils/currency';
import { useWishlistStore } from '../../store/slices/wishlist.slice';

const { width } = Dimensions.get('window');
const cardWidth = (width - 56) / 2;

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images?: { url: string }[];
    variants?: any[];
  };
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const price = product.variants?.[0]?.prices?.[0]?.amount || product.price || 0;
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x300';

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem({
        id: product.id,
        title: product.title,
        price,
        images: product.images,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={isWishlisted ? '#ff3b30' : '#64748b'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatCurrencyShort(price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: cardWidth,
    backgroundColor: '#f8fafc',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 6,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4f46e5',
  },
});