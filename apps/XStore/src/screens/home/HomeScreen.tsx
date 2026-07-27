// apps/mobile/src/screens/home/HomeScreen.tsx
import React, { useState, useCallback, type ComponentType } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView as RNScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useAuthStore } from '../../store/slices/auth.slice';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productApi } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';
import { CategoryCard } from '../../components/common/CategoryCard';

const ScrollView = RNScrollView as ComponentType<any>;

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [refreshing, setRefreshing] = useState(false);

  const { data: featuredProducts, isLoading: isFeaturedLoading, refetch: refetchFeatured } = useQuery({
    queryKey: ['products', 'featured', selectedCategory],
    queryFn: () =>
      productApi.getProducts({
        limit: 10,
        is_featured: true,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      }),
  });

  const { data: newArrivals, refetch: refetchNewArrivals } = useQuery({
    queryKey: ['products', 'new', selectedCategory],
    queryFn: () =>
      productApi.getProducts({
        limit: 10,
        order: 'created_at:desc',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      }),
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchNewArrivals()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchNewArrivals]);

  const categories = [
    { id: 'all', name: 'All', icon: 'bag-handle-outline' },
    { id: 'clothes', name: 'Clothes', icon: 'shirt-outline' },
    { id: 'perfumes', name: 'Perfumes', icon: 'flask-outline' },
    { id: 'skin-care', name: 'Skin Care', icon: 'sparkles-outline' },
    { id: 'accessories', name: 'Accessories', icon: 'diamond-outline' },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4f46e5" />
      }
    >
      <LinearGradient colors={['#eef2ff', '#f8faff']} style={styles.headerWrap}>
        <View style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Welcome back</Text>
              <Ionicons name="hand-left-outline" size={18} color="#4f46e5" />
            </View>
            <Text style={styles.subGreeting}>Find your next favorite pick</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <View style={styles.searchBarContent}>
            <Ionicons name="search-outline" size={18} color="#64748b" />
            <Text style={styles.searchText}>Search for products...</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
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

      <TouchableOpacity style={styles.heroBanner} activeOpacity={0.9}>
        <LinearGradient
          colors={['#4f46e5', '#2563eb']}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>Midnight deals</Text>
            <Ionicons name="flame-outline" size={22} color="#fff" />
          </View>
          <Text style={styles.heroSubtitle}>Up to 50% off curated essentials for your next refresh.</Text>
          <View style={styles.heroFooter}>
            <Text style={styles.heroButton}>Shop now</Text>
            <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {!isFeaturedLoading && featuredProducts && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Featured picks</Text>
              <Ionicons name="sparkles-outline" size={16} color="#4f46e5" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsList}>
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

      {newArrivals && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>New arrivals</Text>
              <Ionicons name="rocket-outline" size={16} color="#4f46e5" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsList}>
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
    backgroundColor: '#f8fafc',
  },
  headerWrap: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  profileButton: {
    padding: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchText: {
    color: '#64748b',
    fontSize: 15,
  },
  categoriesContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  heroGradient: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    lineHeight: 20,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  heroButton: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    marginTop: 18,
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
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: 20,
  },
});