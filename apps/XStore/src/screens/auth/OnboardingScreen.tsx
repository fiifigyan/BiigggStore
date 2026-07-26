// apps/mobile/src/screens/auth/OnboardingScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  color: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Discover premium essentials',
    description: 'Browse curated fashion, skincare, and fragrance picks chosen for quality and style.',
    image: require('../../../assets/images/products-img.jpg'),
    color: '#4f46e5',
  },
  {
    id: '2',
    title: 'Shop with confidence',
    description: 'Every product is vetted for authenticity so your experience feels premium from start to finish.',
    image: require('../../../assets/images/quality-img.jpg'),
    color: '#2563eb',
  },
  {
    id: '3',
    title: 'Fast, secure checkout',
    description: 'Enjoy a smooth journey from discovery to delivery with trusted payment options.',
    image: require('../../../assets/images/checkout-img.jpg'),
    color: '#f59e0b',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.imageContainer, { backgroundColor: `${item.color}18` }]}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient colors={['#f8faff', '#eef2ff']} style={styles.container}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
            <LinearGradient
              colors={['#4f46e5', '#2563eb']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 58,
    right: 24,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  skipText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  imageContainer: {
    width: 240,
    height: 240,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#4f46e5',
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});