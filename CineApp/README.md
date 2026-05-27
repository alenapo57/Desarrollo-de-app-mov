# 🎬 CineApp — TP React Native

App móvil que consume la API de [The Movie Database (TMDB)](https://www.themoviedb.org) y muestra películas populares y mejor puntuadas con detalle de cada una.

---

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) instalado
- App **Expo Go** en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Cuenta en [TMDB](https://www.themoviedb.org) con una API Key

---

## 🚀 Instalación paso a paso

### 1. Crear el proyecto en blanco
```bash
npx create-expo-app@latest CineApp --template blank
cd CineApp
```

### 2. Instalar dependencias
```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

### 3. Copiar los archivos del proyecto

Reemplazá / agregá los siguientes archivos:

```
CineApp/
├── App.js                  ← reemplazar
├── config/
│   └── api.js              ← crear carpeta y archivo
├── components/
│   └── MovieCard.js        ← crear carpeta y archivo
└── screens/
    ├── HomeScreen.js       ← crear carpeta y archivo
    ├── TopRatedScreen.js   ← crear archivo
    ├── DetailScreen.js     ← crear archivo
    └── AboutScreen.js      ← crear archivo
```

### 4. Correr la app
```bash
npx expo start
```

Escaneá el QR con **Expo Go** desde tu celular (tiene que estar en la misma red Wi-Fi que la PC).

---

## 📱 Pantallas

### HomeScreen — Populares
- Lista de películas populares obtenidas desde la API de TMDB
- Muestra: poster, título, sinopsis resumida y puntaje
- Buscador para filtrar por nombre
- Al tocar una película navega al detalle

### TopRatedScreen — Mejor Puntuadas
- Lista de películas mejor puntuadas
- Misma estructura que HomeScreen, distinto endpoint
- Buscador para filtrar por nombre

### DetailScreen — Detalle
- Backdrop y poster de la película
- Título, título original y puntaje con cantidad de votos
- Badges de año, duración y clasificación
- Géneros, sinopsis completa, productoras, idioma, presupuesto y recaudación

### AboutScreen — Acerca de
- Información de la app y versión
- Tecnologías utilizadas
- Link directo a themoviedb.org
- Aviso legal de uso de la API de TMDB

---

## 🗂️ Estructura del proyecto

```
CineApp/
├── App.js                    → Drawer + Stack navigator
├── config/
│   └── api.js                → API Key y endpoints de TMDB
├── components/
│   └── MovieCard.js          → Componente reutilizable de tarjeta
└── screens/
    ├── HomeScreen.js         → Películas populares
    ├── TopRatedScreen.js     → Películas mejor puntuadas
    ├── DetailScreen.js       → Detalle de película
    └── AboutScreen.js        → Información de la app
```

---

## 🧭 Navegación

La app combina dos tipos de navegación:

- **Drawer Navigator** (menú hamburguesa ☰) → acceso a Populares, Mejor Puntuadas y Acerca de
- **Stack Navigator** → navegación hacia el Detalle de cada película

Para abrir el menú: tocar ☰ arriba a la izquierda, o deslizar desde el borde izquierdo de la pantalla.

---

## 🔑 API

Se usa la **API v3 de TMDB** con los siguientes endpoints:

| Endpoint | Pantalla |
|---|---|
| `/movie/popular` | HomeScreen |
| `/movie/top_rated` | TopRatedScreen |
| `/movie/{id}` | DetailScreen |

Parámetros: `api_key` y `language=es-AR`

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| React Native + Expo | Framework móvil |
| React Navigation (Drawer + Stack) | Navegación entre pantallas |
| fetch() | Consumo de la API REST |
| useState / useEffect | Manejo de estado y ciclo de vida |
| FlatList | Listado de películas |
