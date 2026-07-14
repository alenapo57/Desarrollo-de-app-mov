import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

/**
 * DarkModeToggle
 * Switch animado para modo claro/oscuro: el círculo interno se desliza,
 * el track cambia de color en crossfade y el ícono rota al cambiar.
 * Usa Animated nativo de RN — no depende de reanimated.
 */
export default function DarkModeToggle({ isDark, onToggle }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 250,
      // La interpolación de color necesita el driver de JS, no el nativo.
      useNativeDriver: false,
    }).start();
  }, [isDark, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const circleTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  const circleRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = () => {
    Haptics.selectionAsync();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: colors.textWhite,
              transform: [{ translateX: circleTranslate }, { rotate: circleRotate }],
            },
          ]}
        >
          <MaterialIcons
            name={isDark ? 'dark-mode' : 'light-mode'}
            size={12}
            color={isDark ? colors.primary : '#F59E0B'}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});