import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Image, TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/helpers';
import { getResumenFinanciero } from '../services/movimientoService';
import { updateFotoPerfil, updateNombre } from '../services/authService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function ProfileOption({ icon, label, sublabel, onPress, color, showArrow = true, colors, styles }) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.optionIcon, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <View style={styles.optionInfo}>
        <Text style={styles.optionLabel}>{label}</Text>
        {sublabel ? <Text style={styles.optionSublabel}>{sublabel}</Text> : null}
      </View>
      {showArrow && <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation, usuario, onLogout }) {
  const { isDark, toggleTheme, colors } = useTheme();
  const styles = makeStyles(colors);

  const [resumen, setResumen] = useState({ saldo: 0, ingresos: 0, gastos: 0 });
  const [fotoPerfil, setFotoPerfil] = useState(usuario?.foto_perfil || null);
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreTemp, setNombreTemp] = useState(usuario?.nombre || '');
  const [guardandoNombre, setGuardandoNombre] = useState(false);

  useFocusEffect(useCallback(() => { loadResumen(); }, []));

  const loadResumen = async () => {
    const result = await getResumenFinanciero();
    if (result.success) setResumen(result.data);
  };

  const getInitials = (nombre) => {
    if (!nombre) return 'U';
    const parts = nombre.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const handleEditNombre = () => { setNombreTemp(nombre); setEditandoNombre(true); };
  const handleCancelNombre = () => { setNombreTemp(nombre); setEditandoNombre(false); };

  const handleGuardarNombre = async () => {
    if (!nombreTemp.trim()) { Alert.alert('Error', 'El nombre no puede estar vacío.'); return; }
    if (nombreTemp.trim() === nombre) { setEditandoNombre(false); return; }
    setGuardandoNombre(true);
    const result = await updateNombre(nombreTemp.trim());
    setGuardandoNombre(false);
    if (result.success) { setNombre(nombreTemp.trim()); setEditandoNombre(false); }
    else Alert.alert('Error', result.error || 'No se pudo actualizar el nombre.');
  };

  const handlePickImage = async () => {
    Alert.alert('Foto de Perfil', '¿Qué querés hacer?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Elegir de la galería',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) { const uri = result.assets[0].uri; setFotoPerfil(uri); await updateFotoPerfil(uri); }
        },
      },
      {
        text: 'Sacar una foto',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara.'); return; }
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) { const uri = result.assets[0].uri; setFotoPerfil(uri); await updateFotoPerfil(uri); }
        },
      },
      fotoPerfil ? { text: 'Eliminar foto', style: 'destructive', onPress: async () => { setFotoPerfil(null); await updateFotoPerfil(null); } } : null,
    ].filter(Boolean));
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que querés cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Avatar */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} activeOpacity={0.8}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(nombre)}</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <MaterialIcons name="camera-alt" size={14} color={colors.textWhite} />
          </View>
        </TouchableOpacity>
        <Text style={styles.nombreHeader}>{nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        <View style={styles.memberBadge}>
          <MaterialIcons name="verified" size={14} color={colors.primary} />
          <Text style={styles.memberText}>Miembro activo</Text>
        </View>
      </View>

      {/* Resumen */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Mi Resumen</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Saldo</Text>
            <Text style={[styles.statValue, { color: resumen.saldo >= 0 ? colors.income : colors.expense }]} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(resumen.saldo)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ingresos</Text>
            <Text style={[styles.statValue, { color: colors.income }]} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(resumen.ingresos)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gastos</Text>
            <Text style={[styles.statValue, { color: colors.expense }]} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(resumen.gastos)}
            </Text>
          </View>
        </View>
      </View>

      {/* Información de cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Cuenta</Text>
        <View style={styles.optionsCard}>
          <View style={styles.option}>
            <View style={[styles.optionIcon, { backgroundColor: colors.primary + '18' }]}>
              <MaterialIcons name="person-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Nombre</Text>
              {editandoNombre ? (
                <TextInput style={styles.nombreInput} value={nombreTemp} onChangeText={setNombreTemp} autoFocus autoCapitalize="words" returnKeyType="done" onSubmitEditing={handleGuardarNombre} />
              ) : (
                <Text style={styles.optionSublabel}>{nombre}</Text>
              )}
            </View>
            {editandoNombre ? (
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.editActionBtn} onPress={handleCancelNombre}>
                  <MaterialIcons name="close" size={20} color={colors.danger} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.editActionBtn, { marginLeft: 4 }]} onPress={handleGuardarNombre} disabled={guardandoNombre}>
                  <MaterialIcons name="check" size={20} color={guardandoNombre ? colors.textSecondary : colors.income} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editActionBtn} onPress={handleEditNombre}>
                <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.optionDivider} />
          <ProfileOption icon="email" label="Correo Electrónico" sublabel={usuario?.email} color={colors.secondary} showArrow={false} colors={colors} styles={styles} />
        </View>
      </View>

      {/* Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.optionsCard}>
          <View style={styles.option}>
            <View style={[styles.optionIcon, { backgroundColor: '#64748B18' }]}>
              <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={22} color={colors.textSecondary} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Modo Oscuro</Text>
              <Text style={styles.optionSublabel}>{isDark ? 'Activado' : 'Desactivado'}</Text>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={[styles.toggleBtn, { backgroundColor: isDark ? colors.primary : colors.border }]} activeOpacity={0.8}>
              <View style={[styles.toggleCircle, { transform: [{ translateX: isDark ? 20 : 2 }] }]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.section}>
        <View style={styles.optionsCard}>
          <ProfileOption icon="logout" label="Cerrar Sesión" color={colors.danger} onPress={handleLogout} showArrow={false} colors={colors} styles={styles} />
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

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  avatarContainer: { marginBottom: 16, position: 'relative' },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  avatarImage: { width: 88, height: 88, borderRadius: 44 },
  avatarText: { color: colors.textWhite, fontSize: 32, fontWeight: 'bold' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface },
  nombreHeader: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  email: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(37,99,235,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  memberText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  statsCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statItem: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 6, textAlign: 'center' },
  statValue: { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  optionsCard: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  optionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  optionSublabel: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  nombreInput: { fontSize: 13, color: colors.textPrimary, borderBottomWidth: 1.5, borderBottomColor: colors.primary, paddingVertical: 2, marginTop: 2 },
  editActions: { flexDirection: 'row', alignItems: 'center' },
  editActionBtn: { padding: 4 },
  optionDivider: { height: 1, backgroundColor: colors.border, marginLeft: 70 },
  toggleBtn: { width: 44, height: 26, borderRadius: 13, justifyContent: 'center', padding: 2 },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.textWhite },
  footer: { alignItems: 'center', paddingTop: 16 },
  footerText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  footerSubtext: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
