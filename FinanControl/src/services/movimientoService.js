import { getDatabase } from '../database/database';

/**
 * Crea un nuevo movimiento.
 */
export const createMovimiento = async ({ usuario_id, tipo, categoria, descripcion, monto, fecha }) => {
  try {
    const db = await getDatabase();

    const result = await db.runAsync(
      `INSERT INTO movimientos 
        (usuario_id, tipo, categoria, descripcion, monto, fecha) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usuario_id, tipo, categoria, descripcion || '', parseFloat(monto), fecha]
    );

    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error('createMovimiento error:', error);
    return { success: false, error: 'Error al guardar el movimiento.' };
  }
};

/**
 * Obtiene todos los movimientos de un usuario, ordenados por fecha descendente.
 */
export const getMovimientos = async (usuario_id) => {
  try {
    const db = await getDatabase();

    const movimientos = await db.getAllAsync(
      `SELECT * FROM movimientos 
       WHERE usuario_id = ? 
       ORDER BY fecha DESC, id DESC`,
      [usuario_id]
    );

    return { success: true, data: movimientos };
  } catch (error) {
    console.error('getMovimientos error:', error);
    return { success: false, data: [], error: 'Error al obtener movimientos.' };
  }
};

/**
 * Obtiene los últimos N movimientos de un usuario.
 */
export const getRecentMovimientos = async (usuario_id, limit = 5) => {
  try {
    const db = await getDatabase();

    const movimientos = await db.getAllAsync(
      `SELECT * FROM movimientos 
       WHERE usuario_id = ? 
       ORDER BY fecha DESC, id DESC 
       LIMIT ?`,
      [usuario_id, limit]
    );

    return { success: true, data: movimientos };
  } catch (error) {
    console.error('getRecentMovimientos error:', error);
    return { success: false, data: [], error: 'Error al obtener movimientos recientes.' };
  }
};

/**
 * Actualiza un movimiento existente.
 */
export const updateMovimiento = async ({ id, tipo, categoria, descripcion, monto, fecha }) => {
  try {
    const db = await getDatabase();

    await db.runAsync(
      `UPDATE movimientos 
       SET tipo = ?, categoria = ?, descripcion = ?, monto = ?, fecha = ?
       WHERE id = ?`,
      [tipo, categoria, descripcion || '', parseFloat(monto), fecha, id]
    );

    return { success: true };
  } catch (error) {
    console.error('updateMovimiento error:', error);
    return { success: false, error: 'Error al actualizar el movimiento.' };
  }
};

/**
 * Elimina un movimiento por ID.
 */
export const deleteMovimiento = async (id) => {
  try {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM movimientos WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('deleteMovimiento error:', error);
    return { success: false, error: 'Error al eliminar el movimiento.' };
  }
};

/**
 * Calcula el resumen financiero de un usuario.
 * Retorna { saldo, ingresos, gastos }
 */
export const getResumenFinanciero = async (usuario_id) => {
  try {
    const db = await getDatabase();

    const result = await db.getFirstAsync(
      `SELECT
        COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'Gasto'   THEN monto ELSE 0 END), 0) AS gastos
       FROM movimientos
       WHERE usuario_id = ?`,
      [usuario_id]
    );

    const ingresos = result?.ingresos || 0;
    const gastos = result?.gastos || 0;

    return {
      success: true,
      data: {
        ingresos,
        gastos,
        saldo: ingresos - gastos,
      },
    };
  } catch (error) {
    console.error('getResumenFinanciero error:', error);
    return {
      success: false,
      data: { ingresos: 0, gastos: 0, saldo: 0 },
    };
  }
};