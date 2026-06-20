import React, { useState, useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { useTheme } from '../theme/ThemeContext';

export default function RootNavigator() {
  const { isDark, colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const stored = await AsyncStorage.getItem('usuario');
      if (token && stored) setUsuario(JSON.parse(stored));
    } catch (error) {
      console.error('checkSession error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user) => setUsuario(user);
  const handleLogout = () => setUsuario(null);

  // Tema de navegación dinámico
  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.primary,
          text: colors.textWhite,
          border: colors.border,
          primary: colors.primary,
        },
      };

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {usuario ? (
        <BottomTabNavigator usuario={usuario} onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
