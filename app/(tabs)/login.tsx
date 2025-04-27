import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, colors } from '@/components/UIComponents';
import { Mail, Lock, UserRound } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { emailOrUsername?: string; password?: string } = {};
    let isValid = true;

    if (!emailOrUsername.trim()) {
      errors.emailOrUsername = 'Email or username is required';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      await login(emailOrUsername, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.safeArea}>
            <Animated.View 
              entering={FadeInDown.duration(600).springify()}
              style={styles.headerContainer}
            >
              <View style={styles.logoContainer}>
                <WifiIcon size={48} color={colors.primary} />
              </View>
              <Text style={styles.title}>IoT Connect</Text>
              <Text style={styles.subtitle}>
                Manage all your IoT connections in one place
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.duration(800).springify().delay(200)}
              style={styles.formContainer}
            >
              <Input
                label="Email or Username"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                error={validationErrors.emailOrUsername}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                error={validationErrors.password}
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  size="large"
                />
              </View>
            </Animated.View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Custom WifiIcon component with animation
const WifiIcon = ({ size, color }: { size: number; color: string }) => {
  return (
    <Animated.View entering={FadeIn.duration(1000)}>
      <View style={[styles.iconCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        <WifiIcon size={size * 0.6} color={color} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: `${colors.error}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 8,
  },
});