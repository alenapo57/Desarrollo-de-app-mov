import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/helpers';
import { getResumenFinanciero } from '../services/movimientoService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function ProfileOption({ icon, label, sublabel, onPress, color, showArrow = true }) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.optionIcon, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <View style={styles.optionInfo}>
        <Text style={styles.optionLabel}>{label}</Text>
        {sublabel ? <Text style={styles.optionSublabel}>{sublabel}</Text> : null}
      </View>
      {showArrow && (
        <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation, usuario, onLogout }) {
  const [resumen, setResumen] = useState({ saldo: 0, ingresos: 0, gastos: 0 });

  useFocusEffect(
    useCallback(() => {
      loadResumen();
    }, [])
  );

  const loadResumen = async () => {
    const result = await getResumenFinanciero(usuario.id);
    if (result.success) setResumen(result.data);
  };

  const getInitials = (nombre) => {
    if (!nombre) return 'U';
    const parts = nombre.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar y datos */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(usuario?.nombre)}
            </Text>
          </View>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>

        {/* Badge miembro */}
        <View style={styles.memberBadge}>
          <MaterialIcons name="verified" size={14} color={colors.primary} />
          <Text style={styles.memberText}>Miembro activo</Text>
        </View>
      </View>

      {/* Resumen financiero */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Mi Resumen</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Saldo</Text>
            <Text style={[
              styles.statValue,
              { color: resumen.saldo >= 0 ? colors.income : colors.expense }
            ]}>
              {formatCurrency(resumen.saldo)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ingresos</Text>
            <Text style={[styles.statValue, { color: colors.income }]}>
              {formatCurrency(resumen.ingresos)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gastos</Text>
            <Text style={[styles.statValue, { color: colors.expense }]}>
              {formatCurrency(resumen.gastos)}
            </Text>
          </View>
        </View>
      </View>

      {/* Información de cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Cuenta</Text>
        <View style={styles.optionsCard}>
          <ProfileOption
            icon="person-outline"
            label="Nombre"
            sublabel={usuario?.nombre}
            color={colors.primary}
            showArrow={false}
          />
          <View style={styles.optionDivider} />
          <ProfileOption
            icon="email"
            label="Correo Electrónico"
            sublabel={usuario?.email}
            color={colors.secondary}
            showArrow={false}
          />
        </View>
      </View>

      {/* Actividad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi Actividad</Text>
        <View style={styles.optionsCard}>
          <ProfileOption
            icon="list"
            label="Ver Movimientos"
            sublabel="Historial completo"
            color={colors.primary}
            onPress={() => navigation.navigate('Movimientos')}
          />
          <View style={styles.optionDivider} />
          <ProfileOption
            icon="add-circle-outline"
            label="Agregar Movimiento"
            sublabel="Registrar ingreso o gasto"
            color={colors.income}
            onPress={() => navigation.navigate('AddMovimiento')}
          />
        </View>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.section}>
        <View style={styles.optionsCard}>
          <ProfileOption
            icon="logout"
            label="Cerrar Sesión"
            color={colors.danger}
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>FinanControl v1.0.0</Text>
        <Text style={styles.footerSubtext}>Tu finanzas bajo control 💰</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 32,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37,99,235,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  optionSublabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 70,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});