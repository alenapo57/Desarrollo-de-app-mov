import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const stored = await AsyncStorage.getItem('usuario');
      if (stored) {
        setUsuario(JSON.parse(stored));
      }
    } catch (error) {
      console.error('checkSession error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user) => {
    setUsuario(user);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {usuario ? (
        <DrawerNavigator usuario={usuario} onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}