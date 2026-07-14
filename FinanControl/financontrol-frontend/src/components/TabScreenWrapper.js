import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * TabScreenWrapper
 * Envuelve el contenido de cada tab y aplica un fade + slide-up
 * cada vez que la pantalla toma foco (cambio de tab).
 * Usa Animated nativo de RN — no depende de reanimated.
 */
export default function TabScreenWrapper({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      translateY.setValue(12);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      // No hace falta cleanup: al perder foco simplemente no se ve.
    }, [])
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
