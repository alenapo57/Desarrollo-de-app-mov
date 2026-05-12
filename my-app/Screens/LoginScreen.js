import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateUser } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function LoginScreen({ navigation }) {
  // Estados para controlar los inputs del login.
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  // Comprueba las credenciales y limpia el formulario al ingresar.
  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa usuario y contraseña.');
      return;
    }

    try {
      const result = await validateUser(usuario.trim(), password.trim());
      if (result?.length > 0) {
        setUsuario('');
        setPassword('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Acceso denegado', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el usuario. Intenta de nuevo.');
      console.error('Login error:', error);
    }
  };

  return (
    // Mantiene el formulario visible cuando se abre el teclado.
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para acceder a tu biblioteca de videojuegos.</Text>
            <CustomInput label="Usuario" value={usuario} onChangeText={setUsuario} placeholder="Nombre de usuario" />
            <CustomInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Contraseña"
            />
            <Pressable style={styles.forgotLinkContainer} onPress={() => navigation.navigate('RecoverPassword')}>
              <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
            <CustomButton title="Iniciar sesión" onPress={handleLogin} style={styles.primaryButton} />
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}> Regístrate</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 22,
    lineHeight: 21,
  },
  forgotLinkContainer: {
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  forgotLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 8,
  },
});
