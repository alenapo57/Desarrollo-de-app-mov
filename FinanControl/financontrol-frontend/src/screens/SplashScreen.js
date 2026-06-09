import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>💰</Text>
        </View>
        <Text style={styles.title}>FinanControl</Text>
        <Text style={styles.subtitle}>Tu finanzas bajo control</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Cargando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 52,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textWhite,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
});