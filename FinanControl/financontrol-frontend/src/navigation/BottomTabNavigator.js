import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import TabScreenWrapper from '../components/TabScreenWrapper';
import { logoutUser } from '../services/authService';

import HomeScreen from '../screens/HomeScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import AddMovimientoScreen from '../screens/AddMovimientoScreen';
import EditMovimientoScreen from '../screens/EditMovimientoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MovimientosStack({ usuario }) {
  const { colors, isDark } = useTheme();

  const headerBg = isDark ? colors.surface : colors.primary;
  const headerTint = isDark ? colors.textPrimary : colors.textWhite;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MovimientosList"
        options={{
          title: 'Movimientos',
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: headerTint,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {(props) => <MovimientosScreen {...props} usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen
        name="EditMovimiento"
        component={EditMovimientoScreen}
        options={{
          title: 'Editar Movimiento',
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: headerTint,
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator({ usuario, onLogout }) {
  const { colors, isDark } = useTheme();

  const headerBg = isDark ? colors.surface : colors.primary;
  const headerTint = isDark ? colors.textPrimary : colors.textWhite;

  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
          elevation: 12,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Movimientos: 'list',
            Agregar: 'add-circle-outline',
            Profile: 'person-outline',
          };
          return <MaterialIcons name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: 'Inicio', tabBarLabel: 'Inicio' }}>
        {(props) => (
          <TabScreenWrapper>
            <HomeScreen {...props} usuario={usuario} />
          </TabScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name="Movimientos" options={{ tabBarLabel: 'Movimientos', headerShown: false }}>
        {(props) => (
          <TabScreenWrapper>
            <MovimientosStack {...props} usuario={usuario} />
          </TabScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name="Agregar" options={{ title: 'Agregar Movimiento', tabBarLabel: 'Agregar' }}>
        {(props) => (
          <TabScreenWrapper>
            <AddMovimientoScreen {...props} usuario={usuario} />
          </TabScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile" options={{ title: 'Perfil', tabBarLabel: 'Perfil' }}>
        {(props) => (
          <TabScreenWrapper>
            <ProfileScreen {...props} usuario={usuario} onLogout={handleLogout} />
          </TabScreenWrapper>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}