import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency, formatDate } from '../utils/helpers';

const CATEGORY_ICONS = {
  'Alimentación': 'restaurant',
  'Transporte': 'directions-car',
  'Salud': 'local-hospital',
  'Educación': 'school',
  'Entretenimiento': 'movie',
  'Servicios': 'home',
  'Combustible': 'local-gas-station',
  'Ropa': 'checkroom',
  'Sueldo': 'payments',
  'Freelance': 'computer',
  'Inversión': 'trending-up',
  'Otros': 'attach-money',
};

// Color de identidad por categoría (independiente de si es ingreso o gasto).
// El verde/rojo se reserva únicamente para el monto.
const CATEGORY_COLORS = {
  'Alimentación': '#F97316',   // naranja
  'Transporte': '#3B82F6',     // azul
  'Salud': '#F43F5E',          // rosa/rojo
  'Educación': '#8B5CF6',      // violeta
  'Entretenimiento': '#D946EF', // fucsia
  'Servicios': '#14B8A6',      // teal
  'Combustible': '#F59E0B',    // ámbar
  'Ropa': '#06B6D4',           // cian
  'Sueldo': '#22C55E',         // verde
  'Freelance': '#0EA5E9',      // celeste
  'Inversión': '#10B981',      // esmeralda
  'Otros': '#64748B',          // gris
};

// Convierte un color hex (#RRGGBB) a rgba con la opacidad indicada,
// para el fondo suave del ícono.
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MovimientoCard({ movimiento, onEdit, onDelete }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tipo, categoria, descripcion, monto, fecha } = movimiento;
  const isIngreso = tipo === 'Ingreso';
  const iconName = CATEGORY_ICONS[categoria] || 'attach-money';
  const categoryColor = CATEGORY_COLORS[categoria] || colors.textSecondary;

  const handleEditPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  };

  const handleDeletePress = () => {
    // Impacto más fuerte: es una acción destructiva.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: hexToRgba(categoryColor, 0.14) }]}>
        <MaterialIcons name={iconName} size={22} color={categoryColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.categoria}>{categoria}</Text>
        {descripcion ? <Text style={styles.descripcion} numberOfLines={1}>{descripcion}</Text> : null}
        <Text style={styles.fecha}>{formatDate(fecha)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.monto, { color: isIngreso ? colors.income : colors.expense }]}>
          {isIngreso ? '+' : '-'}{formatCurrency(monto)}
        </Text>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={handleEditPress} style={styles.actionBtn}>
              <MaterialIcons name="edit" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={handleDeletePress} style={styles.actionBtn}>
              <MaterialIcons name="delete" size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  categoria: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  descripcion: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  fecha: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  right: { alignItems: 'flex-end' },
  monto: { fontSize: 15, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 6 },
  actionBtn: { padding: 4, marginLeft: 4 },
});