# 🎬 Mis Pelis

Aplicación web full stack para gestionar tu colección personal de películas: descubre títulos en tiempo real con la API de TMDb, organízalos en tu propia lista (vistas, pendientes, favoritas) y consulta estadísticas sobre tus hábitos de consumo cultural.

**🔗 Demo en producción:** [mis-pelis-beige.vercel.app](https://mis-pelis-beige.vercel.app/)

> Proyecto de Fin de Ciclo — Desarrollo de Aplicaciones Multiplataforma (curso 2025/2026)

---

## ✨ Características

- 🔍 **Búsqueda en tiempo real** de películas, cartelera y novedades en streaming vía TMDb
- 📋 **Colección personal** con tres estados: vista, pendiente y favorita
- 📊 **Dashboard de estadísticas**: totales por estado, películas por año, top géneros y actividad reciente
- 🔐 **Autenticación híbrida**: email/contraseña (bcrypt) y login social con Google OAuth
- 👤 **Modo invitado**: navega, busca y consulta detalles sin necesidad de registrarte
- 📱 **Diseño Mobile-First**: navegación inferior en móvil, navbar superior en escritorio

## 🛠️ Stack tecnológico

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- TanStack Query v5 (caché y sincronización de datos)
- Zustand (estado global con persistencia)
- Axios + React Hot Toast + `@react-oauth/google`

**Backend**
- Express.js (Serverless Functions en Vercel)
- Prisma ORM + PostgreSQL (Neon, serverless)
- JWT (autenticación) + bcrypt (hashing de contraseñas)
- Helmet, CORS y `express-rate-limit` para seguridad

**Infraestructura**
- Monorepo desplegado en **Vercel** (frontend estático + backend serverless)
- Base de datos **PostgreSQL** en **Neon** (plan gratuito)
- Datos cinematográficos vía **TMDb API v3**

## 🏗️ Arquitectura

```
mis-pelis/
├── vercel.json          # Configuración de build y rutas
├── api/                  # Backend — Serverless Functions
│   ├── routes/            # auth, movies, collection, stats
│   ├── controllers/        # Lógica de negocio
│   ├── middlewares/        # JWT, manejo de errores
│   ├── services/           # TMDb, cliente Prisma (singleton)
│   └── prisma/schema.prisma
└── client/               # Frontend — React + Vite
    └── src/
        ├── pages/          # Home, Search, Collection, Stats, Login, MovieDetail
        ├── components/
        ├── hooks/          # useAuth, useCollection, useGuestGuard...
        ├── store/          # Zustand (authStore)
        └── context/
```

El backend expone endpoints REST bajo `/api/auth`, `/api/movies`, `/api/collection` y `/api/stats`, protegidos con JWT donde corresponde. El modelo de datos relaciona `User` y `Movie` a través de `Collection`, que actúa como tabla intermedia con estado propio (`WATCHED | PENDING | FAVORITE`).

## 🔒 Seguridad

- Contraseñas con hash bcrypt (12 salt rounds); nunca se almacenan ni transmiten en texto plano
- Rate limiting diferenciado (100 req/15min general, 10 req/15min en auth)
- Cabeceras de seguridad HTTP con Helmet, CORS restringido por lista blanca
- Verificación de ownership en cada operación de edición/borrado sobre la colección
- Queries parametrizadas vía Prisma (sin `$queryRaw`), variables sensibles gestionadas por entorno

## 🚀 Puesta en marcha local

```bash
# Backend
cd api
npm install
cp .env.example .env   # completa DATABASE_URL, JWT_SECRET, TMDB_API_KEY, etc.
npx prisma generate
npm run dev

# Frontend (en otra terminal)
cd client
npm install
npm run dev
```

### Variables de entorno principales

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL pooled de Neon (runtime) |
| `DIRECT_URL` | URL directa de Neon (migraciones) |
| `JWT_SECRET` | Clave de firma JWT |
| `TMDB_API_KEY` | Clave de la API de TMDb |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `FRONTEND_URL` | URL de producción (configuración CORS) |

## 📌 Próximas mejoras

- Login con GitHub OAuth
- PWA con soporte offline básico
- Caché de resultados de TMDb
- Exportación de la colección a CSV/JSON
- Tests con Jest + Supertest (backend) y Vitest + Testing Library (frontend)

## 👤 Autor

**Alejandro Galera** — [GitHub](https://github.com/AlexGRvlc)
