import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import MovimientoCard from '../components/MovimientoCard';
import { getMovimientos, deleteMovimiento } from '../services/movimientoService';

export default function MovimientosScreen({ navigation, usuario }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [movimientos, setMovimientos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMovimientos();
    }, [])
  );

  const loadMovimientos = async () => {
    setLoading(true);
    const result = await getMovimientos();
    if (result.success) {
      setMovimientos(result.data);
      setFiltered(result.data);
    }
    setLoading(false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text.trim()) { setFiltered(movimientos); return; }
    const lower = text.toLowerCase();
    setFiltered(movimientos.filter((m) =>
      m.categoria.toLowerCase().includes(lower) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(lower)) ||
      m.tipo.toLowerCase().includes(lower)
    ));
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar Movimiento', '¿Estás seguro que querés eliminar este movimiento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          const result = await deleteMovimiento(id);
          if (result.success) loadMovimientos();
          else Alert.alert('Error', result.error);
        },
      },
    ]);
  };

  const handleEdit = (movimiento) => {
    navigation.navigate('EditMovimiento', { movimiento });
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>Sin movimientos</Text>
      <Text style={styles.emptySubtitle}>
        {search ? 'No se encontraron resultados para tu búsqueda.' : 'No hay movimientos registrados todavía.'}
      </Text>
      {!search && (
        <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Agregar')}>
          <Text style={styles.emptyButtonText}>Agregar Movimiento</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por categoría o descripción..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={handleSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {!loading && (
        <Text style={styles.counter}>
          {filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovimientoCard
            movimiento={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { padding: 16, paddingBottom: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  counter: { fontSize: 13, color: colors.textSecondary, paddingHorizontal: 16, marginBottom: 8 },
  listContent: { padding: 16, paddingTop: 4, paddingBottom: 80 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  emptyButton: { marginTop: 24, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyButtonText: { color: colors.textWhite, fontWeight: '600', fontSize: 15 },
});
