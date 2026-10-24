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
import { registerUser } from '../api/api';

export default function SignupScreen() {
  const router = useRouter();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullname.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Both passwords must match.');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(
        fullname.trim(),
        email.trim(),
        password
      );

      Alert.alert(
        'Account created!',
        result.message || 'Your Adyanta account is ready.',
        [{ text: 'Continue to Login', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Unable to create your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹  Back</Text>
          </TouchableOpacity>

          <View style={styles.topSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>A</Text>
            </View>
            <Text style={styles.brand}>ADYANTA</Text>
            <Text style={styles.tagline}>Start your journey with us.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.description}>
              Enter your details to get started.
            </Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={fullname}
              onChangeText={setFullname}
              autoCapitalize="words"
              autoComplete="name"
            />

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

            {renderPasswordField(
              'Password',
              password,
              setPassword,
              'At least 8 characters'
            )}

            <View style={styles.fieldGap} />

            {renderPasswordField(
              'Confirm password',
              confirmPassword,
              setConfirmPassword,
              'Re-enter your password'
            )}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account  →</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/')}>
                <Text style={styles.loginLink}>log in</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>Your journey starts here.</Text>
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
    paddingVertical: 20,
  },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 12 },
  backText: { color: '#2449D8', fontSize: 15, fontWeight: '700' },
  topSection: { alignItems: 'center', marginBottom: 24 },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#2449D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoLetter: { color: '#FFFFFF', fontSize: 29, fontWeight: '800' },
  brand: {
    color: '#14234B',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tagline: { color: '#71809B', fontSize: 13, marginTop: 7 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E7ECF5',
    shadowColor: '#1C2C50',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heading: { color: '#14234B', fontSize: 26, fontWeight: '800' },
  description: {
    color: '#71809B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 22,
  },
  label: {
    color: '#273653',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E7F1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#14234B',
    backgroundColor: '#FBFCFF',
    marginBottom: 17,
  },
  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E7F1',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFF',
  },
  passwordInput: { flex: 1, fontSize: 14, color: '#14234B', paddingVertical: 0 },
  showText: { color: '#2449D8', fontSize: 13, fontWeight: '700', paddingLeft: 8 },
  fieldGap: { height: 17 },
  primaryButton: {
    height: 53,
    borderRadius: 13,
    backgroundColor: '#2449D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 23,
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 21,
  },
  loginText: { color: '#71809B', fontSize: 13 },
  loginLink: { color: '#2449D8', fontSize: 13, fontWeight: '800' },
  footer: {
    color: '#8A96AC',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
