/**
 * Validaciones reutilizables para formularios de FinanControl.
 */

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const doPasswordsMatch = (password, confirm) => {
  return password === confirm;
};

export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

/**
 * Valida el formulario de registro completo.
 * Retorna { valid: boolean, error: string | null }
 */
export const validateRegisterForm = ({ nombre, email, password, confirmPassword }) => {
  if (!isNotEmpty(nombre)) return { valid: false, error: 'El nombre es obligatorio.' };
  if (!isNotEmpty(email)) return { valid: false, error: 'El email es obligatorio.' };
  if (!isValidEmail(email)) return { valid: false, error: 'El email no tiene un formato válido.' };
  if (!isValidPassword(password)) return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  if (!doPasswordsMatch(password, confirmPassword)) return { valid: false, error: 'Las contraseñas no coinciden.' };
  return { valid: true, error: null };
};

/**
 * Valida el formulario de login.
 */
export const validateLoginForm = ({ email, password }) => {
  if (!isNotEmpty(email)) return { valid: false, error: 'El email es obligatorio.' };
  if (!isValidEmail(email)) return { valid: false, error: 'El email no tiene un formato válido.' };
  if (!isNotEmpty(password)) return { valid: false, error: 'La contraseña es obligatoria.' };
  return { valid: true, error: null };
};

/**
 * Valida el formulario de movimiento.
 */
export const validateMovimientoForm = ({ tipo, categoria, monto, fecha }) => {
  if (!isNotEmpty(tipo)) return { valid: false, error: 'El tipo es obligatorio.' };
  if (!isNotEmpty(categoria)) return { valid: false, error: 'La categoría es obligatoria.' };
  if (!isValidAmount(monto)) return { valid: false, error: 'El monto debe ser un número mayor a 0.' };
  if (!isNotEmpty(fecha)) return { valid: false, error: 'La fecha es obligatoria.' };
  return { valid: true, error: null };
};