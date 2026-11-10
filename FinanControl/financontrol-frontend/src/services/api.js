import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_PORT = 8000;

// En desarrollo, Expo sabe desde dónde se sirve la app (hostUri):
//  - `npx expo start`          → "192.168.x.x:8081" (IP de la PC en la red local)
//  - `npx expo start --tunnel` → "xxxx.exp.direct"  (dirección pública del túnel de Expo)
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
const esIpLocal = /^\d{1,3}(\.\d{1,3}){3}$/.test(devHost ?? '');

// Red local: el backend corre en la misma PC que Metro, así que usamos esa IP
// (es lo más rápido y funciona en cualquier PC sin editar nada).
// Túnel: los celulares de otras personas no llegan a tu IP local, así que usamos
// la URL pública del backend (túnel de ngrok), definida en EXPO_PUBLIC_API_URL
// dentro de financontrol-frontend/.env.local (está en el .gitignore).
const BASE_URL = esIpLocal
  ? `http://${devHost}:${API_PORT}`
  : process.env.EXPO_PUBLIC_API_URL || `http://localhost:${API_PORT}`;

/**
 * Cliente HTTP centralizado para FinanControl API.
 * Maneja automáticamente el token JWT en cada request.
 */

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

const request = async (endpoint, options = {}) => {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    // ngrok gratis puede responder con una página HTML de advertencia en vez de
    // pasar el pedido a la API; este header le indica que la saltee.
    'ngrok-skip-browser-warning': 'true',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Algunas respuestas (ej: DELETE) vuelven con body vacío (204/200 sin
  // contenido). Leer como texto primero evita que JSON.parse explote con
  // "Unexpected end of input" cuando no hay nada que parsear.
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.detail || 'Error en la solicitud.');
  }

  return data;
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};