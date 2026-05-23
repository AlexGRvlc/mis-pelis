// api/routes/movies.routes.js

import { Router } from 'express'
import {
  search,
  nowPlaying,
  streaming,
  trending,
  detail,
} from '../controllers/movies.controller.js'

const router = Router()

// Todas públicas — el invitado puede consumirlas sin token
router.get('/search',      search)
router.get('/now-playing', nowPlaying)
router.get('/streaming',   streaming)
router.get('/trending',    trending)

// Detalle — debe ir al final para que /:tmdbId no capture las rutas anteriores
router.get('/:tmdbId',     detail)

export default router