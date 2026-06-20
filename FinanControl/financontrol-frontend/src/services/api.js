import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.101.5:8000';

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
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Error en la solicitud.');
  }

  return data;
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};