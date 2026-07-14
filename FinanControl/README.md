# FinanControl

App móvil de finanzas personales. Permite registrarse, iniciar sesión, cargar ingresos y gastos, editar/eliminar movimientos, filtrar por período y ver un resumen con saldo, ingresos y gastos totales.

## Stack

**Frontend** — React Native (Expo SDK 54), React Navigation (bottom tabs + stack), AsyncStorage para sesión.

**Backend** — FastAPI, SQLAlchemy 2.x, PostgreSQL, autenticación JWT (`python-jose` + `passlib`/`bcrypt`).

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

- Node.js 18+ y npm
- Python 3.10+
- PostgreSQL corriendo localmente (o accesible por red)
- Expo Go (en tu celular) o un emulador Android/iOS
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

Creá la base de datos en Postgres (el nombre debe coincidir con el de tu `DATABASE_URL`):

```sql
CREATE DATABASE financontrol;
```

Copiá `.env.example` a `.env` y completá tus valores:

```bash
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux
```

| Variable                        | Descripción                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Cadena de conexión a Postgres, formato`postgresql://usuario:password@host:5432/financontrol`                                                            |
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
npm install --legacy-peer-deps
```

Editá `src/services/api.js` y apuntá `BASE_URL` a tu backend:

- Misma red Wi-Fi que el celular/emulador: IP local de tu PC, ej. `http://192.168.101.5:8000`
- Dispositivo físico sin estar en la misma red: URL de un túnel `ngrok http 8000` (recordá que la URL gratuita cambia cada vez que reiniciás ngrok)

Iniciar la app:

```bash
npx expo start --clear
```

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
- El plan gratuito de ngrok genera una URL nueva cada vez que se reinicia el túnel; hay que actualizar `BASE_URL` en el frontend cuando eso pase.

## Problemas comunes

**"JSON Parse error: Unexpected character" al loguearse** — el `BASE_URL` de `src/services/api.js` apunta a un backend que no está corriendo o a un túnel de ngrok caído. Verificá que `uvicorn` esté levantado y, si usás ngrok, que la URL en `api.js` sea la actual (cambia cada vez que se reinicia el túnel gratuito).

**El backend no arranca / error de conexión a la base** — confirmá que Postgres esté corriendo y que la base indicada en `DATABASE_URL` exista (`CREATE DATABASE financontrol;`). Las tablas se crean solas al levantar `uvicorn`, pero la base en sí no.

**La app no encuentra el backend desde el celular** — si el celular y la PC no están en la misma red Wi-Fi, `http://192.168.x.x` no va a funcionar; usá un túnel de ngrok en su lugar.
