// api/routes/auth.routes.js

import { Router } from 'express'
import { register, login, socialLogin, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
// import { authLimiter } from '../app.js' // Evitamos importar el limitador desde app.js para no crear dependencias circulares
import rateLimit from 'express-rate-limit' // <-- IMPORTACIÓN CORRECTA

// Definimos el limitador estricto aquí mismo para evitar dependencias circulares
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de login/registro por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Demasiados intentos de autenticación. Por favor, espera 15 minutos.',
  },
})

const router = Router()

// Rutas públicas — con rate limit estricto de auth (Protegidas contra abuso por IP)
router.post('/register', authLimiter, register)
router.post('/login',    authLimiter, login)
router.post('/social',   authLimiter, socialLogin)

// Ruta protegida — requiere token válido (JWT válido)
router.get('/me', protect, getMe)

export default router