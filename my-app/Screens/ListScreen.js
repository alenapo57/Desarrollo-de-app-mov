import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { getGames, updateGame, deleteGame } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function ListScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');
  const savedGamesText = `${games.length} registro${games.length === 1 ? '' : 's'} guardado${games.length === 1 ? '' : 's'}`;

  // Trae los videojuegos guardados y controla el estado de carga.
  const loadGames = async () => {
    setLoading(true);
    try {
      const result = await getGames();
      setGames(result || []);
    } catch (error) {
      console.error('Load games error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGames();
    }, [])
  );

  const startEdit = (item) => {
    setEditId(item.id);
    setNombre(item.nombre);
    setPlataforma(item.plataforma);
    setGenero(item.genero);
  };

  const saveEdit = async () => {
    const trimmedName = nombre.trim();
    const trimmedPlatform = plataforma.trim();
    const trimmedGenre = genero.trim();

    if (!trimmedName || !trimmedPlatform || !trimmedGenre) {
      Alert.alert('Error', 'Completa todos los campos antes de guardar.');
      return;
    }

    try {
      await updateGame(editId, trimmedName, trimmedPlatform, trimmedGenre);
      Alert.alert('Actualizado', 'El registro se actualizó correctamente.');
      resetEdit();
      loadGames();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el registro. Intenta de nuevo.');
      console.error('Update game error:', error);
    }
  };

  const resetEdit = () => {
    setEditId(null);
    setNombre('');
    setPlataforma('');
    setGenero('');
  };

  const confirmDelete = (id) => {
    // La eliminación pide confirmación porque no se puede deshacer desde la app.
    Alert.alert('Eliminar registro', '¿Estás seguro de eliminar este videojuego?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGame(id);
      Alert.alert('Eliminado', 'El videojuego fue eliminado correctamente.');
      if (editId === id) {
        resetEdit();
      }
      loadGames();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el registro. Intenta de nuevo.');
      console.error('Delete game error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.nombre}</Text>
        <Text style={styles.itemText}>Plataforma: {item.plataforma}</Text>
        <Text style={styles.itemText}>Género: {item.genero}</Text>
      </View>
      <View style={styles.itemButtons}>
        <CustomButton title="Editar" onPress={() => startEdit(item)} style={styles.smallButton} />
        <CustomButton title="Eliminar" onPress={() => confirmDelete(item.id)} danger style={styles.smallButton} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Mis videojuegos</Text>
            <Text style={styles.subtitle}>{savedGamesText}</Text>
          </View>
          {editId && (
            <View style={styles.editContainer}>
              <Text style={styles.editTitle}>Editar videojuego</Text>
              <CustomInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Nombre del videojuego" />
              <CustomInput label="Plataforma" value={plataforma} onChangeText={setPlataforma} placeholder="Plataforma" />
              <CustomInput label="Género" value={genero} onChangeText={setGenero} placeholder="Género" />
              <View style={styles.editButtons}>
                <CustomButton title="Guardar" onPress={saveEdit} style={styles.largeButton} />
                <CustomButton title="Cancelar" onPress={resetEdit} secondary style={styles.largeButton} />
              </View>
            </View>
          )}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : games.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aún no hay videojuegos</Text>
              <Text style={styles.emptyText}>Agrega tu primer juego para comenzar a construir tu colección.</Text>
              <CustomButton title="Agregar uno" onPress={() => navigation.navigate('Form')} style={styles.addButton} />
            </View>
          ) : (
            <FlatList
              data={games}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 22,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 6,
    fontSize: 14,
  },
  editContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  list: {
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  itemInfo: {
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemText: {
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    flex: 1,
    marginVertical: 0,
    marginHorizontal: 4,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  largeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButton: {
    width: 150,
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
});
