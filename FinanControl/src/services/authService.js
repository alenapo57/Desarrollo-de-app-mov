import { getDatabase } from '../database/database';

/**
 * Registra un nuevo usuario.
 * Retorna { success: boolean, user?: object, error?: string }
 */
export const registerUser = async ({ nombre, email, password }) => {
  try {
    const db = await getDatabase();

    // Verificar si el email ya existe
    const existing = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing) {
      return { success: false, error: 'Ya existe una cuenta con ese email.' };
    }

    // Insertar usuario
    const result = await db.runAsync(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre.trim(), email.toLowerCase().trim(), password]
    );

    const newUser = await db.getFirstAsync(
      'SELECT id, nombre, email FROM usuarios WHERE id = ?',
      [result.lastInsertRowId]
    );

    return { success: true, user: newUser };
  } catch (error) {
    console.error('registerUser error:', error);
    return { success: false, error: 'Error al registrar usuario.' };
  }
};

/**
 * Autentica un usuario con email y contraseña.
 * Retorna { success: boolean, user?: object, error?: string }
 */
export const loginUser = async ({ email, password }) => {
  try {
    const db = await getDatabase();

    const user = await db.getFirstAsync(
      'SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?',
      [email.toLowerCase().trim(), password]
    );

    if (!user) {
      return { success: false, error: 'Email o contraseña incorrectos.' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('loginUser error:', error);
    return { success: false, error: 'Error al iniciar sesión.' };
  }
};

/**
 * Obtiene un usuario por ID.
 */
export const getUserById = async (id) => {
  try {
    const db = await getDatabase();
    const user = await db.getFirstAsync(
      'SELECT id, nombre, email FROM usuarios WHERE id = ?',
      [id]
    );
    return user || null;
  } catch (error) {
    console.error('getUserById error:', error);
    return null;
  }
};