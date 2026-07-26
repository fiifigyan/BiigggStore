// apps/mobile/src/screens/products/ProductDetailScreen.tsx
import React, { useState } from 'react';
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
import { useCartStore } from '../../store/slices/cart.slice';
import { useAuthStore } from '../../store/slices/auth.slice';
import { ImageZoom } from '../../components/common/ImageZoom';
import { formatGHPriceShort } from '../../utils/currency';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { cartId } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProduct(productId),
  });

  const addToCartMutation = useMutation({
    mutationFn: (params: any) =>
      cartApi.addItem(cartId, params.variantId, params.quantity),
    onSuccess: () => {
      Alert.alert('Success', 'Item added to cart!');
    },
    onError: (error) => {
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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert('Please select a variant');
      return;
    }

    if (!user) {
      Alert.alert('Please login to add items to cart');
      navigation.navigate('Auth');
      return;
    }

    addToCartMutation.mutate({
      variantId: selectedVariant.id,
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
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="heart-outline" size={20} color="#111827" />
            </TouchableOpacity>
          </View>
          <ImageZoom source={{ uri: product.images?.[currentImageIndex]?.url }} style={styles.mainImage} />
          {product.images && product.images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsContainer}>
              {product.images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => setCurrentImageIndex(index)}>
                  <Image
                    source={{ uri: image.url }}
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
          <Text style={styles.subtitle}>{product.subtitle}</Text>

          <Text style={styles.description}>{product.description}</Text>

          {product.variants && (
            <View style={styles.variantsContainer}>
              <Text style={styles.variantTitle}>Choose a variant</Text>
              <View style={styles.variantOptions}>
                {product.variants.map((variant) => (
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
                    <Text style={styles.variantPrice}>{formatGHPriceShort(variant.prices[0].amount)}</Text>
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
        <TouchableOpacity style={styles.wishlistButton} onPress={() => {}}>
          <Ionicons name="heart-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={addToCartMutation.isPending}>
          {addToCartMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>Add to cart • {formatGHPriceShort(selectedVariant ? selectedVariant.prices[0].amount * quantity : 0)}</Text>
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