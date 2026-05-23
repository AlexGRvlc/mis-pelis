// api/routes/stats.routes.js

import { Router } from 'express'
import {
  getSummary,
  getByYear,
  getTopGenres,
  getRecent,
  getOverview,
} from '../controllers/stats.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = Router()

// Todas protegidas — las estadísticas son privadas por usuario
router.use(protect)

// Endpoint agregado — una sola llamada para el dashboard completo
router.get('/overview', getOverview)

// Endpoints individuales — útiles si el frontend
// necesita refrescar solo una sección concreta
router.get('/summary',  getSummary)
router.get('/by-year',  getByYear)
router.get('/genres',   getTopGenres)
router.get('/recent',   getRecent)



export default router