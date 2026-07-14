import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { formatDate } from '../utils/helpers';

export default function DatePickerInput({ label, value, onChange }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [show, setShow] = useState(false);

  const dateValue = value ? new Date(value + 'T00:00:00') : new Date();

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate.toISOString().split('T')[0]);
      }
    } else {
      if (selectedDate) {
        onChange(selectedDate.toISOString().split('T')[0]);
      }
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.inputWrapper} onPress={() => setShow(true)} activeOpacity={0.7}>
        <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} style={styles.icon} />
        <Text style={styles.dateText}>{value ? formatDate(value) : 'Seleccionar fecha'}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Android — picker directo */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS — modal con botón Listo */}
      {Platform.OS === 'ios' && (
        <Modal transparent visible={show} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
                <TouchableOpacity onPress={() => setShow(false)} style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>Listo</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={new Date()}
                style={styles.picker}
                textColor={colors.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  icon: { marginRight: 10 },
  dateText: { flex: 1, fontSize: 15, color: colors.textPrimary },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  doneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  doneBtnText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  picker: {
    width: '100%',
  },
});