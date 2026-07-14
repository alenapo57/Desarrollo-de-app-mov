import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import MovimientoCard from '../components/MovimientoCard';
import { SkeletonMovimientos } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import PeriodFilterModal from '../components/PeriodFilterModal';
import { getMovimientos, deleteMovimiento } from '../services/movimientoService';
import { filterMovimientosByPeriod } from '../utils/dateFilters';
import { formatDate } from '../utils/helpers';

const PERIOD_LABELS = {
  semana: 'Esta semana',
  mes: 'Este mes',
};

export default function MovimientosScreen({ navigation, usuario }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [movimientos, setMovimientos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [period, setPeriod] = useState('todos');
  const [customDesde, setCustomDesde] = useState(null);
  const [customHasta, setCustomHasta] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadMovimientos();
    }, [])
  );

  // Recalcula la lista filtrada cada vez que cambian los datos, la búsqueda
  // de texto o el filtro de período. Ambos filtros se combinan (AND).
  useEffect(() => {
    let result = filterMovimientosByPeriod(movimientos, period, customDesde, customHasta);

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter((m) =>
        m.categoria.toLowerCase().includes(lower) ||
        (m.descripcion && m.descripcion.toLowerCase().includes(lower)) ||
        m.tipo.toLowerCase().includes(lower)
      );
    }

    setFiltered(result);
  }, [movimientos, search, period, customDesde, customHasta]);

  const loadMovimientos = async () => {
    setLoading(true);
    const result = await getMovimientos();
    if (result.success) {
      setMovimientos(result.data);
    }
    setLoading(false);
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

  const handleApplyFilter = (newPeriod, desde, hasta) => {
    setPeriod(newPeriod);
    setCustomDesde(desde);
    setCustomHasta(hasta);
  };

  const handleClearFilter = () => {
    setPeriod('todos');
    setCustomDesde(null);
    setCustomHasta(null);
  };

  const getFilterChipLabel = () => {
    if (period === 'personalizado' && customDesde && customHasta) {
      return `${formatDate(customDesde)} - ${formatDate(customHasta)}`;
    }
    return PERIOD_LABELS[period];
  };

  const hasActiveFilter = period !== 'todos';

  if (loading) {
    return <SkeletonMovimientos />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por categoría o descripción..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilter && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="filter-list"
            size={22}
            color={hasActiveFilter ? colors.textWhite : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {hasActiveFilter && (
        <View style={styles.filterChipRow}>
          <View style={styles.filterChip}>
            <MaterialIcons name="event" size={14} color={colors.primary} />
            <Text style={styles.filterChipText}>{getFilterChipLabel()}</Text>
            <TouchableOpacity onPress={handleClearFilter} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <MaterialIcons name="close" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.counter}>
        {filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}
      </Text>

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
        ListEmptyComponent={
          <EmptyState
            icon={search || hasActiveFilter ? 'search-off' : 'receipt-long'}
            title="Sin movimientos"
            subtitle={
              search || hasActiveFilter
                ? 'No se encontraron resultados para este filtro.'
                : 'No hay movimientos registrados todavía.'
            }
            actionLabel={!search && !hasActiveFilter ? 'Agregar Movimiento' : undefined}
            onAction={!search && !hasActiveFilter ? () => navigation.navigate('Agregar') : undefined}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <PeriodFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        period={period}
        customDesde={customDesde}
        customHasta={customHasta}
        onApply={handleApplyFilter}
      />
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flex: 1,
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
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipRow: { paddingHorizontal: 16, marginBottom: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '18',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  filterChipText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  counter: { fontSize: 13, color: colors.textSecondary, paddingHorizontal: 16, marginBottom: 8 },
  listContent: { padding: 16, paddingTop: 4, paddingBottom: 80 },
});