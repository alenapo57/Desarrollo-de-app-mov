# CONTEXTO COMPLETO — PROYECTO FINANCONTROL

## RESUMEN EJECUTIVO

**Objetivo:** App móvil de finanzas personales llamada FinanControl desarrollada con React Native (Expo) + FastAPI + PostgreSQL.

**Estado actual:** Proyecto completo y funcionando. Se implementaron todas las fases del desarrollo incluyendo autenticación JWT, CRUD de movimientos, modo oscuro, foto de perfil, Bottom Tab Navigator y skeleton loaders (en proceso de entrega).

**Próximos pasos pendientes:**

- Entregar archivos de skeleton loaders (SkeletonLoader.js, HomeScreen.js, MovimientosScreen.js)
- Animación de números en el dashboard
- Animaciones de transición entre tabs
- Íconos de categoría coloridos
- Gradiente en la card de saldo
- Feedback táctil en cards
- Animación en el toggle de modo oscuro
- Empty state ilustrado

---

## CONTEXTO GENERAL

FinanControl es una app móvil para administrar gastos personales. El usuario puede registrarse, iniciar sesión, registrar ingresos/gastos, editar/eliminar movimientos, consultar saldo y visualizar resumen financiero. El objetivo final es publicarla en Google Play.

---

## STACK TECNOLÓGICO

### Frontend

| Tecnología                               | Versión                         |
| ----------------------------------------- | -------------------------------- |
| Expo SDK                                  | 54.0.34                          |
| React Native                              | 0.81.5                           |
| React                                     | 19.1.0                           |
| @react-navigation/native                  | ^6.1.18                          |
| @react-navigation/bottom-tabs             | ^6.6.1                           |
| @react-navigation/stack                   | ^6.4.1                           |
| react-native-reanimated                   | 3.10.1 (FIJADO — no actualizar) |
| react-native-gesture-handler              | ~2.28.0                          |
| react-native-safe-area-context            | ~5.6.0                           |
| react-native-screens                      | ~4.16.0                          |
| @react-native-async-storage/async-storage | 2.2.0                            |
| expo-sqlite                               | ~16.0.10                         |
| expo-status-bar                           | ~3.0.9                           |
| expo-image-picker                         | última compatible               |
| @react-native-community/datetimepicker    | última compatible               |

### Backend

| Tecnología               | Versión                        |
| ------------------------- | ------------------------------- |
| FastAPI                   | última                         |
| Uvicorn                   | última                         |
| SQLAlchemy                | 2.x                             |
| psycopg2-binary           | última                         |
| python-dotenv             | última                         |
| passlib[bcrypt]           | última                         |
| bcrypt                    | 4.0.1 (FIJADO — no actualizar) |
| python-jose[cryptography] | última                         |
| pydantic[email]           | última                         |

### Base de datos

- PostgreSQL 18.4
- Base de datos: `financontrol`

### Entorno

- Windows 11, PowerShell
- VS Code
- Android Studio (emulador Pixel 9)
- Python 3.10+
- IP local: 192.168.101.5

---

## ESTRUCTURA DEL PROYECTO

```
FinanControl/                          ← raíz del repositorio Git
├── financontrol-frontend/
│   ├── App.js
│   ├── app.json
│   ├── index.js
│   ├── babel.config.js
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── CustomButton.js
│       │   ├── CustomInput.js
│       │   ├── DatePickerInput.js
│       │   ├── MovimientoCard.js
│       │   └── SkeletonLoader.js       ← NUEVO (pendiente de colocar)
│       ├── navigation/
│       │   ├── RootNavigator.js
│       │   ├── AuthNavigator.js
│       │   └── BottomTabNavigator.js
│       ├── screens/
│       │   ├── SplashScreen.js
│       │   ├── LoginScreen.js
│       │   ├── RegisterScreen.js
│       │   ├── HomeScreen.js           ← actualizado con skeleton
│       │   ├── MovimientosScreen.js    ← actualizado con skeleton
│       │   ├── AddMovimientoScreen.js
│       │   ├── EditMovimientoScreen.js
│       │   └── ProfileScreen.js
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   └── movimientoService.js
│       ├── theme/
│       │   ├── colors.js
│       │   └── ThemeContext.js
│       └── utils/
│           ├── validators.js
│           └── helpers.js
└── financontrol-backend/
    ├── main.py
    ├── database.py
    ├── models.py
    ├── schemas.py
    ├── auth.py
    ├── requirements.txt
    ├── .env
    └── routers/
        ├── __init__.py
        ├── usuarios.py
        └── movimientos.py
```

---

## GIT

- **Rama main:** versión SQLite completa (backup, no tocar)
- **Rama fastapi-migration:** versión activa con FastAPI + PostgreSQL
- Último commit: `"feat: dark mode completo + mejoras esteticas + date picker nativo + foto de perfil"`

---

## DECISIONES ARQUITECTÓNICAS CRÍTICAS

| Decisión                                      | Motivo                                             | Alternativa descartada         |
| ---------------------------------------------- | -------------------------------------------------- | ------------------------------ |
| react-native-reanimated fijado en 3.10.1       | v4.x requiere RN 0.83+, incompatible con RN 0.81.5 | Actualizar reanimated          |
| bcrypt fijado en 4.0.1                         | Versiones superiores rompen passlib                | Usar otra librería de hashing |
| @react-navigation v6 (no v7)                   | v7 requiere reanimated 4.x                         | Usar v7                        |
| Drawer Navigator reemplazado por Bottom Tab    | Mejor UX, no depende de reanimated                 | Mantener Drawer                |
| Drawer custom en RN puro (DrawerNavigator.js)  | Evita dependencia de reanimated para el drawer     | Usar @react-navigation/drawer  |
| newArchEnabled: false en app.json              | Nueva arquitectura causa crashes con reanimated    | Mantener nueva arquitectura    |
| SQLAlchemy 2.x: importar case desde sqlalchemy | API cambió en v2, func.case ya no funciona        | Downgrade de SQLAlchemy        |
| Emulador usa IP 192.168.101.5 (no localhost)   | Android no puede conectar a localhost de la PC     | Usar localhost                 |
| Foto de perfil: local + ruta en PostgreSQL     | Solución simple sin servicios externos            | Cloudinary, Base64 en BD       |
| Todos los npm install con --legacy-peer-deps   | Conflictos de peer deps con React Navigation v6    | Usar npx expo install          |

---

## CONFIGURACIÓN CRÍTICA

### app.json

```json
{
  "expo": {
    "name": "FinanControl",
    "slug": "financontrol",
    "android": { "newArchEnabled": false },
    "ios": { "newArchEnabled": false }
  }
}
```

### babel.config.js

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### .env (backend)

```env
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/financontrol
SECRET_KEY=clave_secreta_muy_larga_y_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### src/services/api.js

```js
const BASE_URL = 'http://192.168.101.5:8000';
```

---

## PALETA DE COLORES

```js
export const lightColors = {
  primary: '#2563EB', primaryDark: '#1D4ED8', secondary: '#0EA5E9',
  success: '#22C55E', danger: '#EF4444', warning: '#F59E0B',
  background: '#F8FAFC', surface: '#FFFFFF', border: '#E2E8F0',
  textPrimary: '#1E293B', textSecondary: '#64748B', textWhite: '#FFFFFF',
  income: '#22C55E', expense: '#EF4444', shadow: '#000000',
};

export const darkColors = {
  primary: '#3B82F6', primaryDark: '#2563EB', secondary: '#0EA5E9',
  success: '#22C55E', danger: '#EF4444', warning: '#F59E0B',
  background: '#0F172A', surface: '#1E293B', border: '#334155',
  textPrimary: '#F1F5F9', textSecondary: '#94A3B8', textWhite: '#FFFFFF',
  income: '#22C55E', expense: '#EF4444', shadow: '#000000',
};
```

---

## PATRÓN DE TEMA (MODO OSCURO)

Todos los componentes y pantallas usan este patrón:

```js
// 1. Import
import { useTheme } from '../theme/ThemeContext';

// 2. En el componente
const { colors, isDark } = useTheme();
const styles = makeStyles(colors);

// 3. Estilos como función
const makeStyles = (colors) => StyleSheet.create({
  container: { backgroundColor: colors.background },
  // ...
});
```

**NUNCA usar `import { colors } from '../theme/colors'` directamente en componentes** — siempre usar `useTheme()`.

---

## BASE DE DATOS POSTGRESQL

```sql
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  foto_perfil TEXT
);

CREATE TABLE movimientos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER REFERENCES usuarios(id),
  tipo        TEXT NOT NULL,       -- 'Ingreso' o 'Gasto'
  categoria   TEXT NOT NULL,
  descripcion TEXT,
  monto       REAL NOT NULL,
  fecha       TEXT NOT NULL        -- formato YYYY-MM-DD
);
```

---

## ENDPOINTS API

| Método | Endpoint               | Auth | Descripción          |
| ------- | ---------------------- | ---- | --------------------- |
| POST    | /usuarios/register     | No   | Registro              |
| POST    | /usuarios/login        | No   | Login                 |
| PUT     | /usuarios/foto         | JWT  | Actualizar foto       |
| PUT     | /usuarios/nombre       | JWT  | Actualizar nombre     |
| GET     | /movimientos/          | JWT  | Listar todos          |
| POST    | /movimientos/          | JWT  | Crear                 |
| GET     | /movimientos/resumen   | JWT  | Saldo/ingresos/gastos |
| GET     | /movimientos/recientes | JWT  | Últimos 5            |
| PUT     | /movimientos/{id}      | JWT  | Actualizar            |
| DELETE  | /movimientos/{id}      | JWT  | Eliminar              |

---

## CATEGORÍAS

```js
const CATEGORIAS = {
  Ingreso: ['Sueldo', 'Freelance', 'Inversión', 'Otros'],
  Gasto: ['Alimentación', 'Transporte', 'Combustible', 'Salud',
          'Educación', 'Entretenimiento', 'Servicios', 'Ropa', 'Otros'],
};
```

**Regla:** Si categoría es "Otros", la descripción es **obligatoria**.

---

## COMANDOS PARA CORRER EL PROYECTO

### Backend (Terminal 1)

```powershell
cd financontrol-backend
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2)

```powershell
cd financontrol-frontend
npx expo start --clear
```

---

## FLUJO DE NAVEGACIÓN

```
App.js (ThemeProvider + SafeAreaProvider)
  └── RootNavigator
        ├── SplashScreen (verifica token en AsyncStorage)
        ├── AuthNavigator (Stack, sin header)
        │     ├── LoginScreen
        │     └── RegisterScreen
        └── BottomTabNavigator
              ├── HomeScreen (dashboard)
              ├── MovimientosStack
              │     ├── MovimientosScreen
              │     └── EditMovimientoScreen
              ├── AddMovimientoScreen
              └── ProfileScreen
```

---

## FUNCIONALIDADES IMPLEMENTADAS

| Funcionalidad                        | Estado        |
| ------------------------------------ | ------------- |
| Registro e inicio de sesión con JWT | ✅            |
| Sesión persistida con AsyncStorage  | ✅            |
| CRUD completo de movimientos         | ✅            |
| Dashboard con datos reales           | ✅            |
| Bottom Tab Navigator                 | ✅            |
| Modo oscuro completo                 | ✅            |
| Foto de perfil (galería/cámara)    | ✅            |
| Edición inline del nombre           | ✅            |
| Date picker nativo                   | ✅            |
| Descripción obligatoria en "Otros"  | ✅            |
| Skeleton loaders                     | 🔄 En proceso |

---

## MEJORAS ESTÉTICAS PENDIENTES (en orden de prioridad)

1. ~~Skeleton loaders~~ (en proceso)
2. Animación de números en el dashboard (count-up)
3. Animaciones de transición entre tabs
4. Íconos de categoría coloridos
5. Gradiente en la card de saldo
6. Feedback táctil en cards (haptic)
7. Animación en el toggle de modo oscuro
8. Empty state ilustrado

---

## PROBLEMAS CONOCIDOS Y SOLUCIONES

| Problema                         | Causa                                        | Solución                                |
| -------------------------------- | -------------------------------------------- | ---------------------------------------- |
| reanimated crash en emulador     | Nueva arquitectura RN                        | newArchEnabled: false                    |
| bcrypt Internal Server Error     | passlib incompatible con bcrypt >4.0.1       | pip install bcrypt==4.0.1                |
| navigationRef.navigate undefined | ref en Stack.Navigator incorrecto            | Capturar navigation desde screenOptions  |
| resumen muestra $0               | SQLAlchemy 2.x cambió sintaxis de func.case | from sqlalchemy import case              |
| home no se actualiza             | useFocusEffect con dependencias              | Agregar isActive flag                    |
| DatePicker queda abierto en iOS  | display="spinner" sin control de cierre      | Modal custom con botón "Listo"          |
| Header azul fijo en modo oscuro  | headerStyle hardcodeado                      | isDark ? colors.surface : colors.primary |
| npm install falla con ERESOLVE   | Conflictos de peer deps                      | --legacy-peer-deps                       |

---

## TAREAS PENDIENTES

- [ ] Colocar SkeletonLoader.js en src/components/
- [ ] Colocar HomeScreen.js actualizado con skeleton
- [ ] Colocar MovimientosScreen.js actualizado con skeleton
- [ ] Implementar animación count-up en números del dashboard
- [ ] Implementar animaciones de transición entre tabs
- [ ] Implementar íconos de categoría coloridos
- [ ] Implementar gradiente en card de saldo
- [ ] Implementar haptic feedback en cards
- [ ] Animación en toggle de modo oscuro
- [ ] Empty state ilustrado
- [ ] Deploy backend en Railway o Render
- [ ] Build con EAS para Google Play

---

# PROMPT DE CONTINUIDAD

Copiá y pegá esto al inicio del nuevo chat:

---

Actúa como un Arquitecto de Software Senior y Tech Lead especializado en React Native, Expo y FastAPI. Estamos continuando el desarrollo de **FinanControl**, una app móvil de finanzas personales.

## Stack

- **Frontend:** React Native (Expo SDK 54 / RN 0.81.5), React Navigation v6, Bottom Tab Navigator
- **Backend:** FastAPI + PostgreSQL 18.4
- **Autenticación:** JWT tokens
- **Tema:** Modo claro/oscuro con ThemeContext

## Restricciones críticas (NO cambiar)

- react-native-reanimated **fijado en 3.10.1** (v4 requiere RN 0.83+)
- bcrypt **fijado en 4.0.1** (versiones superiores rompen passlib)
- newArchEnabled: **false** en app.json
- React Navigation **v6** (no v7)
- Todos los npm install requieren **--legacy-peer-deps**
- El emulador usa **192.168.101.5:8000** (no localhost)
- SQLAlchemy 2.x: importar `case` desde `sqlalchemy` directamente

## Patrón de tema obligatorio

```js
const { colors, isDark } = useTheme();
const styles = makeStyles(colors);
const makeStyles = (colors) => StyleSheet.create({ ... });
```

NUNCA usar `import { colors } from '../theme/colors'` en componentes.

## Estado actual

- Todas las fases completadas y funcionando
- Último commit: "feat: dark mode completo + mejoras esteticas + date picker nativo + foto de perfil"
- Rama activa: **fastapi-migration**

## Lo que falta entregar ahora

Los archivos de skeleton loaders estaban siendo generados pero se cortó el chat. Necesito:

1. `src/components/SkeletonLoader.js` — componente con SkeletonBox, SkeletonHome, SkeletonMovimientoCard, SkeletonMovimientos
2. `src/screens/HomeScreen.js` — con `import { SkeletonHome }` y `if (loading) return <SkeletonHome />`
3. `src/screens/MovimientosScreen.js` — con `import { SkeletonMovimientos }` y `if (loading) return <SkeletonMovimientos />`

Luego continuar con las mejoras estéticas en este orden:

1. Animación count-up en números del dashboard
2. Animaciones de transición entre tabs
3. Íconos de categoría coloridos
4. Gradiente en card de saldo
5. Haptic feedback
6. Animación en toggle de modo oscuro
7. Empty state ilustrado

El usuario prefiere recibir **archivos completos** listos para reemplazar, no diffs parciales.
