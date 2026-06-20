import { api } from './api';

/**
 * Obtiene todos los movimientos del usuario autenticado.
 */
export const getMovimientos = async () => {
  try {
    const data = await api.get('/movimientos/');
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Obtiene los últimos 5 movimientos.
 */
export const getRecentMovimientos = async () => {
  try {
    const data = await api.get('/movimientos/recientes');
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Obtiene el resumen financiero del usuario autenticado.
 */
export const getResumenFinanciero = async () => {
  try {
    const data = await api.get('/movimientos/resumen');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      data: { ingresos: 0, gastos: 0, saldo: 0 },
      error: error.message,
    };
  }
};

/**
 * Crea un nuevo movimiento.
 */
export const createMovimiento = async ({ tipo, categoria, descripcion, monto, fecha }) => {
  try {
    const data = await api.post('/movimientos/', { tipo, categoria, descripcion, monto: parseFloat(monto), fecha });
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza un movimiento existente.
 */
export const updateMovimiento = async ({ id, tipo, categoria, descripcion, monto, fecha }) => {
  try {
    await api.put(`/movimientos/${id}`, { tipo, categoria, descripcion, monto: parseFloat(monto), fecha });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Elimina un movimiento por ID.
 */
export const deleteMovimiento = async (id) => {
  try {
    await api.delete(`/movimientos/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};