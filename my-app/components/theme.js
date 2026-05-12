// Archivo central de estilos compartidos.
// Tener colores y sombras en un solo lugar evita repetir valores en cada pantalla.

// Paleta principal de la app.
export const COLORS = {
  // Color de fondo general de las pantallas.
  background: '#f4f8fb',

  // Color de tarjetas y superficies.
  surface: '#ffffff',

  // Colores principales usados en títulos, links y botones.
  primary: '#0d667a',
  primaryLight: '#1686a0',

  // Fondo suave para inputs o cajas internas.
  secondary: '#f7fafc',

  // Textos principales y secundarios.
  text: '#102a43',
  textSecondary: '#475569',

  // Bordes y placeholders.
  border: '#d6e0ea',
  placeholder: '#7a8fa6',

  // Estados especiales.
  danger: '#d62828',
  success: '#2f855a',
  accent: '#0d6efd',
};

// Escala de espaciado por si se quiere evitar números sueltos en estilos.
export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 28,
  xxl: 32,
};

// Sombras reutilizables para mantener profundidad consistente en toda la app.
export const SHADOWS = {
  // Sombra liviana para inputs, botones y tarjetas pequeñas.
  light: {
    shadowColor: '#102a43',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  // Sombra media para tarjetas principales.
  medium: {
    shadowColor: '#102a43',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
