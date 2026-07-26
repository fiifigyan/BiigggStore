// apps/mobile/src/screens/auth/RegisterScreen.tsx
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

export const RegisterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { register, registerLoading } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validators.phone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validators.password(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message || 'Password does not meet requirements';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeToTerms) {
      newErrors.terms = 'Please agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Please check your details and try again.'
      );
    }
  };

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
                <Ionicons name="person-add-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join BiigggStore and start shopping with confidence.</Text>
            </LinearGradient>
          </View>

          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>First name</Text>
                <View style={[styles.inputWrapper, errors.first_name && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#94a3b8"
                    value={formData.first_name}
                    onChangeText={(text) => {
                      setFormData({ ...formData, first_name: text });
                      if (errors.first_name) setErrors({ ...errors, first_name: '' });
                    }}
                  />
                </View>
                {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Last name</Text>
                <View style={[styles.inputWrapper, errors.last_name && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#94a3b8"
                    value={formData.last_name}
                    onChangeText={(text) => {
                      setFormData({ ...formData, last_name: text });
                      if (errors.last_name) setErrors({ ...errors, last_name: '' });
                    }}
                  />
                </View>
                {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor="#94a3b8"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone number</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="08012345678"
                  placeholderTextColor="#94a3b8"
                  value={formData.phone}
                  onChangeText={(text) => {
                    setFormData({ ...formData, phone: text });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor="#94a3b8"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <Text style={styles.passwordHint}>Use at least 8 characters with upper, lower and a number.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#94a3b8"
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeToTerms(!agreeToTerms)}>
                <View style={[styles.checkboxBox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            {errors.terms && <Text style={[styles.errorText, styles.termsError]}>{errors.terms}</Text>}

            <TouchableOpacity
              style={[styles.registerButton, registerLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={registerLoading}
              activeOpacity={0.9}
            >
              {registerLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Create account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 26,
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
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 14,
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#fb7185',
  },
  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  passwordHint: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
  termsError: {
    marginTop: -4,
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '700',
  },
});