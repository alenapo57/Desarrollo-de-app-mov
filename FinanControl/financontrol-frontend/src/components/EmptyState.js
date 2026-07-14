import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const ILLUSTRATION_SIZE = 140;

/**
 * EmptyState
 * Estado vacío ilustrado: círculos superpuestos + ícono central + puntos
 * decorativos, construido solo con Views/MaterialIcons (sin assets externos).
 * Reutilizable en cualquier pantalla que necesite un "no hay nada todavía".
 */
export default function EmptyState({ icon = 'receipt-long', title, subtitle, actionLabel, onAction }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <View style={[styles.circleOuter, { backgroundColor: colors.primary + '12' }]} />
        <View style={[styles.circleInner, { backgroundColor: colors.primary + '20' }]}>
          <MaterialIcons name={icon} size={48} color={colors.primary} />
        </View>
        <View style={[styles.dot, styles.dotTopRight, { backgroundColor: colors.income + '40' }]} />
        <View style={[styles.dot, styles.dotBottomLeft, { backgroundColor: colors.secondary + '40' }]} />
        <View style={[styles.dot, styles.dotTopLeft, { backgroundColor: colors.expense + '35' }]} />
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  circleOuter: {
    position: 'absolute',
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    borderRadius: ILLUSTRATION_SIZE / 2,
  },
  circleInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dotTopRight: { top: 8, right: 10, width: 16, height: 16 },
  dotBottomLeft: { bottom: 14, left: 6, width: 12, height: 12 },
  dotTopLeft: { top: 22, left: 2, width: 10, height: 10 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 15,
  },
});
