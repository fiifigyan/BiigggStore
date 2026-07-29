import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../../api/users';

export const AddressesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'GH',
    postalCode: '',
    isDefault: true,
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAddresses();
      setAddresses(response?.addresses || []);
    } catch (error) {
      console.error('Failed to load addresses', error);
      Alert.alert('Error', 'Unable to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setEditingAddressId(null);
    setAddressForm({ address1: '', address2: '', city: '', state: '', country: 'GH', postalCode: '', isDefault: true });
  };

  const handleSubmitAddress = async () => {
    if (!addressForm.address1 || !addressForm.city || !addressForm.postalCode) {
      Alert.alert('Missing fields', 'Please fill in the address line, city and postal code.');
      return;
    }

    try {
      if (editingAddressId) {
        await userApi.updateAddress(editingAddressId, {
          address1: addressForm.address1,
          address2: addressForm.address2,
          city: addressForm.city,
          state: addressForm.state,
          country: addressForm.country,
          postalCode: addressForm.postalCode,
          isDefault: addressForm.isDefault,
        });
        Alert.alert('Success', 'Address updated.');
      } else {
        await userApi.addAddress({
          address1: addressForm.address1,
          address2: addressForm.address2,
          city: addressForm.city,
          state: addressForm.state,
          country: addressForm.country,
          postalCode: addressForm.postalCode,
          isDefault: addressForm.isDefault,
        });
        Alert.alert('Success', 'Address saved.');
      }

      resetForm();
      await loadAddresses();
    } catch (error) {
      console.error('Failed to save address', error);
      Alert.alert('Error', 'Unable to save address.');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setAddressForm({
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'GH',
      postalCode: address.postalCode || '',
      isDefault: Boolean(address.isDefault),
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert('Delete address', 'Remove this saved address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await userApi.deleteAddress(addressId);
            await loadAddresses();
            if (editingAddressId === addressId) {
              resetForm();
            }
          } catch (error) {
            console.error('Failed to delete address', error);
            Alert.alert('Error', 'Unable to delete address.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Ionicons name="location-outline" size={28} color="#007AFF" />
        <Text style={styles.title}>Addresses</Text>
      </View>
      <Text style={styles.subtitle}>Manage the places you ship to.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>{editingAddressId ? 'Edit address' : 'Add a new address'}</Text>
          {editingAddressId ? (
            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TextInput style={styles.input} placeholder="Address line 1" value={addressForm.address1} onChangeText={(text) => setAddressForm({ ...addressForm, address1: text })} />
        <TextInput style={styles.input} placeholder="Address line 2 (optional)" value={addressForm.address2} onChangeText={(text) => setAddressForm({ ...addressForm, address2: text })} />
        <TextInput style={styles.input} placeholder="City" value={addressForm.city} onChangeText={(text) => setAddressForm({ ...addressForm, city: text })} />
        <TextInput style={styles.input} placeholder="State" value={addressForm.state} onChangeText={(text) => setAddressForm({ ...addressForm, state: text })} />
        <TextInput style={styles.input} placeholder="Country" value={addressForm.country} onChangeText={(text) => setAddressForm({ ...addressForm, country: text })} />
        <TextInput style={styles.input} placeholder="Postal code" value={addressForm.postalCode} onChangeText={(text) => setAddressForm({ ...addressForm, postalCode: text })} />
        <TouchableOpacity style={styles.button} onPress={handleSubmitAddress}>
          <Text style={styles.buttonText}>{editingAddressId ? 'Update address' : 'Save address'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved addresses</Text>
        {loading ? <ActivityIndicator color="#007AFF" /> : addresses.length === 0 ? (
          <Text style={styles.emptyText}>No addresses saved yet.</Text>
        ) : addresses.map((address: any) => (
          <View key={address.id} style={styles.addressItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressHeadline}>{address.address1}</Text>
              <Text style={styles.addressMeta}>{[address.address2, address.city, address.state, address.country].filter(Boolean).join(', ')}</Text>
              <Text style={styles.addressMeta}>Postal code: {address.postalCode}</Text>
            </View>
            <View style={styles.addressActions}>
              {address.isDefault ? <View style={styles.badge}><Text style={styles.badgeText}>Default</Text></View> : null}
              <TouchableOpacity onPress={() => handleEditAddress(address)} style={styles.iconButton}>
                <Ionicons name="create-outline" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAddress(address.id)} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cancelText: { color: '#007AFF', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  button: { backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  secondaryButtonText: { color: '#111827', fontWeight: '700' },
  emptyText: { color: '#6b7280', fontSize: 14 },
  addressItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  addressActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconButton: { padding: 6 },
  addressHeadline: { fontWeight: '700', color: '#111827' },
  addressMeta: { color: '#6b7280', marginTop: 2 },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#1d4ed8', fontSize: 12, fontWeight: '700' },
});
