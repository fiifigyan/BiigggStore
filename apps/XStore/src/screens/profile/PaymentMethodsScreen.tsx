import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const PaymentMethodsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const methods = [
    { id: 'paystack', label: 'Paystack', detail: 'Card, bank transfer and mobile money', icon: 'card-outline' },
    { id: 'cash', label: 'Cash on delivery', detail: 'Pay when your order arrives', icon: 'cash-outline' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Ionicons name="card-outline" size={28} color="#007AFF" />
        <Text style={styles.title}>Payment methods</Text>
      </View>
      <Text style={styles.subtitle}>Choose how you want to pay for future orders.</Text>

      <View style={styles.card}>
        {methods.map((method) => (
          <View key={method.id} style={styles.methodItem}>
            <View style={styles.methodIcon}><Ionicons name={method.icon as any} size={20} color="#007AFF" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>{method.label}</Text>
              <Text style={styles.methodDetail}>{method.detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryButtonText}>Back to Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { marginLeft: 10, fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 12 },
  methodItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  methodIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  methodTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  methodDetail: { color: '#6b7280', marginTop: 2 },
  secondaryButton: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  secondaryButtonText: { color: '#111827', fontWeight: '700' },
});
