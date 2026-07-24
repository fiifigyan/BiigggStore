// apps/XStore/src/components/payment/PaystackPayment.tsx
import React, { useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { useCartStore } from '../../store/slices/cart.slice';
import { paymentApi } from '../../api/payment';
import { useNavigation } from '@react-navigation/native';

interface PaystackPaymentProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (transaction: any) => void;
  onError: (error: any) => void;
  amount: number;
  email: string;
}

export const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  visible,
  onClose,
  onSuccess,
  onError,
  amount,
  email,
}) => {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  const { clearCart } = useCartStore();
  const navigation = useNavigation();

  const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Complete the order in Medusa
      const order = await paymentApi.completeOrder(useCartStore.getState().cartId);
      
      // Clear cart locally
      clearCart();
      
      // Call success callback
      onSuccess(order);
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', { order });
    } catch (error) {
      console.error('Order completion failed:', error);
      onError(error);
    }
    onClose();
  };

  const handlePaymentCancel = (error: any) => {
    console.log('Payment cancelled:', error);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    onError(error);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.paymentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pay with Paystack</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Payment Amount Display */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>
              ₵{(amount / 100).toFixed(2)}
            </Text>
          </View>

          {/* Paystack WebView */}
          <View style={styles.webviewContainer}>
            <Paystack
              ref={paystackWebViewRef}
              paystackKey={PAYSTACK_PUBLIC_KEY}
              amount={(amount / 100).toString()}
              billingEmail={email}
              billingName="Customer"
              billingMobile="08012345678"
              activityIndicatorColor="#007AFF"
              onCancel={handlePaymentCancel}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              autoStart={true}
              channels={['card', 'bank', 'ussd', 'mobile_money', 'qr']}
              refNumber={`REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Secured by Paystack
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '95%',
    height: '85%',
    overflow: 'hidden',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  webviewContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});