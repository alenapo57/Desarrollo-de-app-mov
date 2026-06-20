import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

/**
 * Registra un nuevo usuario via FastAPI.
 */
export const registerUser = async ({ nombre, email, password }) => {
  try {
    const data = await api.post('/usuarios/register', { nombre, email, password });
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
    return { success: true, user: data.usuario };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Autentica un usuario via FastAPI.
 */
export const loginUser = async ({ email, password }) => {
  try {
    const data = await api.post('/usuarios/login', { email, password });
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
    return { success: true, user: data.usuario };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Cierra sesión limpiando AsyncStorage.
 */
export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('usuario');
};

/**
 * Actualiza la foto de perfil del usuario.
 */
export const updateFotoPerfil = async (fotoPerfil) => {
  try {
    const data = await api.put('/usuarios/foto', { foto_perfil: fotoPerfil });
    const stored = await AsyncStorage.getItem('usuario');
    if (stored) {
      const usuario = JSON.parse(stored);
      usuario.foto_perfil = fotoPerfil;
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza el nombre del usuario.
 */
export const updateNombre = async (nombre) => {
  try {
    const data = await api.put('/usuarios/nombre', { nombre });
    const stored = await AsyncStorage.getItem('usuario');
    if (stored) {
      const usuario = JSON.parse(stored);
      usuario.nombre = nombre;
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
