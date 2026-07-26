// apps/mobile/src/components/product/FilterModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
  onApply: (filters: any) => void;
}

const sortOptions = [
  { id: 'created_at:desc', label: 'Newest first' },
  { id: 'created_at:asc', label: 'Oldest first' },
  { id: 'price:asc', label: 'Price: low to high' },
  { id: 'price:desc', label: 'Price: high to low' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters: initialFilters,
  onApply,
}) => {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'created_at:desc',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort by</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.option}
                  onPress={() => setFilters({ ...filters, sort: option.id })}
                >
                  <View style={styles.radioCircle}>
                    {filters.sort === option.id && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price range</Text>
              <View style={styles.priceContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  placeholderTextColor="#94a3b8"
                  value={filters.minPrice}
                  onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  placeholderTextColor="#94a3b8"
                  value={filters.maxPrice}
                  onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4f46e5',
  },
  optionLabel: {
    fontSize: 14,
    color: '#334155',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  priceSeparator: {
    marginHorizontal: 10,
    color: '#64748b',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});