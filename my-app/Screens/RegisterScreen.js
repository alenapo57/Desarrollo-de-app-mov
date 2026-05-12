import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { getUser, registerUser } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function RegisterScreen({ navigation }) {
  // Estados para controlar los inputs del registro.
  // Cada setState se pasa al input correspondiente para actualizar el valor.
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Esta función se ejecuta cuando el usuario toca "Registrarme".
  const handleRegister = async () => {
    // Normalizamos los datos quitando espacios innecesarios.
    const trimmedUser = usuario.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    // Primer control: ningún campo puede quedar vacío.
    if (!trimmedUser || !trimmedPassword || !trimmedConfirm) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    // Segundo control: las dos contraseñas tienen que ser iguales.
    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      // Buscamos si ya existe un usuario con ese nombre.
      const existing = await getUser(trimmedUser);

      // Si existe, cortamos el registro para evitar duplicados.
      if (existing?.length > 0) {
        Alert.alert('Error', 'El usuario ya existe. Elige otro nombre.');
        return;
      }

      // Si pasó todas las validaciones, se guarda el usuario.
      await registerUser(trimmedUser, trimmedPassword);

      // Al aceptar el mensaje, vuelve al login para iniciar sesión.
      Alert.alert('Registro exitoso', 'Tu cuenta fue creada correctamente.', [
        { text: 'Aceptar', onPress: () => navigation.navigate('Login') },
      ]);

      // Limpiamos el formulario para que no queden datos escritos.
      setUsuario('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error inesperado de base de datos o ejecución.
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
      console.error('Register error:', error);
    }
  };

  return (
    // Mantiene el formulario usable cuando aparece el teclado.
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Cierra el teclado al tocar fuera de los campos. */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Encabezado de la tarjeta. */}
            <View style={styles.topHeader}>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Guarda tus videojuegos favoritos y organiza tu colección.</Text>
            </View>

            {/* Campos del formulario de registro. */}
            <CustomInput label="Usuario" value={usuario} onChangeText={setUsuario} placeholder="Ingresa tu usuario" />
            <CustomInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Ingresa tu contraseña"
            />
            <CustomInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Repite tu contraseña"
            />

            {/* Botón principal: ejecuta handleRegister. */}
            <CustomButton title="Registrarme" onPress={handleRegister} style={styles.primaryButton} />

            {/* Acceso rápido para volver al login si el usuario ya tiene cuenta. */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>¿Ya tienes cuenta?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchLink}> Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Fondo general de la pantalla.
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Centra la tarjeta en la pantalla y agrega margen interno.
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  // Tarjeta blanca donde se agrupa todo el formulario.
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  // Espacio entre el encabezado y los inputs.
  topHeader: {
    marginBottom: 20,
  },
  // Título principal del registro.
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  // Fila inferior con texto y link hacia login.
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  // Texto neutro de la pregunta.
  switchText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  // Link resaltado para navegar al login.
  switchLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  // Texto descriptivo debajo del título.
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  // Separación del botón respecto al último input.
  primaryButton: {
    marginTop: 8,
  },
});
