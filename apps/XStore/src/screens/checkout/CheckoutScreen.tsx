// apps/mobile/src/screens/checkout/CheckoutScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/slices/cart.slice';
import { useAuthStore } from '../../store/slices/auth.slice';
import { PaystackPayment } from '../../components/payment/PaystackPayment';
import { paymentApi } from '../../api/payment';
import { formatCurrencyShort } from '../../utils/currency';

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, totalPrice, cartId } = useCartStore();
  const { user } = useAuthStore();
  
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState({
    address_1: '',
    city: '',
    country_code: 'NG',
    postal_code: '',
    phone: '',
  });

  const handleInitiatePayment = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!address.address_1 || !address.city) {
      Alert.alert('Error', 'Please fill in your shipping address');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize payment session with Paystack
      await paymentApi.initiatePayment(cartId);
      
      // Show Paystack payment modal
      setShowPayment(true);
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      // Let the global interceptor handle 401/refresh; surface other errors
      Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (order: any) => {
    Alert.alert(
      'Payment Successful!',
      `Your order #${order.display_id} has been confirmed.`,
      [
        {
          text: 'View Order',
          onPress: () => navigation.navigate('OrderDetails', { orderId: order.id }),
        },
        {
          text: 'Continue Shopping',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const handlePaymentError = (error: any) => {
    Alert.alert('Payment Failed', 'There was an issue processing your payment. Please try again.');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Ionicons name="cart-outline" size={48} color="#007AFF" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Checkout</Text>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.product.title}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatCurrencyShort(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrencyShort(totalPrice)}
            </Text>
          </View>
        </View>

        {/* Customer Email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address Line 1"
            value={address.address_1}
            onChangeText={(text) => setAddress({ ...address, address_1: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={address.postal_code}
            onChangeText={(text) => setAddress({ ...address, postal_code: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={address.phone}
            onChangeText={(text) => setAddress({ ...address, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleInitiatePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay {formatCurrencyShort(totalPrice)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Paystack Payment Modal */}
      <PaystackPayment
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        amount={totalPrice}
        email={email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  shopButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});