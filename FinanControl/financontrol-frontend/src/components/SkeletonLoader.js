import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * SkeletonBox
 * Bloque base con animación de pulso (opacidad).
 * No depende de reanimated para evitar conflictos de versión.
 */
export const SkeletonBox = ({ width = '100%', height = 16, borderRadius = 8, style }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

/**
 * SkeletonMovimientoCard
 * Placeholder de una card de movimiento (ícono + textos + monto).
 */
export const SkeletonMovimientoCard = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.card}>
      <SkeletonBox width={44} height={44} borderRadius={22} />
      <View style={styles.cardTextContainer}>
        <SkeletonBox width="60%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={12} />
      </View>
      <SkeletonBox width={60} height={16} borderRadius={6} />
    </View>
  );
};

/**
 * SkeletonHome
 * Placeholder completo del dashboard: card de saldo + resumen + últimos movimientos.
 */
export const SkeletonHome = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {/* Card de saldo */}
      <View style={styles.balanceCard}>
        <SkeletonBox width="50%" height={14} style={{ marginBottom: 12 }} />
        <SkeletonBox width="70%" height={32} style={{ marginBottom: 16 }} />
        <View style={styles.balanceRow}>
          <SkeletonBox width="40%" height={14} />
          <SkeletonBox width="40%" height={14} />
        </View>
      </View>

      {/* Título de sección */}
      <SkeletonBox width="45%" height={18} style={{ marginTop: 24, marginBottom: 12 }} />

      {/* Últimos movimientos */}
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonMovimientoCard key={i} />
      ))}
    </View>
  );
};

/**
 * SkeletonMovimientos
 * Placeholder para la lista completa de movimientos.
 */
export const SkeletonMovimientos = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <SkeletonBox width="55%" height={20} style={{ marginBottom: 16 }} />
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <SkeletonMovimientoCard key={i} />
      ))}
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    balanceCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    cardTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
  });
