// api/routes/collection.routes.js

import { Router } from 'express'
import {
  getCollection,
  addToCollection,
  updateStatus,
  removeFromCollection,
  checkMovie,
} from '../controllers/collection.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = Router()

// Todas las rutas de colección requieren autenticación
router.use(protect)

router.get('/',                  getCollection)
router.post('/',                 addToCollection)

// Check debe ir antes de /:entryId para que
// /check/:tmdbId no sea capturado como un entryId
router.get('/check/:tmdbId',     checkMovie)

router.patch('/:entryId',        updateStatus)
router.delete('/:entryId',       removeFromCollection)



export default router