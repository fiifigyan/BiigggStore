// apps/mobile/src/navigation/stacks/MainStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../screens/home/HomeScreen';
import { CartScreen } from '../../screens/cart/CartScreen';
import { ProfileScreen } from '../../screens/profile/ProfileScreen';
import { NotificationsScreen } from '../../screens/notifications/NotificationsScreen';
import { ProductListScreen } from '../../screens/products/ProductListScreen';
import { ProductDetailScreen } from '../../screens/products/ProductDetailScreen';
import { CheckoutScreen } from '../../screens/checkout/CheckoutScreen';
import { OrderConfirmationScreen } from '../../screens/checkout/OrderConfirmationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

