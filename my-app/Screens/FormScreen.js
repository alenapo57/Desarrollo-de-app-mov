import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { addGame } from '../database/db';
import { COLORS, SHADOWS } from '../components/theme';

export default function FormScreen() {
  // Estados del formulario:
  // cada input tiene su propio estado para guardar lo que escribe el usuario.
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');

  // Esta función se ejecuta cuando el usuario toca el botón "Guardar".
  const handleSave = async () => {
    // Antes de guardar, se valida que ningún campo esté vacío.
    // trim() elimina espacios al principio y al final, así evitamos guardar "   ".
    if (!nombre.trim() || !plataforma.trim() || !genero.trim()) {
      Alert.alert('Error', 'Completa todos los campos del formulario.');
      return;
    }

    try {
      // Si los datos son válidos, se guardan en la base de datos local.
      await addGame(nombre.trim(), plataforma.trim(), genero.trim());
      Alert.alert('Guardado', 'El videojuego se guardó correctamente.');

      // Después de guardar, se limpian los inputs para cargar otro juego.
      setNombre('');
      setPlataforma('');
      setGenero('');
    } catch (error) {
      // Si ocurre un error, se informa al usuario y se deja el detalle en consola.
      Alert.alert('Error', 'No se pudo guardar el videojuego. Intenta de nuevo.');
      console.error('Save game error:', error);
    }
  };

  return (
    // KeyboardAvoidingView evita que el teclado tape el formulario.
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Permite cerrar el teclado tocando fuera de los inputs. */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* ScrollView ayuda en pantallas chicas o cuando el teclado ocupa mucho espacio. */}
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {/* Encabezado de la pantalla. */}
            <Text style={styles.title}>Registrar videojuego</Text>
            <Text style={styles.subtitle}>Completa el nombre, plataforma y género para guardar el registro.</Text>

            {/* Inputs reutilizables para cargar los datos del videojuego. */}
            <CustomInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. The Legend of Zelda" />
            <CustomInput label="Plataforma" value={plataforma} onChangeText={setPlataforma} placeholder="Ej. Nintendo Switch" />
            <CustomInput label="Género" value={genero} onChangeText={setGenero} placeholder="Ej. Aventura" />

            {/* Botón principal: dispara la validación y el guardado. */}
            <CustomButton title="Guardar" onPress={handleSave} style={styles.saveButton} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Ocupa toda la pantalla y aplica el color de fondo general.
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Contenedor del contenido; flexGrow permite que el ScrollView use toda la altura.
  container: {
    flexGrow: 1,
    padding: 22,
  },
  // Tarjeta principal donde viven el título, los campos y el botón.
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  // Título principal de la pantalla.
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  // Texto descriptivo debajo del título.
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 22,
    lineHeight: 21,
  },
  // Separación extra para que el botón no quede pegado al último input.
  saveButton: {
    marginTop: 8,
  },
});
