import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { validateRegisterForm } from '../utils/validators';
import { registerUser } from '../services/authService';

export default function RegisterScreen({ navigation, onLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    // Validar formulario
    const { valid, error: validationError } = validateRegisterForm({
      nombre, email, password, confirmPassword
    });
    if (!valid) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({ nombre, email, password });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Guardar sesión en AsyncStorage
      await AsyncStorage.setItem('usuario', JSON.stringify(result.user));

      // Notificar al RootNavigator
      onLogin(result.user);

    } catch (err) {
      console.error('handleRegister error:', err);
      setError('Ocurrió un error inesperado. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completá tus datos para registrarte</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Nombre Completo"
            icon="person"
            placeholder="Juan Pérez"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
          <CustomInput
            label="Correo Electrónico"
            icon="email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label="Contraseña"
            icon="lock"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirmar Contraseña"
            icon="lock-outline"
            placeholder="Repetí tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <CustomButton
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Iniciá sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 14,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});