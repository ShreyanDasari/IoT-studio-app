import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { LogIn, WifiIcon } from 'lucide-react-native';
import { colors } from '@/components/UIComponents';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      router.replace('/(tabs)/connections');
    } else {
      router.replace('/(tabs)/login');
    }
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => <LogIn size={size} color={color} />,
          tabBarStyle: isAuthenticated ? { display: 'none' } : styles.tabBar,
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connections',
          tabBarIcon: ({ color, size }) => <WifiIcon size={size} color={color} />,
          tabBarStyle: !isAuthenticated ? { display: 'none' } : styles.tabBar,
        }}
      />
      <Tabs.Screen
        name="connection/[id]"
        options={{
          href: null, // Hide this tab from the tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
      web: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
    }),
    backgroundColor: colors.card,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});