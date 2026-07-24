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
const cardWidth = (width - 45) / 2;

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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? '#ff3b30' : '#666'}
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
    marginHorizontal: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: cardWidth,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 6,
  },
  wishlistIcon: {
    fontSize: 18,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});