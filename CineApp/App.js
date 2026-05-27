import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen';
import TopRatedScreen from './screens/TopRatedScreen';
import DetailScreen from './screens/DetailScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Contenido personalizado del menú hamburguesa
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerEmoji}>🎬</Text>
        <Text style={styles.drawerTitle}>CineApp</Text>
        <Text style={styles.drawerSubtitle}>The Movie Database</Text>
      </View>
      <View style={styles.drawerDivider} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Drawer con las 3 pantallas del menú
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#0D0D0D' },
        headerTintColor: '#E50914',
        headerTitleStyle: { fontWeight: 'bold', color: '#FFF' },
        drawerStyle: { backgroundColor: '#0D0D0D', width: 260 },
        drawerActiveTintColor: '#E50914',
        drawerInactiveTintColor: '#AAA',
        drawerActiveBackgroundColor: '#1A1A1A',
      }}
    >
      <Drawer.Screen
        name="Populares"
        component={HomeScreen}
        options={{ drawerLabel: '🎬  Populares', title: '🎬 Populares' }}
      />
      <Drawer.Screen
        name="MejorPuntuadas"
        component={TopRatedScreen}
        options={{ drawerLabel: '⭐  Mejor Puntuadas', title: '⭐ Mejor Puntuadas' }}
      />
      <Drawer.Screen
        name="Acerca"
        component={AboutScreen}
        options={{ drawerLabel: 'ℹ️  Acerca de', title: 'ℹ️ Acerca de' }}
      />
    </Drawer.Navigator>
  );
}

// Stack raíz: el Drawer + la pantalla de Detalle (fuera del drawer)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerShown: true,
            title: 'Detalle',
            headerStyle: { backgroundColor: '#0D0D0D' },
            headerTintColor: '#E50914',
            headerTitleStyle: { fontWeight: 'bold', color: '#FFF' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { backgroundColor: '#0D0D0D' },
  drawerHeader: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  drawerEmoji: { fontSize: 48 },
  drawerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  drawerSubtitle: { color: '#666', fontSize: 12, marginTop: 4 },
  drawerDivider: { height: 1, backgroundColor: '#222', marginHorizontal: 16, marginBottom: 8 },
});
