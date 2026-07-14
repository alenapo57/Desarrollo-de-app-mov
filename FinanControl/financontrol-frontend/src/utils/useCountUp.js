import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * useCountUp
 * Anima un valor numérico desde su valor anterior hasta targetValue.
 * Usa Animated nativo de RN (no reanimated) para evitar conflictos de versión.
 *
 * @param {number} targetValue - valor final al que debe llegar la animación
 * @param {number} duration - duración en ms (default 800)
 * @returns {number} valor animado actual, listo para formatear (ej: formatCurrency)
 */
export function useCountUp(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animatedValue = useRef(new Animated.Value(targetValue)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    // En el primer render no animamos: mostramos el valor real directamente.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayValue(targetValue);
      animatedValue.setValue(targetValue);
      return;
    }

    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(value);
    });

    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.cubic),
      // No se puede usar native driver: el listener necesita el valor en JS
      // para poder formatearlo como moneda en cada frame.
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue]);

  return displayValue;
}
