import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDatabase } from './database/db';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import RecoverPasswordScreen from './Screens/RecoverPasswordScreen';
import HomeScreen from './Screens/HomeScreen';
import FormScreen from './Screens/FormScreen';
import ListScreen from './Screens/ListScreen';
import { COLORS } from './components/theme';

// Stack contiene todas las pantallas y permite navegar entre ellas.
const Stack = createNativeStackNavigator();

export default function App() {
  // Al abrir la app, se inicializa la base de datos local.
  // El arreglo vacío hace que se ejecute solo una vez.
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    // GestureHandlerRootView es necesario para gestos y navegación en React Native.
    <GestureHandlerRootView style={styles.container}>
      {/* NavigationContainer envuelve todo el sistema de navegación. */}
      <NavigationContainer>
        <Stack.Navigator
          // La primera pantalla que ve el usuario es el login.
          initialRouteName="Login"
          // Estilos generales para los headers de todas las pantallas del stack.
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.surface,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          {/* Pantallas de autenticación: no muestran header porque ya tienen su propio diseño. */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} options={{ headerShown: false }} />

          {/* Pantallas principales de la app después de iniciar sesión. */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bienvenido' }} />
          <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Registrar videojuego' }} />
          <Stack.Screen name="List" component={ListScreen} options={{ title: 'Mis videojuegos' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Permite que la app ocupe toda la pantalla.
  container: {
    flex: 1,
  },
});
