// apps/XStore/src/components/common/CategoryCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
        <Ionicons
          name={category.icon as any}
          size={24}
          color={isSelected ? '#007AFF' : '#666'}
        />
      </View>
      <Text style={[styles.name, isSelected && styles.selectedName]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedIconContainer: {
    backgroundColor: '#007AFF15',
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedName: {
    color: '#007AFF',
    fontWeight: '600',
  },
});