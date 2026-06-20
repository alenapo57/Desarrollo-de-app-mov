//este archivo define la navegación principal de la aplicación utilizando un Stack Navigator.
//Incluye un menú lateral (drawer) personalizado que se muestra al hacer clic en el ícono de menú en el encabezado. 
//El menú lateral contiene enlaces a las pantallas principales (Inicio, Movimientos, Agregar Movimiento y Perfil) y una opción para cerrar sesión. 
//El componente DrawerNavigator recibe el usuario autenticado y una función onLogout como props, 
//que se pasan a las pantallas correspondientes para manejar la visualización de datos y el proceso de cierre de sesión.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Alert, StatusBar
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import AddMovimientoScreen from '../screens/AddMovimientoScreen';
import EditMovimientoScreen from '../screens/EditMovimientoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const menuItems = [
  { name: 'Inicio',             screen: 'Home',          icon: 'home' },
  { name: 'Movimientos',        screen: 'Movimientos',   icon: 'list' },
  { name: 'Agregar Movimiento', screen: 'AddMovimiento', icon: 'add-circle' },
  { name: 'Perfil',             screen: 'Profile',       icon: 'person' },
];

const screenTitles = {
  Home: 'Inicio',
  Movimientos: 'Movimientos',
  AddMovimiento: 'Agregar Movimiento',
  EditMovimiento: 'Editar Movimiento',
  Profile: 'Perfil',
};

// Contexto simple para compartir el drawer entre pantallas
import { createContext, useContext } from 'react';
const DrawerContext = createContext(null);
export const useDrawer = () => useContext(DrawerContext);

function DrawerMenu({ isOpen, onClose, navigation, onLogout, usuario }) {
  if (!isOpen) return null;

  const getInitials = (nombre) => {
    if (!nombre) return 'U';
    const parts = nombre.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleNavigate = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBg} onPress={onClose} />
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(usuario?.nombre)}
            </Text>
          </View>
          <Text style={styles.drawerName}>{usuario?.nombre || 'Usuario'}</Text>
          <Text style={styles.drawerEmail}>{usuario?.email || ''}</Text>
        </View>

        <View style={styles.drawerItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.drawerItem}
              onPress={() => handleNavigate(item.screen)}
            >
              <MaterialIcons name={item.icon} size={22} color={colors.primary} />
              <Text style={styles.drawerItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <MaterialIcons name="logout" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CustomHeader({ title, onOpenDrawer }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onOpenDrawer} style={styles.menuButton}>
        <MaterialIcons name="menu" size={26} color={colors.textWhite} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

export default function DrawerNavigator({ usuario, onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentNavigation, setCurrentNavigation] = useState(null);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('usuario');
            onLogout();
          },
        },
      ]
    );
  };

  const screenOptions = ({ navigation, route }) => ({
    header: () => (
      <CustomHeader
        title={screenTitles[route.name] || route.name}
        onOpenDrawer={() => {
          setCurrentNavigation(navigation);
          setDrawerOpen(true);
        }}
      />
    ),
  });

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} usuario={usuario} />}
        </Stack.Screen>
        <Stack.Screen name="Movimientos">
          {(props) => <MovimientosScreen {...props} usuario={usuario} />}
        </Stack.Screen>
        <Stack.Screen name="AddMovimiento">
          {(props) => <AddMovimientoScreen {...props} usuario={usuario} />}
        </Stack.Screen>
        <Stack.Screen name="EditMovimiento" component={EditMovimientoScreen} />
        <Stack.Screen name="Profile">
          {(props) => <ProfileScreen {...props} usuario={usuario} onLogout={handleLogout} />}
        </Stack.Screen>
      </Stack.Navigator>

      {currentNavigation && (
        <DrawerMenu
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navigation={currentNavigation}
          onLogout={handleLogout}
          usuario={usuario}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    zIndex: 999,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.surface,
    elevation: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: (StatusBar.currentHeight || 44) + 16,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 26,
    fontWeight: 'bold',
  },
  drawerName: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerEmail: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  drawerItems: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  drawerItemText: {
    marginLeft: 14,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 8,
  },
  logoutText: {
    marginLeft: 14,
    fontSize: 15,
    color: colors.danger,
    fontWeight: '500',
  },
});