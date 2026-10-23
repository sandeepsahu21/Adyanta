import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../api/api';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(email.trim(), password);

      if (!result.token) {
        Alert.alert('Login Failed', 'Token was not received from the server.');
        return;
      }

      await SecureStore.setItemAsync('authToken', result.token);
      router.replace('/dashboard');
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>A</Text>
            </View>
            <Text style={styles.brand}>ADYANTA</Text>
            <Text style={styles.tagline}>A better way to get things done.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.description}>
              Sign in to continue to your account.
            </Text>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <View style={styles.passwordHeading}>
              <Text style={styles.label}>Password</Text>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.showText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login →</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            Secure access. Simple experience.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F3F6FC' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBox: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#2449D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#2449D8',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  brand: {
    color: '#14234B',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tagline: {
    color: '#71809B',
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E7ECF5',
    shadowColor: '#1C2C50',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heading: {
    color: '#14234B',
    fontSize: 27,
    fontWeight: '800',
  },
  description: {
    color: '#71809B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    color: '#273653',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E0E7F1',
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#14234B',
    backgroundColor: '#FBFCFF',
    marginBottom: 22,
  },
  passwordHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E0E7F1',
    borderRadius: 13,
    paddingLeft: 15,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFF',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#14234B',
    paddingVertical: 0,
  },
  showText: {
    color: '#2449D8',
    fontWeight: '700',
    fontSize: 13,
    paddingLeft: 10,
  },
  loginButton: {
    height: 55,
    borderRadius: 14,
    backgroundColor: '#2449D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    shadowColor: '#2449D8',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  disabledButton: { opacity: 0.7 },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  signupText: {
    color: '#71809B',
    fontSize: 13,
  },
  signupLink: {
    color: '#2449D8',
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    color: '#8A96AC',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 25,
  },
});
