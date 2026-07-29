import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const VouchersScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const vouchers = [
    { id: 'welcome', code: 'WELCOME10', title: 'Welcome discount', detail: '10% off your first order', expires: 'Valid until 31 Aug' },
    { id: 'summer', code: 'SUMMER20', title: 'Summer offer', detail: '20% off skincare items', expires: 'Valid until 30 Sep' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Ionicons name="pricetag-outline" size={28} color="#007AFF" />
        <Text style={styles.title}>Vouchers</Text>
      </View>
      <Text style={styles.subtitle}>Use your active discounts at checkout.</Text>

      <View style={styles.card}>
        {vouchers.map((voucher) => (
          <View key={voucher.id} style={styles.voucherItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.voucherCode}>{voucher.code}</Text>
              <Text style={styles.voucherTitle}>{voucher.title}</Text>
              <Text style={styles.voucherDetail}>{voucher.detail}</Text>
            </View>
            <Text style={styles.voucherExpiry}>{voucher.expires}</Text>
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
  voucherItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  voucherCode: { fontSize: 14, fontWeight: '700', color: '#007AFF' },
  voucherTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 },
  voucherDetail: { color: '#6b7280', marginTop: 2 },
  voucherExpiry: { color: '#6b7280', fontSize: 12, marginLeft: 8 },
  secondaryButton: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  secondaryButtonText: { color: '#111827', fontWeight: '700' },
});
