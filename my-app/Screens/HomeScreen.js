import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { getGames } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function HomeScreen({ navigation }) {
  // Cantidad de videojuegos guardados.
  // Arranca en 0 y se actualiza consultando la base de datos.
  const [gamesCount, setGamesCount] = useState(0);

  // Texto dinámico para que el singular/plural se vea natural.
  const savedGamesText = `videojuego${gamesCount === 1 ? '' : 's'} guardado${gamesCount === 1 ? '' : 's'}`;

  // Consulta la base de datos y actualiza el contador de videojuegos.
  const loadGamesCount = async () => {
    try {
      const result = await getGames();

      // Si getGames no devuelve nada, usamos 0 para evitar errores.
      setGamesCount(result?.length || 0);
    } catch (error) {
      // No mostramos alerta acá porque Home puede seguir funcionando sin bloquear al usuario.
      console.error('Load games count error:', error);
    }
  };

  // useFocusEffect corre cada vez que la pantalla vuelve a estar activa.
  // Sirve para refrescar el contador después de agregar o eliminar juegos.
  useFocusEffect(
    useCallback(() => {
      loadGamesCount();
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* Tarjeta superior con resumen de la biblioteca. */}
      <View style={styles.heroCard}>
        <Text style={styles.title}>Tu biblioteca de videojuegos</Text>
        <Text style={styles.subtitle}>Gestiona tu colección, agrega nuevos títulos y revisa tu lista guardada.</Text>

        {/* Contador visual de videojuegos guardados. */}
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{gamesCount}</Text>
          <Text style={styles.statLabel}>{savedGamesText}</Text>
        </View>
      </View>

      {/* Botones principales de navegación. */}
      <View style={styles.actionSection}>
        <CustomButton title="Agregar videojuego" onPress={() => navigation.navigate('Form')} />
        <CustomButton title="Ver lista" onPress={() => navigation.navigate('List')} secondary />
        <CustomButton title="Cerrar sesión" onPress={() => navigation.navigate('Login')} danger />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fondo general de la pantalla.
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Tarjeta de presentación con título, descripción y contador.
  heroCard: {
    margin: 22,
    padding: 24,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  // Título grande de la pantalla principal.
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
  },
  // Texto de apoyo del título.
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 22,
  },
  // Caja interna que destaca el número de juegos guardados.
  statCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Número principal del contador.
  statNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
  },
  // Texto que acompaña al número del contador.
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  // Separación y ancho de la zona de acciones.
  actionSection: {
    marginHorizontal: 22,
    marginTop: 8,
  },
});
