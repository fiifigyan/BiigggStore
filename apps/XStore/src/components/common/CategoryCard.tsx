// apps/mobile/src/components/common/CategoryCard.tsx
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
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.iconContainer,
        isSelected && styles.selectedIconContainer,
      ]}>
        <Ionicons
          name={category.icon as any}
          size={20}
          color={isSelected ? '#FFFFFF' : '#333A55'}
        />
      </View>
      <Text style={[
        styles.name,
        isSelected && styles.selectedName,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    minWidth: 76,
  },
  selectedContainer: {
    backgroundColor: '#1EB589',
    borderColor: '#1EB589',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  name: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333A55',
    letterSpacing: 0.2,
  },
  selectedName: {
    color: '#FFFFFF',
  },
});