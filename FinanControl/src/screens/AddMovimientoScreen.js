import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { validateMovimientoForm } from '../utils/validators';
import { createMovimiento } from '../services/movimientoService';
import { getTodayISO } from '../utils/helpers';

const TIPOS = ['Ingreso', 'Gasto'];

const CATEGORIAS = {
  Ingreso: ['Sueldo', 'Freelance', 'Inversión', 'Otros'],
  Gasto: ['Alimentación', 'Combustible', 'Salud', 'Educación', 'Entretenimiento', 'Servicios', 'Ropa', 'Otros'],
};

export default function AddMovimientoScreen({ navigation, usuario }) {
  const [tipo, setTipo] = useState('Gasto');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(getTodayISO());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');

    const { valid, error: validationError } = validateMovimientoForm({
      tipo, categoria, monto, fecha
    });
    if (!valid) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await createMovimiento({
        usuario_id: usuario.id,
        tipo,
        categoria,
        descripcion,
        monto,
        fecha,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      Alert.alert('¡Listo!', 'Movimiento guardado correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            // Limpiar formulario
            setCategoria('');
            setDescripcion('');
            setMonto('');
            setFecha(getTodayISO());
            // Ir a movimientos
            navigation.navigate('Movimientos');
          },
        },
      ]);
    } catch (err) {
      console.error('handleSave error:', err);
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* Selector de Tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Movimiento</Text>
          <View style={styles.tipoContainer}>
            {TIPOS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tipoBtn,
                  tipo === t && (t === 'Ingreso' ? styles.tipoBtnIngreso : styles.tipoBtnGasto)
                ]}
                onPress={() => {
                  setTipo(t);
                  setCategoria('');
                }}
              >
                <MaterialIcons
                  name={t === 'Ingreso' ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={tipo === t ? colors.textWhite : colors.textSecondary}
                />
                <Text style={[
                  styles.tipoBtnText,
                  tipo === t && styles.tipoBtnTextActive
                ]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card del formulario */}
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Categorías */}
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriasGrid}>
            {CATEGORIAS[tipo].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoriaBtn,
                  categoria === cat && styles.categoriaBtnActive
                ]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={[
                  styles.categoriaBtnText,
                  categoria === cat && styles.categoriaBtnTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput
            label="Descripción (opcional)"
            icon="notes"
            placeholder="Ej: Almuerzo en el trabajo"
            value={descripcion}
            onChangeText={setDescripcion}
            autoCapitalize="sentences"
          />

          <CustomInput
            label="Monto"
            icon="attach-money"
            placeholder="0.00"
            value={monto}
            onChangeText={setMonto}
            keyboardType="decimal-pad"
          />

          <CustomInput
            label="Fecha"
            icon="calendar-today"
            placeholder="YYYY-MM-DD"
            value={fecha}
            onChangeText={setFecha}
          />

          <CustomButton
            title="Guardar Movimiento"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  tipoBtnIngreso: {
    backgroundColor: colors.income,
    borderColor: colors.income,
  },
  tipoBtnGasto: {
    backgroundColor: colors.expense,
    borderColor: colors.expense,
  },
  tipoBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipoBtnTextActive: {
    color: colors.textWhite,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoriaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  categoriaBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoriaBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoriaBtnTextActive: {
    color: colors.textWhite,
  },
  saveButton: {
    marginTop: 8,
  },
});