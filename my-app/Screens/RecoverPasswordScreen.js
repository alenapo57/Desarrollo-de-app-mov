import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { recoverPassword } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function RecoverPasswordScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');

  // Busca la contraseña asociada al usuario ingresado.
  const handleRecover = async () => {
    if (!usuario.trim()) {
      Alert.alert('Error', 'Ingresa tu usuario para recuperar la contraseña.');
      return;
    }

    try {
      const result = await recoverPassword(usuario.trim());
      if (result?.password) {
        Alert.alert('Contraseña recuperada', `Tu contraseña es: ${result.password}`);
      } else {
        Alert.alert('Usuario no encontrado', 'Verifica tu usuario e intenta de nuevo.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo recuperar la contraseña. Intenta más tarde.');
      console.error('Recover password error:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Recuperar contraseña</Text>
            <Text style={styles.subtitle}>Ingresa el usuario registrado y revisa tu clave de forma segura.</Text>
            <CustomInput label="Usuario" value={usuario} onChangeText={setUsuario} placeholder="Nombre de usuario" />
            <CustomButton title="Recuperar" onPress={handleRecover} style={styles.primaryButton} />
            <CustomButton title="Volver al login" onPress={() => navigation.navigate('Login')} secondary />
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
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: 22,
    fontSize: 15,
    lineHeight: 21,
  },
  primaryButton: {
    marginTop: 8,
    marginBottom: 8,
  },
});
