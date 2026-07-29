// apps/mobile/src/screens/home/HomeScreen.tsx
import React, { useState, useCallback, type ComponentType } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView as RNScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productApi } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';
import { CategoryCard } from '../../components/common/CategoryCard';

const { width } = Dimensions.get('window');
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
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'clothes', name: 'Clothes', icon: 'shirt-outline' },
    { id: 'perfumes', name: 'Perfumes', icon: 'flask-outline' },
    { id: 'skin-care', name: 'Skin Care', icon: 'sparkles-outline' },
    { id: 'accessories', name: 'Accessories', icon: 'diamond-outline' },
  ];

  const renderHeroBanner = () => (
    <LinearGradient
      colors={['#1EB589', '#178FF5']}
      style={styles.heroGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.heroContent}>
        <View style={styles.heroBadge}>
          <Ionicons name="flash-outline" size={14} color="#FFFFFF" />
          <Text style={styles.heroBadgeText}>Limited Drop</Text>
        </View>
        <Text style={styles.heroTitle}>Premium Picks</Text>
        <Text style={styles.heroSubtitle}>Curated essentials for the modern lifestyle</Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Explore Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#1EB589" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.subGreeting}>Discover your next favorite</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Profile')}>
          <LinearGradient
            colors={['#1EB589', '#178FF5']}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person-outline" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search-outline" size={20} color="#333A55" />
        <Text style={styles.searchText}>Search for products...</Text>
        <Ionicons name="options-outline" size={18} color="#333A55" style={styles.searchIconRight} />
      </TouchableOpacity>

      {/* Hero Banner */}
      {renderHeroBanner()}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
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

      {/* Featured Products */}
      {!isFeaturedLoading && featuredProducts && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsList}>
            {featuredProducts.products.map((item: any) => (
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
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsList}>
            {newArrivals.products.map((item: any) => (
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1F29',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#333A55',
    opacity: 0.7,
    marginTop: 2,
  },
  avatarButton: {
    padding: 2,
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1EB589',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#333A55',
    marginLeft: 10,
    opacity: 0.6,
  },
  searchIconRight: {
    marginLeft: 8,
  },
  heroGradient: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#1EB589',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    marginTop: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1F29',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    color: '#1EB589',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  productsList: {
    paddingHorizontal: 20,
  },
});