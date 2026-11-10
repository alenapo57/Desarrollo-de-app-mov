# FinanControl

App móvil de finanzas personales. Permite registrarse, iniciar sesión, cargar ingresos y gastos, editar/eliminar movimientos, filtrar por período y ver un resumen con saldo, ingresos y gastos totales.

## Stack

**Frontend** — React Native 0.88 (Expo SDK 58), React Navigation 7 (bottom tabs + stack), AsyncStorage para sesión.

**Backend** — FastAPI, SQLAlchemy 2.x, PostgreSQL en [Neon](https://neon.com) (cloud), autenticación JWT (`python-jose` + `passlib`/`bcrypt`).

## Estructura

```
FinanControl/
├── financontrol-backend/    # API FastAPI
│   ├── main.py               # entrypoint, CORS, routers
│   ├── models.py             # modelos SQLAlchemy (Usuario, Movimiento)
│   ├── schemas.py            # esquemas Pydantic
│   ├── auth.py                # hashing de password + JWT
│   ├── database.py            # conexión a Postgres
│   └── routers/
│       ├── usuarios.py        # registro, login, perfil
│       └── movimientos.py     # CRUD + resumen financiero
└── financontrol-frontend/   # App Expo
    └── src/
        ├── screens/            # pantallas (Login, Home, Movimientos, Perfil, etc.)
        ├── components/         # UI reutilizable
        ├── navigation/         # Bottom tabs + stacks
        ├── services/           # cliente HTTP (api.js) y llamadas a la API
        └── theme/              # colores + contexto de modo oscuro
```

## Requisitos previos

- Node.js 22.13+ o 24.3+ (versiones pares; Expo SDK 58 no soporta 23 ni 25) y npm
- Python 3.10+
- La connection string de la base en Neon (no hace falta instalar PostgreSQL)
- Expo Go actualizado (en tu celular) o un emulador Android/iOS. El proyecto usa SDK 58: Expo Go de las tiendas solo soporta el SDK más reciente
- Opcional: [ngrok](https://ngrok.com/) si vas a probar desde un dispositivo físico sin estar en la misma red que el backend

## Clonar el repo

Este proyecto vive dentro de la carpeta `FinanControl/` del repositorio. Después de clonar, pará ahí antes de seguir:

```bash
git clone https://github.com/alenapo57/Desarrollo-de-app-mov.git
cd <nombre-del-repo>/FinanControl
```

Los dos pasos siguientes (backend y frontend) asumen que estás parado en `FinanControl/`.

## Backend — setup

```bash
cd financontrol-backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Copiá `.env.example` a `.env` y completá tus valores. La base de datos está en Neon, así que no hace falta crear nada local: pegá la connection string del proyecto (panel de Neon → **Connect**) en `DATABASE_URL`. Todas las PCs que usen esa misma URL comparten los mismos datos.

```bash
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux
```

| Variable                        | Descripción                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Connection string de Neon, formato `postgresql://usuario:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require&channel_binding=require`             |
| `SECRET_KEY`                  | Clave para firmar los JWT. Generarla con`python -c "import secrets; print(secrets.token_hex(32))"` — nunca reutilizar la de otro entorno ni commitearla |
| `ALGORITHM`                   | Algoritmo de firma JWT (`HS256`)                                                                                                                         |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Minutos de validez del token (10080 = 7 días)                                                                                                             |

Levantar el servidor (crea las tablas automáticamente si no existen):

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

La API queda en `http://localhost:8000`. Documentación interactiva (Swagger) en `http://localhost:8000/docs`.

## Frontend — setup

```bash
cd financontrol-frontend
npm install
```

No hace falta configurar la URL del backend: `src/services/api.js` toma automáticamente la IP de la PC que está corriendo Expo y le agrega el puerto `8000`. Solo tienen que estar el celular y la PC en la misma red.

Iniciar la app:

```bash
npx expo start --clear
```

## Compartir la app para que otros la prueben (túnel)

Para que otras personas escaneen el QR desde **cualquier red**, hacen falta dos túneles públicos, porque sus celulares no llegan a tu IP local:

| Qué se expone | Herramienta | URL |
| --- | --- | --- |
| La app (Metro) | Túnel propio de Expo (`--tunnel`) | `https://xxxx.on.expo.app` (la muestra el QR) |
| El backend (puerto 8000) | [ngrok](https://ngrok.com/) | Tu dominio fijo de ngrok, ej. `https://tu-dominio.ngrok-free.dev` |

**Configuración (una sola vez):**

1. Instalá ngrok y cargá tu token (`ngrok config add-authtoken <token>`, el token está en el panel de ngrok). El plan gratuito trae un dominio fijo que no cambia entre reinicios.
2. Creá `financontrol-frontend/.env.local` (está en el `.gitignore`) con la URL pública del backend:

   ```
   EXPO_PUBLIC_API_URL=https://tu-dominio.ngrok-free.dev
   ```

   Esta variable solo se usa en modo túnel: en la red local la app sigue usando la IP de la PC.

**Cada vez que quieras compartirla**, en tres terminales parado en `FinanControl/`:

```powershell
# 1) Backend
cd financontrol-backend
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 2) Túnel del backend (si ngrok no está en el PATH, usá la ruta completa: & "$env:LOCALAPPDATA\ngrok\ngrok.exe" http 8000)
ngrok http 8000

# 3) App con túnel
cd financontrol-frontend
npx expo start --tunnel --clear
```

Pasales el QR de la terminal 3. Necesitan **Expo Go actualizado** (SDK 58): en iPhone se escanea con la cámara y en Android desde la app Expo Go.

Mientras tengan que probar, tu PC tiene que quedar prendida con las tres terminales abiertas. Si cerrás cualquiera, la app deja de andar para todos.

## Funcionalidades

- Registro e inicio de sesión con JWT
- Dashboard con saldo, ingresos y gastos (con animación de conteo)
- CRUD de movimientos (ingreso/gasto) con categoría, descripción, monto y fecha
- Búsqueda y filtro por período (todos / esta semana / este mes / rango personalizado)
- Perfil: editar nombre, foto de perfil (galería o cámara), cerrar sesión
- Modo oscuro persistente con transición animada
- Skeleton loaders, empty states ilustrados y feedback háptico

## Notas de seguridad

- `.env` está en `.gitignore` — nunca commitear credenciales reales. Usar `.env.example` como referencia.
- El `.env` del backend tiene la contraseña de Neon: pasalo a otra PC por un medio privado, nunca por el repo.
- Con los túneles levantados, la API y la app son **públicas**: cualquiera con la URL puede registrarse y cargar datos en la base de Neon. Cerrá los túneles cuando terminen las pruebas.

## Problemas comunes

**"JSON Parse error: Unexpected character" al loguearse** — la app llega a algo que no es el backend. En la red local: `uvicorn` no está levantado. En modo túnel: además, que `ngrok http 8000` esté corriendo y que `EXPO_PUBLIC_API_URL` en `.env.local` sea tu dominio de ngrok (reiniciá Expo con `--clear` si lo cambiaste).

**El backend no arranca / error de conexión a la base** — revisá que `DATABASE_URL` en `.env` sea la connection string completa de Neon (con `?sslmode=require`). Las tablas se crean solas al levantar `uvicorn`.

**La primera request tarda unos segundos** — es normal: Neon suspende la base cuando no se usa y la despierta con la primera conexión.

**La app no encuentra el backend desde el celular** — el celular y la PC tienen que estar en la misma red Wi-Fi, y el firewall de Windows tiene que permitir conexiones entrantes a Python en el puerto 8000. Si no están en la misma red, usá el modo túnel (ver "Compartir la app para que otros la prueben").
