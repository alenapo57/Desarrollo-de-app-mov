# My App

Aplicacion movil desarrollada con Expo y React Native para gestionar una biblioteca personal de videojuegos. Permite registrar usuarios, iniciar sesion, recuperar contrasena y administrar videojuegos guardados en una base de datos local SQLite.

## Funcionalidades

- Registro de usuarios.
- Inicio de sesion con validacion local.
- Recuperacion de contrasena por nombre de usuario.
- Pantalla principal con contador de videojuegos guardados.
- Alta de videojuegos con nombre, plataforma y genero.
- Listado de videojuegos guardados.
- Edicion y eliminacion de registros.
- Persistencia local usando `expo-sqlite`.

## Tecnologias usadas

- Expo `~54.0.33`
- React `19.1.0`
- React Native `0.81.5`
- React Navigation
- Expo SQLite
- React Native Gesture Handler
- React Native Reanimated
- React Native Web

## Requisitos previos

Antes de instalar el proyecto, asegurate de tener:

- Node.js instalado.
- npm instalado.
- Expo Go en el celular, si queres probar la app en un dispositivo fisico.
- Android Studio o Xcode, si queres ejecutar la app en emuladores.

## Instalacion

Desde la carpeta del proyecto:

```bash
cd my-app
npm install
```

El comando instala todas las dependencias declaradas en `package.json`.

## Ejecutar la app

Para iniciar el servidor de desarrollo de Expo:

```bash
npm start
```

Tambien se pueden usar estos comandos:

```bash
npm run android
npm run ios
npm run web
```

Comandos disponibles:

- `npm start`: inicia Expo Dev Server.
- `npm run android`: abre la app en Android.
- `npm run ios`: abre la app en iOS.
- `npm run web`: ejecuta la app en el navegador.

## Dependencias principales

```json
{
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/native-stack": "^7.14.11",
  "expo": "~54.0.33",
  "expo-sqlite": "~16.0.10",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "^2.31.1",
  "react-native-reanimated": "^4.3.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-web": "^0.21.0"
}
```

## Estructura del proyecto

```text
my-app/
+-- App.js
+-- index.js
+-- app.json
+-- package.json
+-- assets/
+-- components/
|   +-- CustomButton.js
|   +-- CustomInput.js
|   +-- theme.js
+-- database/
|   +-- db.js
+-- Screens/
    +-- FormScreen.js
    +-- HomeScreen.js
    +-- ListScreen.js
    +-- LoginScreen.js
    +-- RecoverPasswordScreen.js
    +-- RegisterScreen.js
```

## Base de datos

La app usa SQLite local mediante `expo-sqlite`. La base de datos se llama `miApp.db` y se inicializa automaticamente al abrir la aplicacion desde `App.js`.

Tablas creadas:

- `usuarios`: guarda `id`, `usuario` y `password`.
- `videojuegos`: guarda `id`, `nombre`, `plataforma` y `genero`.

Las funciones principales de acceso a datos estan en `database/db.js`:

- `initDatabase()`
- `registerUser(usuario, password)`
- `getUser(usuario)`
- `validateUser(usuario, password)`
- `recoverPassword(usuario)`
- `addGame(nombre, plataforma, genero)`
- `getGames()`
- `updateGame(id, nombre, plataforma, genero)`
- `deleteGame(id)`

## Navegacion

La navegacion esta configurada con `@react-navigation/native-stack` en `App.js`.

Pantallas principales:

- `Login`: inicio de sesion.
- `Register`: registro de usuario.
- `RecoverPassword`: recuperacion de contrasena.
- `Home`: pantalla principal con resumen.
- `Form`: formulario para registrar videojuegos.
- `List`: listado, edicion y eliminacion de videojuegos.

## Configuracion de Expo

El archivo `app.json` define:

- Nombre de la app: `my-app`.
- Orientacion vertical.
- Iconos y splash screen desde la carpeta `assets`.
- Soporte para tablet en iOS.
- `edgeToEdgeEnabled` en Android.
- Plugin `expo-sqlite`.

## Notas

- Los datos se guardan localmente en el dispositivo.
- La autenticacion es local y simple, pensada para fines practicos o academicos.
- Las contrasenas se almacenan sin cifrado, por lo que no debe usarse asi en produccion.
- La app no requiere backend externo.
