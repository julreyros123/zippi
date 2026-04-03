import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { API_URL } from '../constants/Config';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleRegister = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    setError('');

    if (!trimmedUsername || !trimmedEmail || !password) {
      setError('Please fill in username, email, and password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, email: trimmedEmail, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        router.replace('/chat');
      } else {
        if (res.status === 400) {
          setError(data.error || 'Please check your information and try again.');
        } else if (res.status === 429) {
          setError('Too many attempts. Please wait a few minutes and try again.');
        } else {
          setError(data.error || 'Registration failed. Please try again later.');
        }
      }
    } catch (e) {
      setError('Cannot connect to server. Check internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>Z</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join thousands of students on Zippi.</Text>

          {error ? (
            <View style={styles.errorBox}>
              <View style={styles.errorDot} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#6B7280"
              placeholder="cool_username"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#6B7280"
              placeholder="you@example.com"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#6B7280"
              placeholder="Min. 8 characters"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkAccent}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 24 },
  formContainer: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    padding: 22,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { color: 'white', fontSize: 26, fontWeight: '800' },
  title: { fontSize: 34, fontWeight: '800', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#9CA3AF', marginBottom: 24 },
  errorBox: {
    marginBottom: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F87171' },
  errorText: { color: '#FCA5A5', fontSize: 13.5, fontWeight: '600', flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#D1D5DB', marginBottom: 8, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    color: 'white',
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 18, alignItems: 'center' },
  linkText: { color: '#9CA3AF', fontSize: 14 },
  linkAccent: { color: '#E5E7EB', fontWeight: '800' },
});
