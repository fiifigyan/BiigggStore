import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const OrderDetailsScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const orderId = route?.params?.orderId;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={32} color="#007AFF" />
        <Text style={styles.title}>Order Details</Text>
      </View>
      <Text style={styles.subtitle}>Order ID: {orderId ?? 'Unknown'}</Text>
      <Text style={styles.bodyText}>Order details are not yet implemented. Please check back later.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginLeft: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
