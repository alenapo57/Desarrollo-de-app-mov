import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { validateLoginForm } from '../utils/validators';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation, onLogin }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    const { valid, error: validationError } = validateLoginForm({ email, password });
    if (!valid) { setError(validationError); return; }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      if (!result.success) { setError(result.error); return; }
      await AsyncStorage.setItem('usuario', JSON.stringify(result.user));
      onLogin(result.user);
    } catch (err) {
      setError('Ocurrió un error inesperado. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.title}>FinanControl</Text>
          <Text style={styles.subtitle}>Iniciá sesión en tu cuenta</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido</Text>
          {error ? <View style={styles.errorBanner}><Text style={styles.errorBannerText}>{error}</Text></View> : null}
          <CustomInput label="Correo Electrónico" icon="email" placeholder="tu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <CustomInput label="Contraseña" icon="lock" placeholder="Tu contraseña" value={password} onChangeText={setPassword} secureTextEntry />
          <CustomButton title="Iniciar Sesión" onPress={handleLogin} loading={loading} style={styles.loginButton} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tenés cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { width: 80, height: 80, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginBottom: 24 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  errorBanner: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.danger },
  errorBannerText: { color: colors.danger, fontSize: 14 },
  loginButton: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: colors.textSecondary, fontSize: 15 },
  footerLink: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
