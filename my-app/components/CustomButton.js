import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from './theme';

// Botón reutilizable de la app.
// Puede ser primario, secundario o de peligro según las props.
export default function CustomButton({ title, onPress, secondary, danger, style }) {
  // Elegimos el estilo del botón según su intención.
  // danger tiene prioridad sobre secondary porque es una acción más importante visualmente.
  const buttonStyle = danger ? styles.dangerButton : secondary ? styles.secondaryButton : styles.primaryButton;

  // El color del texto también cambia según el tipo de botón.
  const textStyle = danger ? styles.dangerText : secondary ? styles.secondaryText : styles.primaryText;

  return (
    <Pressable
      // Pressable permite cambiar el estilo mientras el botón está presionado.
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {/* Texto visible del botón. */}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Estilo base compartido por todos los botones.
  button: {
    width: '100%',
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    ...SHADOWS.light,
  },
  // Botón principal usado para acciones positivas o principales.
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  // Botón secundario usado para acciones alternativas.
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Botón de acciones peligrosas, como eliminar o cerrar sesión.
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  // Estilo base del texto del botón.
  text: {
    fontSize: 15,
    fontWeight: '800',
  },
  // Texto del botón principal.
  primaryText: {
    color: COLORS.surface,
  },
  // Texto del botón secundario.
  secondaryText: {
    color: COLORS.text,
  },
  // Texto del botón de peligro.
  dangerText: {
    color: COLORS.surface,
  },
  // Feedback visual al presionar.
  pressed: {
    opacity: 0.88,
  },
});
