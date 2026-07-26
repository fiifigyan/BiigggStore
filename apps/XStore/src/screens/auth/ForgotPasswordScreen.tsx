// apps/mobile/src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authApi } from '../../api/auth';
import { validators } from '../../utils/validators';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendResetLink = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validators.email(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authApi.forgotPassword(email);
      if (response?.resetToken) {
        navigation.navigate('ResetPassword', { token: response.resetToken });
        return;
      }
      setSent(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <LinearGradient colors={['#f8faff', '#eef2ff']} style={styles.container}>
        <View style={[styles.container, styles.sentContainer, { paddingTop: insets.top }]}>
          <View style={styles.successBadge}>
            <Ionicons name="mail-open-outline" size={36} color="#fff" />
          </View>
          <Text style={styles.sentTitle}>Check your inbox</Text>
          <Text style={styles.sentDescription}>
            We sent a reset link to{' '}
            <Text style={styles.sentEmail}>{email}</Text>
          </Text>
          <Text style={styles.sentHint}>
            Didn’t receive it? Check your spam folder or{' '}
            <TouchableOpacity onPress={handleSendResetLink}>
              <Text style={styles.sentResend}>resend</Text>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLoginText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f8faff', '#eef2ff']} style={styles.container}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.heroCard}>
            <LinearGradient colors={['#4f46e5', '#2563eb']} style={styles.heroGradient}>
              <View style={styles.logoBadge}>
                <Ionicons name="key-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.subtitle}>Enter the email tied to your account and we’ll send a secure recovery link.</Text>
            </LinearGradient>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <View style={[styles.inputWrapper, error && styles.inputError]}>
                <Ionicons name="mail-outline" size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, loading && styles.buttonDisabled]}
              onPress={handleSendResetLink}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Send reset link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLoginText}>Back to login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGradient: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  formCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe3f0',
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#fb7185',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backToLogin: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  sentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sentDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  sentEmail: {
    color: '#2563eb',
    fontWeight: '600',
  },
  sentHint: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  sentResend: {
    color: '#2563eb',
    fontWeight: '600',
  },
  backToLoginButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
});