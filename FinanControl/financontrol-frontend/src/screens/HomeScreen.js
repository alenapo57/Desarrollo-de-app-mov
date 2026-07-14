import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import MovimientoCard from '../components/MovimientoCard';
import { SkeletonHome } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { getResumenFinanciero, getRecentMovimientos } from '../services/movimientoService';
import { formatCurrency } from '../utils/helpers';
import { useCountUp } from '../utils/useCountUp';

function SummaryCard({ title, amount, icon, color, background, colors }) {
  const styles = makeStyles(colors);
  const animatedAmount = useCountUp(amount);

  return (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <View style={[styles.summaryIconContainer, { backgroundColor: background }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryAmount, { color }]}>{formatCurrency(animatedAmount)}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation, usuario }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [resumen, setResumen] = useState({ saldo: 0, ingresos: 0, gastos: 0 });
  const [recientes, setRecientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const animatedSaldo = useCountUp(resumen.saldo);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const [resumenResult, recientesResult] = await Promise.all([
          getResumenFinanciero(),
          getRecentMovimientos(),
        ]);
        if (isActive) {
          if (resumenResult.success) setResumen(resumenResult.data);
          if (recientesResult.success) setRecientes(recientesResult.data);
          setLoading(false);
        }
      };

      fetchData();

      return () => { isActive = false; };
    }, [])
  );

  const loadData = async () => {
    const [resumenResult, recientesResult] = await Promise.all([
      getResumenFinanciero(),
      getRecentMovimientos(),
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

  if (loading) {
    return <SkeletonHome />;
  }

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

      {/* Card principal — Saldo (con gradiente) */}
      <View style={styles.saldoCardShadow}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saldoCard}
        >
          <View style={styles.saldoHeader}>
            <Text style={styles.saldoLabel}>Saldo Actual</Text>
            <View style={styles.saldoBadge}>
              <MaterialIcons name="account-balance-wallet" size={16} color={colors.textWhite} />
            </View>
          </View>
          <Text style={styles.saldoAmount}>
            {formatCurrency(animatedSaldo)}
          </Text>
          <Text style={styles.saldoHint}>
            {resumen.saldo >= 0
              ? 'Vas bien, seguí así '
              : 'Tus gastos superan tus ingresos'}
          </Text>
        </LinearGradient>
      </View>

      {/* Cards de resumen */}
      <View style={styles.summaryRow}>
        <SummaryCard
          title="Ingresos"
          amount={resumen.ingresos}
          icon="trending-up"
          color={colors.income}
          background="rgba(34,197,94,0.1)"
          colors={colors}
        />
        <SummaryCard
          title="Gastos"
          amount={resumen.gastos}
          icon="trending-down"
          color={colors.expense}
          background="rgba(239,68,68,0.1)"
          colors={colors}
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
          <EmptyState
            icon="receipt-long"
            title="No hay movimientos todavía"
            subtitle="Registrá tu primer ingreso o gasto para empezar a ver tu resumen."
            actionLabel="Agregar primero"
            onAction={() => navigation.navigate('Agregar')}
          />
        ) : (
          recientes.map((item) => (
            <MovimientoCard
              key={item.id}
              movimiento={item}
              colors={colors}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
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
  saldoCardShadow: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saldoCard: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
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
});