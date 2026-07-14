import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import DatePickerInput from './DatePickerInput';

const OPTIONS = [
  { key: 'todos', label: 'Todos', icon: 'all-inclusive' },
  { key: 'semana', label: 'Esta semana', icon: 'event' },
  { key: 'mes', label: 'Este mes', icon: 'calendar-month' },
  { key: 'personalizado', label: 'Personalizado', icon: 'date-range' },
];

/**
 * PeriodFilterModal
 * Bottom sheet para elegir el período de filtrado de movimientos.
 * "Semana" y "Mes" se aplican al toque; "Personalizado" despliega
 * dos DatePickerInput (reutilizando el componente existente) y un botón Aplicar.
 */
export default function PeriodFilterModal({
  visible,
  onClose,
  period,
  customDesde,
  customHasta,
  onApply,
}) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [selected, setSelected] = useState(period);
  const [desde, setDesde] = useState(customDesde);
  const [hasta, setHasta] = useState(customHasta);

  // Cada vez que se abre el modal, sincronizamos con el filtro activo actual.
  useEffect(() => {
    if (visible) {
      setSelected(period);
      setDesde(customDesde);
      setHasta(customHasta);
    }
  }, [visible, period, customDesde, customHasta]);

  const handleSelectOption = (key) => {
    setSelected(key);
    if (key !== 'personalizado') {
      onApply(key, null, null);
      onClose();
    }
  };

  const handleApplyCustom = () => {
    if (!desde || !hasta) return;
    onApply('personalizado', desde, hasta);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar por período</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={styles.option}
              onPress={() => handleSelectOption(opt.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.primary + '18' }]}>
                {opt.key === 'semana' ? (
                  // Calendario armado con Views (no un ícono de librería) para
                  // evitar el detalle de "doblez" que trae el ícono "event" de
                  // MaterialIcons. El "7" representa los 7 días de la semana.
                  <View style={styles.weekIconWrapper}>
                    <View style={[styles.weekIconStud, styles.weekIconStudLeft, { backgroundColor: colors.primary }]} />
                    <View style={[styles.weekIconStud, styles.weekIconStudRight, { backgroundColor: colors.primary }]} />
                    <View style={[styles.weekIconBody, { borderColor: colors.primary }]}>
                      <View style={[styles.weekIconHeader, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.weekNumber, { color: colors.primary }]}>7</Text>
                    </View>
                  </View>
                ) : (
                  <MaterialIcons name={opt.icon} size={20} color={colors.primary} />
                )}
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              {selected === opt.key && (
                <MaterialIcons name="check-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}

          {selected === 'personalizado' && (
            <View style={styles.customSection}>
              <DatePickerInput label="Desde" value={desde} onChange={setDesde} />
              <DatePickerInput label="Hasta" value={hasta} onChange={setHasta} />
              <TouchableOpacity
                style={[styles.applyBtn, (!desde || !hasta) && styles.applyBtnDisabled]}
                onPress={handleApplyCustom}
                disabled={!desde || !hasta}
                activeOpacity={0.85}
              >
                <Text style={styles.applyBtnText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 17, fontWeight: 'bold', color: colors.textPrimary },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  weekIconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  weekIconBody: {
    width: 18,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
  },
  weekIconHeader: {
    width: '100%',
    height: 4,
  },
  weekNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 11,
    marginTop: 1,
  },
  weekIconStud: {
    position: 'absolute',
    top: -1,
    width: 2,
    height: 4,
    borderRadius: 1,
  },
  weekIconStudLeft: { left: 4 },
  weekIconStudRight: { right: 4 },
  customSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  applyBtnDisabled: { opacity: 0.5 },
  applyBtnText: { color: colors.textWhite, fontWeight: '600', fontSize: 15 },
});