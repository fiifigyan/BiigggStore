// apps/mobile/src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './stacks/AuthStack';
import { MainStack } from './stacks/MainStack';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const { registerTokenWithServer: registerPushToken } = usePushNotifications();

  useEffect(() => {
    (async () => {
      try {
        const ok = await checkAuth();
        if (ok) {
          await registerPushToken();
        } else {
          await registerPushToken();
        }
      } catch (err) {
        console.warn('Register push token on startup failed', err);
      }
    })();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </Stack.Navigator>
  );
};