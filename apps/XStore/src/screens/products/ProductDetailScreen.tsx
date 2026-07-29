// apps/mobile/src/screens/products/ProductDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productApi } from '../../api/products';
import { cartApi } from '../../api/cart';
import { useAuthStore } from '../../store/slices/auth.slice';
import { useWishlistStore } from '../../store/slices/wishlist.slice';
import { useCartStore } from '../../store/slices/cart.slice';
import { ImageZoom } from '../../components/common/ImageZoom';
import { formatCurrencyShort } from '../../utils/currency';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();
  const { addItem: addCartItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        id: product.id,
        title: product.title,
        price: product.price || 0,
        images: wishlistImages,
      });
    }
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProduct(productId),
  });

  const wishlistImages = product?.images?.map((image: string | { url?: string }) =>
    typeof image === 'string' ? { url: image } : image
  );

  const getImageUrl = (images?: Array<{ url?: string } | string>, index = 0) => {
    const image = images?.[index];
    if (!image) return 'https://via.placeholder.com/300x300';
    return typeof image === 'string' ? image : image?.url || 'https://via.placeholder.com/300x300';
  };

  useEffect(() => {
    if (product?.variants?.length && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const addToCartMutation = useMutation({
    mutationFn: (params: any) => cartApi.addItem(params.productId, params.quantity),
    onSuccess: async (_data, variables) => {
      addCartItem({
        id: `${variables.productId}-${selectedVariant?.id || 'default'}`,
        variantId: selectedVariant?.id || variables.productId,
        variantTitle: selectedVariant?.title || 'Default',
        quantity: variables.quantity,
        product: {
          id: product.id,
          title: product.title,
          price: selectedVariant?.prices?.[0]?.amount || product.price || 0,
          images: product.images?.map((image: string | { url?: string }) =>
            typeof image === 'string' ? { url: image } : { url: image?.url || '' }
          ),
        },
      });
      Alert.alert('Success', 'Item added to cart!');
    },
    onError: (error: any) => {
      // Let the global apiClient interceptor handle 401/refresh.
      Alert.alert('Error', 'Failed to add to cart. Please try again.');
      console.error('Add to cart error:', error);
    },
  });

  if (isLoading || !product) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  const selectedPrice = selectedVariant?.prices?.[0]?.amount || product.price || 0;

  const handleAddToCart = () => {
    if (!user) {
      Alert.alert('Please login to add items to cart');
      navigation.navigate('Auth');
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <LinearGradient colors={['#eef2ff', '#f8fafc']} style={styles.imageGlow} />
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleWishlist}
            >
              <Ionicons
                name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={isInWishlist(product.id) ? '#ef4444' : '#111827'}
              />
            </TouchableOpacity>
          </View>
          <ImageZoom source={{ uri: getImageUrl(product.images, currentImageIndex) }} style={styles.mainImage} />
          {product.images && product.images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsContainer}>
              {product.images.map((image: string | { url?: string }, index: number) => (
                <TouchableOpacity key={index} onPress={() => setCurrentImageIndex(index)}>
                  <Image
                    source={{ uri: typeof image === 'string' ? image : image?.url || 'https://via.placeholder.com/300x300' }}
                    style={[styles.thumbnail, currentImageIndex === index && styles.activeThumbnail]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Featured</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.rating}>4.8</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatCurrencyShort(product.price || 0)}</Text>
          <Text style={styles.subtitle}>{product.subtitle || product.category || ''}</Text>

          <Text style={styles.description}>{product.description || 'No description available.'}</Text>

          {product.variants && (
            <View style={styles.variantsContainer}>
              <Text style={styles.variantTitle}>Choose a variant</Text>
              <View style={styles.variantOptions}>
                {product.variants.map((variant: any) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantOption,
                      selectedVariant?.id === variant.id && styles.selectedVariant,
                    ]}
                    onPress={() => setSelectedVariant(variant)}
                  >
                    <Text style={[styles.variantText, selectedVariant?.id === variant.id && styles.selectedVariantText]}>
                      {variant.title}
                    </Text>
                    <Text style={styles.variantPrice}>{formatCurrencyShort(variant.prices[0].amount)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}> 
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={toggleWishlist}
        >
          <Ionicons
            name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={isInWishlist(product.id) ? '#ef4444' : '#4f46e5'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={addToCartMutation.isPending}>
          {addToCartMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>Add to cart • {formatCurrencyShort(selectedPrice * quantity)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: 12,
  },
  imageGlow: {
    position: 'absolute',
    inset: 0,
  },
  topActions: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: width * 0.95,
    resizeMode: 'cover',
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  infoContainer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338ca',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 18,
  },
  variantsContainer: {
    marginBottom: 18,
  },
  variantTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  variantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  variantOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  selectedVariant: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  variantText: {
    fontSize: 13,
    color: '#334155',
  },
  selectedVariantText: {
    color: '#4338ca',
    fontWeight: '700',
  },
  variantPrice: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#111827',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  wishlistButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});