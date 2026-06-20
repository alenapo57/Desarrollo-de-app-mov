//este archivo define la navegación para las pantallas de autenticación (Login y Register). 
//Se utiliza un Stack Navigator para permitir la navegación entre estas dos pantallas. 
//El componente AuthNavigator recibe una función onLogin como prop, que se pasa a ambas pantallas 
//para manejar el proceso de inicio de sesión.

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}