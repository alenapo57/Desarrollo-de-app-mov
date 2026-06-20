import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

export default function MovimientoCard({ movimiento, onEdit, onDelete }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tipo, categoria, descripcion, monto, fecha } = movimiento;
  const isIngreso = tipo === 'Ingreso';
  const iconName = CATEGORY_ICONS[categoria] || 'attach-money';

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, {
        backgroundColor: isIngreso ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'
      }]}>
        <MaterialIcons name={iconName} size={22} color={isIngreso ? colors.income : colors.expense} />
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
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <MaterialIcons name="edit" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
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
