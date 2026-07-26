// apps/mobile/src/screens/cart/CartScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../store/slices/cart.slice';
import { useAuthStore } from '../../store/slices/auth.slice';
import { formatCurrencyShort } from '../../utils/currency';

export const CartScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = () => {
    if (!user) {
      Alert.alert('Please login', 'You need to be logged in to checkout');
      navigation.navigate('Auth');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top }]}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cart-outline" size={56} color="#4f46e5" />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add a few favorites and we’ll keep them ready for you.</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.shopButtonText}>Start shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#eef2ff', '#f8fafc']} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your cart</Text>
          <Text style={styles.headerCount}>{totalItems} items ready to checkout</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.product.images?.[0]?.url || 'https://via.placeholder.com/80' }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.title}</Text>
              <Text style={styles.itemVariant}>{item.variantTitle}</Text>
              <Text style={styles.itemPrice}>{formatCurrencyShort(item.product.price * item.quantity)}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                Alert.alert('Remove item', 'Are you sure you want to remove this item?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
                ]);
              }}
            >
              <Ionicons name="close" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}> 
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryPrice}>{formatCurrencyShort(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  headerCount: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 10,
    minWidth: 16,
    textAlign: 'center',
  },
  removeButton: {
    padding: 6,
  },
  bottomBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  checkoutButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});