// api/app.js

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// ── Rutas (las iremos añadiendo en pasos posteriores) ──────────────────────
import authRoutes from './routes/auth.routes.js'
import moviesRoutes     from './routes/movies.routes.js'
import collectionRoutes from './routes/collection.routes.js'
import statsRoutes      from './routes/stats.routes.js'


const app = express()

// ✅ Necesario en Vercel — confía en el proxy de Vercel para IPs reales
app.set('trust proxy', 1)

// ─────────────────────────────────────────
// 1. SEGURIDAD — Helmet inyecta cabeceras HTTP seguras
// ─────────────────────────────────────────
app.use(helmet())

// ─────────────────────────────────────────
// 2. CORS — Solo acepta peticiones del frontend
// ─────────────────────────────────────────
// const allowedOrigins = [
//   'http://localhost:5173',                        // Vite dev server local
//   process.env.FRONTEND_URL,                       // URL de producción en Vercel
// ].filter(Boolean)                                 // Elimina undefined si la var no está definida

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Permite llamadas sin origin (Postman, curl, server-to-server)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true)
//       } else {
//         callback(new Error(`CORS bloqueado para el origen: ${origin}`))
//       }
//     },
//     credentials: true,                            // Permite cookies/auth headers
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// )

// El cambio actual es mucho más robusto y previene de errores de red inesperados
const allowedOrigins = [
  'http://localhost:5173',                        // Vite dev server local
  process.env.FRONTEND_URL,                       // URL de producción en Vercel
].map(url => url?.replace(/\/$/, ''))             // Limpia barras inclinadas al final por seguridad
 .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // En producción en Vercel, si el origen coincide con el host o está en allowedOrigins, se permite
      if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true)
      } else {
        callback(new Error(`CORS bloqueado para el origen: ${origin}`))
      }
    },
    credentials: true,                            // Permite cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)


// ─────────────────────────────────────────
// 3. RATE LIMITING — Protección global contra abuso
// ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // Ventana de 15 minutos
  max: 100,                     // Máximo 100 peticiones por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Demasiadas peticiones. Inténtalo de nuevo en 15 minutos.',
  },
})

app.use(globalLimiter)

// Rate limiter más estricto para endpoints de autenticación
// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,                      // Solo 10 intentos de login por ventana
//   message: {
//     status: 429,
//     error: 'Demasiados intentos de autenticación. Espera 15 minutos.',
//   },
// })

// ─────────────────────────────────────────
// 4. PARSERS — JSON y URL-encoded
// ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))           // Limita el tamaño del body
app.use(express.urlencoded({ extended: true }))

// ─────────────────────────────────────────
// 5. HEALTH CHECK — Endpoint de diagnóstico
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ─────────────────────────────────────────
// 6. RUTAS — Se montarán aquí progresivamente
// ─────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/movies',     moviesRoutes)
app.use('/api/collection', collectionRoutes)
app.use('/api/stats',      statsRoutes)

// ─────────────────────────────────────────
// 7. RUTA NO ENCONTRADA — 404 limpio
// ─────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  })
})

// ─────────────────────────────────────────
// 8. MANEJADOR GLOBAL DE ERRORES
// Express lo identifica por tener exactamente 4 parámetros (err, req, res, next)
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  // Error de CORS — mensaje legible
  if (err.message?.startsWith('CORS bloqueado')) {
    return res.status(403).json({
      status: 'error',
      message: err.message,
    })
  }

  // Loguea el stack solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Error:', err.stack)
  } else {
    console.error('💥 Error:', err.message)
  }

  // Nunca expongas detalles internos en producción
  const statusCode = err.statusCode || err.status || 500
  res.status(statusCode).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Ha ocurrido un error interno.'
        : err.message || 'Error desconocido',
  })
})

export default app