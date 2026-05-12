import { registerRootComponent } from 'expo';

import App from './App';

// Punto de entrada de la aplicación.
// Expo usa este archivo para saber qué componente debe renderizar primero.
//
// registerRootComponent registra App como componente principal.
// También prepara el entorno para que funcione tanto en Expo Go
// como en una build nativa de Android/iOS.
registerRootComponent(App);
