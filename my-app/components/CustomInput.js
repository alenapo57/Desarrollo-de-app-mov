import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from './theme';

// Componente reutilizable para todos los campos de texto de la app.
// Recibe label, value, onChangeText y placeholder desde cada pantalla.
export default function CustomInput({ label, value, onChangeText, secureTextEntry, placeholder }) {
  // Guarda si el input está enfocado para cambiar su estilo visual.
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Texto que identifica el campo. */}
      <Text style={styles.label}>{label}</Text>

      {/* Input controlado: su valor viene del estado de la pantalla padre. */}
      <TextInput
        // Cuando está enfocado, se agrega inputFocused al estilo base.
        style={[styles.input, isFocused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        // Evita mayúsculas automáticas y autocorrección en usuarios, contraseñas, etc.
        autoCapitalize="none"
        autoCorrect={false}
        // Estos eventos cambian el borde/fondo al entrar o salir del input.
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor del label + input.
  container: {
    width: '100%',
    marginBottom: 14,
  },
  // Estilo del texto superior del campo.
  label: {
    color: COLORS.text,
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '700',
  },
  // Estado normal del input.
  input: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    ...SHADOWS.light,
  },
  // Estado visual cuando el usuario está escribiendo en el input.
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    shadowOpacity: 0.12,
  },
});
