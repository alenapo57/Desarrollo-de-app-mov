/**
 * Funciones utilitarias generales de FinanControl.
 */

/**
 * Formatea un número como moneda argentina (ARS).
 * Ejemplo: 15000 → "$ 15.000,00"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$ 0,00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea una fecha ISO a formato legible en español.
 * Ejemplo: "2024-01-15" → "15 ene 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Retorna la fecha actual en formato YYYY-MM-DD.
 * Útil para valores por defecto en formularios.
 */
export const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Capitaliza la primera letra de un string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};