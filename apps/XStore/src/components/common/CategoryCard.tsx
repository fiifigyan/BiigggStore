// apps/XStore/src/components/common/CategoryCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
  };
  isSelected?: boolean;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
        <Ionicons name={category.icon as any} size={18} color={isSelected ? '#4f46e5' : '#64748b'} />
      </View>
      <Text style={[styles.name, isSelected && styles.selectedName]}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    minWidth: 84,
  },
  selectedContainer: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedIconContainer: {
    backgroundColor: '#e0e7ff',
  },
  name: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedName: {
    color: '#4f46e5',
  },
});