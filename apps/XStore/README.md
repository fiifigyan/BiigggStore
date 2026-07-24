📱 XStore - E-Commerce Mobile Application
Complete e-commerce mobile app built with React Native & Expo for iOS and Android

https://img.shields.io/badge/Expo-56.0.0-000000.svg
https://img.shields.io/badge/React%2520Native-0.85.3-61DAFB.svg
https://img.shields.io/badge/TypeScript-5.3.0-3178C6.svg
https://img.shields.io/badge/React%2520Navigation-7.0.0-61DAFB.svg
https://img.shields.io/badge/TanStack%2520Query-5.0.0-FF4154.svg
https://img.shields.io/badge/Zustand-4.5.0-000000.svg

📖 Table of Contents
Overview

Features

Tech Stack

Quick Start

Project Structure

Architecture

Screens & Navigation

State Management

API Integration

Payment Integration

Environment Variables

Building & Deployment

Troubleshooting

📋 Overview
XStore is a fully-featured e-commerce mobile application that connects to the XBackbone API backend. It provides users with a seamless shopping experience including product discovery, cart management, secure checkout, and order tracking.

🎯 Key Features
User Experience
✅ Onboarding flow for new users

✅ User authentication (Register/Login)

✅ Password reset functionality

✅ Profile management with addresses

✅ Order history tracking

Shopping Features
✅ Product catalog with categories

✅ Advanced search with filters

✅ Product detail with zoomable images

✅ Featured products carousel

✅ Wishlist functionality

Cart & Checkout
✅ Add/remove items from cart

✅ Update quantities

✅ Apply discount codes

✅ Secure checkout with Paystack

✅ Order confirmation

Technical Features
✅ Offline support with persisted state

✅ Real-time data sync with TanStack Query

✅ Secure storage with Expo SecureStore

✅ Push notifications ready

✅ Deep linking support

🛠️ Tech Stack
Category	Technology	Version
Framework	Expo	56.0.0
UI Framework	React Native	0.85.3
Language	TypeScript	5.3.0
Navigation	React Navigation	7.0.0
State Management	Zustand	4.5.0
Server State	TanStack Query	5.0.0
HTTP Client	Axios	1.6.0
Storage	Expo SecureStore	13.0.0
Lists	Shopify FlashList	1.6.0
Payments	Paystack WebView	5.1.0
Gestures	React Native Gesture Handler	2.16.0
Animations	React Native Reanimated	3.10.0
🚀 Quick Start
Prerequisites
bash
# Verify Node.js version
node --version  # v18 or higher

# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for builds)
npm install -g eas-cli
Installation
bash
# 1. Clone/navigate to the project
cd ~/Desktop/BiigggStore/apps/XStore

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Update .env with your configuration
# EXPO_PUBLIC_API_URL=http://localhost:9000
# EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx

# 5. Start the development server
npx expo start
Development Commands
bash
# Start development server
npm start
# or
npx expo start

# Start on specific platforms
npm run android
npm run ios
npm run web

# Clear cache
npx expo start -c

# Build for production
npm run build:ios
npm run build:android
📁 Project Structure
text
XStore/
├── src/
│   ├── api/
│   │   ├── client.ts                # Axios HTTP client
│   │   ├── auth.ts                  # Auth API calls
│   │   ├── products.ts              # Product API calls
│   │   ├── cart.ts                  # Cart API calls
│   │   ├── orders.ts                # Order API calls
│   │   └── payment.ts               # Payment API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx               # Reusable button
│   │   │   ├── Input.tsx                # Reusable input
│   │   │   ├── Card.tsx                 # Reusable card
│   │   │   ├── CategoryCard.tsx         # Category display
│   │   │   └── ImageZoom.tsx            # Zoomable image
│   │   ├── product/
│   │   │   └── ProductCard.tsx          # Product item
│   │   └── payment/
│   │       └── PaystackPayment.tsx      # Payment modal
│   ├── config/
│   │   ├── env.ts                       # Environment config
│   │   └── constants.ts                 # App constants
│   ├── hooks/
│   │   ├── useAuth.ts                   # Auth hook
│   │   ├── useCart.ts                   # Cart hook
│   │   ├── useProducts.ts               # Products hook
│   │   ├── useOrders.ts                 # Orders hook
│   │   ├── useWishlist.ts               # Wishlist hook
│   │   └── useDebounce.ts               # Debounce hook
│   ├── navigation/
│   │   ├── RootNavigator.tsx            # Root navigation
│   │   ├── stacks/
│   │   │   ├── AuthStack.tsx            # Auth screens stack
│   │   │   └── MainStack.tsx            # Main app stack
│   │   └── tabs/
│   │       └── BottomTabs.tsx           # Bottom tab navigation
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── ResetPasswordScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── products/
│   │   │   ├── ProductListScreen.tsx
│   │   │   └── ProductDetailScreen.tsx
│   │   ├── cart/
│   │   │   └── CartScreen.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutScreen.tsx
│   │   │   └── OrderConfirmationScreen.tsx
│   │   ├── orders/
│   │   │   └── OrdersScreen.tsx
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx
│   │   ├── search/
│   │   │   └── SearchScreen.tsx
│   │   └── wishlist/
│   │       └── WishlistScreen.tsx
│   ├── store/
│   │   └── slices/
│   │       ├── auth.slice.ts            # Auth state
│   │       ├── cart.slice.ts            # Cart state
│   │       ├── wishlist.slice.ts        # Wishlist state
│   │       └── ui.slice.ts              # UI state
│   ├── utils/
│   │   ├── currency.ts                  # Currency formatting
│   │   ├── validators.ts                # Input validation
│   │   ├── storage.ts                   # Storage utilities
│   │   └── helpers.ts                   # Helper functions
│   ├── types/
│   │   └── index.ts                     # Type definitions
│   ├── App.tsx                          # Root component
│   └── index.ts                         # Entry point
├── assets/
│   ├── fonts/
│   ├── images/
│   └── animations/
├── app.json                              # Expo config
├── eas.json                              # EAS build config
├── babel.config.js
├── tsconfig.json
├── .env
└── package.json
🏗️ Architecture
Application Flow
text
┌─────────────────────────────────────────────────────────────┐
│                       XStore App                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Auth      │    │   Home     │    │  Products   │    │
│  │  Screens    │    │  Screen    │    │   Screen    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Cart      │    │  Checkout  │    │  Profile    │    │
│  │   Screen    │    │   Screen   │    │   Screen    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Zustand (Client State)                            │   │
│  │  ├── Auth: user, token, isAuthenticated           │   │
│  │  ├── Cart: items, total, quantity                 │   │
│  │  ├── Wishlist: saved items                        │   │
│  │  └── UI: theme, loading, modals                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TanStack Query (Server State)                     │   │
│  │  ├── Products: fetch, cache, pagination            │   │
│  │  ├── Orders: fetch, status tracking                │   │
│  │  └── User: profile, addresses                      │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Axios Client with Interceptors                    │   │
│  │  ├── Auth interceptor (JWT)                        │   │
│  │  ├── Error handling                                │   │
│  │  └── Request/Response logging                      │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  XBackbone API                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/auth                                        │   │
│  │  /api/products                                    │   │
│  │  /api/cart                                        │   │
│  │  /api/orders                                      │   │
│  │  /api/users                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
📱 Screens & Navigation
Navigation Structure
text
RootNavigator
├── Auth (if not authenticated)
│   ├── OnboardingScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   └── ResetPasswordScreen
│
└── Main (if authenticated)
    └── MainStack
        ├── BottomTabs (Tab Navigator)
        │   ├── Home (HomeScreen)
        │   ├── Products (ProductListScreen)
        │   ├── Cart (CartScreen)
        │   └── Profile (ProfileScreen)
        │
        ├── ProductDetailScreen (push)
        ├── CheckoutScreen (push)
        ├── OrderConfirmationScreen (push)
        ├── SearchScreen (modal)
        ├── OrdersScreen (push)
        └── WishlistScreen (push)
Screen Details
Screen	Description	Authentication
Onboarding	First-time user introduction	No
Login	User login with email/password	No
Register	New user registration	No
Forgot Password	Password reset request	No
Reset Password	Set new password	No
Home	Featured products, categories	Yes
Product List	Browse/filter products	Yes
Product Detail	Product info, images, add to cart	Yes
Cart	View/update cart items	Yes
Checkout	Address, payment, order review	Yes
Order Confirmation	Order success confirmation	Yes
Orders	Order history tracking	Yes
Profile	User profile, addresses, settings	Yes
Search	Search products with history	Yes
Wishlist	Saved favorite items	Yes
🗃️ State Management
Zustand Stores
Auth Store
typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
Cart Store
typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}
TanStack Query
typescript
// Example: Products Query
const { data, isLoading, refetch } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => productApi.getProducts(filters),
});

// Example: Infinite Scroll
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['products'],
  queryFn: ({ pageParam }) => productApi.getProducts({ offset: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextOffset,
});
📡 API Integration
HTTP Client Setup
typescript
// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
});

// Auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
API Services
typescript
// Auth API
export const authApi = {
  login: (email, password) => apiClient.post('/auth', { email, password }),
  register: (data) => apiClient.post('/customers', data),
  getMe: () => apiClient.get('/customers/me'),
};

// Products API
export const productApi = {
  getProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  search: (query) => apiClient.get('/products/search', { params: { q: query } }),
};
💳 Payment Integration
Paystack Integration
XStore uses Paystack for payment processing, supporting multiple payment methods including cards, bank transfers, USSD, and mobile money.

typescript
// PaystackPayment Component
import { Paystack } from 'react-native-paystack-webview';

<Paystack
  paystackKey={PAYSTACK_PUBLIC_KEY}
  amount={amount}
  billingEmail={email}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
  channels={['card', 'bank', 'ussd', 'mobile_money']}
/>
Payment Flow
text
1. User checks out
   └── Enter address & payment details

2. Initialize payment with backend
   └── POST /api/orders

3. Paystack WebView opens
   └── User completes payment

4. Payment confirmation
   └── Order status updates

5. Order confirmation screen
   └── User sees order summary
🌍 Environment Variables
env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:9000

# Paystack Configuration
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
EXPO_PUBLIC_CURRENCY=GHS
Environment Config
typescript
// src/config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl || 
           process.env.EXPO_PUBLIC_API_URL || 
           'http://localhost:9000',
  PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || 'GHS',
} as const;
🚀 Building & Deployment
EAS Build Configuration
json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
Build Commands
bash
# Development build (for testing)
eas build --platform android --profile development
eas build --platform ios --profile development

# Production build
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
App Store Configuration
json
// app.json
{
  "expo": {
    "name": "XStore",
    "slug": "xstore",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.biigggstore.xstore",
      "supportsTablet": true
    },
    "android": {
      "package": "com.biigggstore.xstore",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png"
      }
    }
  }
}
🐛 Troubleshooting
Common Issues & Solutions
Expo Start Fails with "fetch failed"
bash
# Skip dependency check
npx expo start --no-dependency-check

# Or clear cache
npx expo start -c
Paystack WebView Not Opening
bash
# Ensure react-native-webview is installed
npx expo install react-native-webview

# Rebuild the app
npx expo prebuild --clean
API Connection Refused
bash
# Check if backend is running
curl http://localhost:9000/health

# Update API URL in .env
EXPO_PUBLIC_API_URL=http://localhost:9000

# For physical device testing, use your computer's IP
# EXPO_PUBLIC_API_URL=http://192.168.1.100:9000
Storage Errors (MMKV)
bash
# XStore uses Expo SecureStore instead of MMKV
# If you see MMKV errors, ensure it's not imported anywhere
# SecureStore is already configured in the store files
Development Tips
Debugging Network Requests
typescript
// Enable logging in development
if (__DEV__) {
  apiClient.interceptors.request.use(request => {
    console.log('🚀 Request:', request.method, request.url);
    return request;
  });
}
Testing with Expo Go
bash
# Start with tunnel for physical device testing
npx expo start --tunnel

# Reset cache frequently during development
npx expo start -c
📱 Testing
Run Tests
bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
Manual Testing Checklist
Onboarding flow

Registration & Login

Product browsing (list, detail, categories)

Search functionality

Add to cart

Cart management (update, remove)

Checkout process

Payment (Paystack)

Order confirmation

Order history

Profile management

Address management

Wishlist

Logout

📊 Performance Optimizations
Implemented Optimizations
✅ FlashList for smooth scrolling

✅ Image caching with Expo Image

✅ Lazy loading for screens

✅ Memoization for expensive components

✅ Debounced search to reduce API calls

✅ Pagination for product lists

✅ Persisted state with SecureStore

Recommended Optimizations
typescript
// Use FlashList instead of FlatList
import { FlashList } from '@shopify/flash-list';

// Memoize components
const ProductCard = React.memo(({ product }) => {
  // ...
});

// Debounce search
const debouncedSearch = useDebounce(searchQuery, 500);
🔐 Security
Implemented Security Measures
✅ JWT Authentication for API calls

✅ Secure Storage for tokens (Expo SecureStore)

✅ Input Validation for forms

✅ HTTPS in production

✅ Environment variables for secrets

Security Best Practices
Never store sensitive data in AsyncStorage

Always use HTTPS in production

Validate all user inputs

Implement certificate pinning for production

Use biometric authentication for sensitive actions

📱 App Screenshots
Authentication Flow
text
Onboarding → Login → Register → Forgot Password → Reset Password
Main App Flow
text
Home → Products → Product Detail → Cart → Checkout → Order Confirmation
Profile Flow
text
Profile → Orders → Addresses → Edit Profile → Logout
📚 Additional Resources
Documentation Links
Expo Documentation

React Native Documentation

React Navigation Documentation

TanStack Query Documentation

Zustand Documentation

Paystack Documentation

📝 Changelog
v1.0.0 (2026-07-18)
Added
✅ Authentication (Login, Register, Forgot Password)

✅ Product browsing with categories

✅ Product search and filtering

✅ Shopping cart functionality

✅ Checkout with Paystack

✅ Order history tracking

✅ User profile management

✅ Address management

✅ Wishlist functionality

✅ Offline support with persisted state

✅ TypeScript support

✅ Expo SDK 56

Coming Soon
🔜 Push notifications

🔜 Product reviews

🔜 Dark mode

🔜 Multi-language support

🔜 Social login (Google, Facebook, Apple)

👨‍💻 Contributors
Christian Gyan - Initial development

📄 License
This project is private and proprietary.

Generated by: Senior Developer Documentation System
Last Updated: July 18, 2026
Version: 1.0.0