// apps/mobile/src/navigation/stacks/MainStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../../screens/home/HomeScreen';
import { CartScreen } from '../../screens/cart/CartScreen';
import { ProfileScreen } from '../../screens/profile/ProfileScreen';
import { NotificationsScreen } from '../../screens/notifications/NotificationsScreen';
import { ProductListScreen } from '../../screens/products/ProductListScreen';
import { ProductDetailScreen } from '../../screens/products/ProductDetailScreen';
import { CheckoutScreen } from '../../screens/checkout/CheckoutScreen';
import { OrderConfirmationScreen } from '../../screens/checkout/OrderConfirmationScreen';
import { OrdersScreen } from '../../screens/orders/OrdersScreen';
import { OrderDetailsScreen } from '../../screens/orders/OrderDetailsScreen';
import { AddressesScreen } from '../../screens/profile/AddressesScreen';
import { PaymentMethodsScreen } from '../../screens/profile/PaymentMethodsScreen';
import { VouchersScreen } from '../../screens/profile/VouchersScreen';
import { useCartStore } from '../../store/slices/cart.slice';
import { useNotifications } from '../../hooks/useNotifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const { items: cartItems } = useCartStore();
  const { notifications } = useNotifications();
  const unreadCount = (notifications || []).filter((item: any) => !item.isRead).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#173F5F',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          height: 78,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName as any}
              size={size}
              color={color}
              style={{ marginBottom: -2 }}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{ title: 'Shop' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ff6b6b',
            color: '#fff',
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Alerts',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ff6b6b',
            color: '#fff',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
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
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Vouchers" component={VouchersScreen} />
    </Stack.Navigator>
  );
};

