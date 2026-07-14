import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function CustomButton({
  title, onPress, variant = 'primary', loading = false, disabled = false, style,
}) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const getButtonStyle = () => {
    if (disabled || loading) return [styles.button, styles.disabled, style];
    switch (variant) {
      case 'secondary': return [styles.button, styles.secondary, style];
      case 'danger':    return [styles.button, styles.danger, style];
      default:          return [styles.button, styles.primary, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary': return [styles.text, styles.textSecondary];
      default:          return [styles.text, styles.textWhite];
    }
  };

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={colors.textWhite} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  button: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primary: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger, shadowColor: colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  disabled: { backgroundColor: colors.border, elevation: 0 },
  text: { fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  textWhite: { color: colors.textWhite },
  textSecondary: { color: colors.primary },
});
