import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import MovimientoCard from '../components/MovimientoCard';
import { getResumenFinanciero, getRecentMovimientos } from '../services/movimientoService';
import { formatCurrency } from '../utils/helpers';

function SummaryCard({ title, amount, icon, color, background }) {
  return (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <View style={[styles.summaryIconContainer, { backgroundColor: background }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryAmount, { color }]}>{formatCurrency(amount)}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation, usuario }) {
  const [resumen, setResumen] = useState({ saldo: 0, ingresos: 0, gastos: 0 });
  const [recientes, setRecientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [resumenResult, recientesResult] = await Promise.all([
      getResumenFinanciero(usuario.id),
      getRecentMovimientos(usuario.id, 5),
    ]);

    if (resumenResult.success) setResumen(resumenResult.data);
    if (recientesResult.success) setRecientes(recientesResult.data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getSaldoColor = () => {
    if (resumen.saldo > 0) return colors.income;
    if (resumen.saldo < 0) return colors.expense;
    return colors.textSecondary;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      {/* Saludo */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>
          {getGreeting()}, {usuario?.nombre?.split(' ')[0]} 👋
        </Text>
        <Text style={styles.greetingSubtitle}>
          Aquí está tu resumen financiero
        </Text>
      </View>

      {/* Card principal — Saldo */}
      <View style={styles.saldoCard}>
        <View style={styles.saldoHeader}>
          <Text style={styles.saldoLabel}>Saldo Actual</Text>
          <View style={styles.saldoBadge}>
            <MaterialIcons name="account-balance-wallet" size={16} color={colors.textWhite} />
          </View>
        </View>
        <Text style={[styles.saldoAmount, { color: getSaldoColor() }]}>
          {formatCurrency(resumen.saldo)}
        </Text>
        <Text style={styles.saldoHint}>
          {resumen.saldo >= 0
            ? 'Vas bien, seguí así 💪'
            : 'Tus gastos superan tus ingresos'}
        </Text>
      </View>

      {/* Cards de resumen */}
      <View style={styles.summaryRow}>
        <SummaryCard
          title="Ingresos"
          amount={resumen.ingresos}
          icon="trending-up"
          color={colors.income}
          background="rgba(34,197,94,0.1)"
        />
        <SummaryCard
          title="Gastos"
          amount={resumen.gastos}
          icon="trending-down"
          color={colors.expense}
          background="rgba(239,68,68,0.1)"
        />
      </View>

      {/* Últimos movimientos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Movimientos')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {recientes.length === 0 ? (
          <View style={styles.emptySection}>
            <MaterialIcons name="receipt-long" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No hay movimientos todavía</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddMovimiento')}
            >
              <Text style={styles.emptyButtonText}>Agregar primero</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recientes.map((item) => (
            <MovimientoCard
              key={item.id}
              movimiento={item}
            />
          ))
        )}
      </View>

      {/* Accesos rápidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddMovimiento')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(37,99,235,0.1)' }]}>
              <MaterialIcons name="add-circle" size={26} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Agregar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Movimientos')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(14,165,233,0.1)' }]}>
              <MaterialIcons name="list" size={26} color={colors.secondary} />
            </View>
            <Text style={styles.quickActionText}>Movimientos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <MaterialIcons name="person" size={26} color={colors.income} />
            </View>
            <Text style={styles.quickActionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 32,
  },
  greetingSection: {
    marginBottom: 20,
    marginTop: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saldoCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saldoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saldoLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  saldoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saldoAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 8,
  },
  saldoHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});