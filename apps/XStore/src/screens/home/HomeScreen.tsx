// apps/mobile/src/screens/home/HomeScreen.tsx
import React, { useState, type ComponentType } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView as RNScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { productApi } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';
import { CategoryCard } from '../../components/common/CategoryCard';

const ScrollView = RNScrollView as ComponentType<any>;
const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.getProducts({ limit: 10, is_featured: true }),
  });

  // Fetch new arrivals
  const { data: newArrivals } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => productApi.getProducts({ limit: 10, order: 'created_at:desc' }),
  });

  // Categories data
  const categories = [
    { id: 'all', name: 'All', icon: 'bag-handle-outline' },
    { id: 'clothes', name: 'Clothes', icon: 'shirt-outline' },
    { id: 'perfumes', name: 'Perfumes', icon: 'flask-outline' },
    { id: 'skin-care', name: 'Skin Care', icon: 'sparkles-outline' },
    { id: 'accessories', name: 'Accessories', icon: 'diamond-outline' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Ionicons name="hand-left-outline" size={20} color="#333" />
          </View>
          <Text style={styles.subGreeting}>Find your perfect style</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
      >
        <View style={styles.searchBarContent}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <Text style={styles.searchText}>Search for products...</Text>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              category={item}
              isSelected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Hero Banner */}
      <TouchableOpacity style={styles.heroBanner}>
        <View style={styles.heroTitleRow}>
          <Text style={styles.heroTitle}>Summer Sale</Text>
          <Ionicons name="flame-outline" size={24} color="#fff" />
        </View>
        <Text style={styles.heroSubtitle}>Up to 50% off selected items</Text>
        <Text style={styles.heroButton}>Shop Now →</Text>
      </TouchableOpacity>

      {/* Featured Products */}
      {!isLoading && featuredProducts && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <Ionicons name="sparkles-outline" size={18} color="#333" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          >
            {featuredProducts.products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* New Arrivals */}
      {newArrivals && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <Ionicons name="sparkles-outline" size={18} color="#333" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          >
            {newArrivals.products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
  },
  searchBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchText: {
    color: '#999',
    fontSize: 16,
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  heroBanner: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 16,
    marginBottom: 20,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  heroButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
  },
  productsList: {
    paddingHorizontal: 20,
  },
});