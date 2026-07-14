import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from './colors';

const ThemeContext = createContext();

const FADE_DURATION = 150;

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [overlayColor, setOverlayColor] = useState(lightColors.background);

  const opacity = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'dark') setIsDark(true);
    } catch (e) {}
  };

  const toggleTheme = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const newVal = !isDark;
    const targetColors = newVal ? darkColors : lightColors;

    // El overlay ya nace con el color de destino, para que al taparse
    // la pantalla no haya ningún salto de color perceptible.
    setOverlayColor(targetColors.background);

    // Fase 1: fundido a negro/blanco (según destino) cubriendo la pantalla.
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // Pantalla 100% cubierta: el cambio de tema real ya es invisible.
      setIsDark(newVal);
      AsyncStorage.setItem('theme', newVal ? 'dark' : 'light').catch(() => {});

      // Fase 2: el overlay ya coincide exactamente con lo que hay debajo
      // (mismo color), así que se destapa con un fundido corto.
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        isAnimating.current = false;
      });
    });
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}

      {/* Overlay de crossfade: cubre toda la pantalla al cambiar de tema. */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, opacity }]}
      />
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);