import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getProfile, logoutUser } from '../api/api';

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');

      if (!token) {
        router.replace('/');
        return;
      }

      const result = await getProfile(token);
      const profile = result.user || result.profile || result;
      setUser(profile);
    } catch (error: any) {
      Alert.alert(
        'Profile Error',
        error.message || 'Could not load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const token = await SecureStore.getItemAsync('authToken');

      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.log('Logout API error:', error);
    } finally {
      await SecureStore.deleteItemAsync('authToken');
      setLoggingOut(false);
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.logoSmall}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <ActivityIndicator size="large" color="#2449D8" />
        <Text style={styles.loadingText}>Preparing your dashboard...</Text>
      </SafeAreaView>
    );
  }

  const displayName = user?.fullname || user?.name || 'Adyanta User';
  const displayEmail = user?.email || 'Email not available';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'A';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6FC" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoSmall}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.brand}>ADYANTA</Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
          <Text style={styles.heading}>Welcome back,</Text>
          <Text style={styles.nameHeading}>{displayName}!</Text>
          <Text style={styles.subtitle}>
            Great to see you. Your account is ready.
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileCaption}>Adyanta Member</Text>
            </View>

            <View style={styles.verifiedIcon}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
          <Text style={styles.emailValue}>{displayEmail}</Text>

          <View style={styles.accountStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.accountStatusText}>Signed in successfully</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your account</Text>
          <Text style={styles.sectionCaption}>ACCOUNT OVERVIEW</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>✓</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Account secured</Text>
            <Text style={styles.infoDescription}>
              Your session token is stored securely on this device.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, loggingOut && styles.disabledButton]}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.85}
        >
          {loggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.logoutIcon}>↪</Text>
              <Text style={styles.logoutText}>log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>ADYANTA  ·  YOUR JOURNEY, SIMPLIFIED</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F6FC' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F6FC',
  },
  loadingText: { marginTop: 14, color: '#71809B', fontSize: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoSmall: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#2449D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  brand: { color: '#14234B', fontSize: 16, fontWeight: '800', letterSpacing: 3 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F7EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A36A',
  },
  statusText: { color: '#16794C', fontSize: 12, fontWeight: '700' },
  hero: { marginTop: 38, marginBottom: 24 },
  eyebrow: {
    color: '#2449D8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heading: { color: '#14234B', fontSize: 27, fontWeight: '600' },
  nameHeading: {
    color: '#2449D8',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: '#71809B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7ECF5',
    shadowColor: '#1C2C50',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: '#E8EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#2449D8', fontSize: 25, fontWeight: '800' },
  profileInfo: { flex: 1, marginLeft: 14 },
  profileName: { color: '#14234B', fontSize: 17, fontWeight: '800' },
  profileCaption: { color: '#71809B', fontSize: 12, marginTop: 5 },
  verifiedIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#E5F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: { color: '#16794C', fontSize: 15, fontWeight: '800' },
  cardDivider: { height: 1, backgroundColor: '#EDF1F7', marginVertical: 20 },
  fieldLabel: {
    color: '#8A96AC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  emailValue: {
    color: '#273653',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 17,
  },
  accountStatusText: { color: '#16794C', fontSize: 12, fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 14,
  },
  sectionTitle: { color: '#14234B', fontSize: 18, fontWeight: '800' },
  sectionCaption: {
    color: '#8A96AC',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E7ECF5',
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: { color: '#2449D8', fontSize: 22, fontWeight: '800' },
  infoContent: { flex: 1, marginLeft: 13 },
  infoTitle: { color: '#14234B', fontSize: 14, fontWeight: '800' },
  infoDescription: {
    color: '#71809B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  logoutButton: {
    height: 54,
    backgroundColor: '#2449D8',
    borderRadius: 14,
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  disabledButton: { opacity: 0.7 },
  logoutIcon: { color: '#FFFFFF', fontSize: 22, fontWeight: '600' },
  logoutText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  footer: {
    color: '#9AA5B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 25,
  },
});
