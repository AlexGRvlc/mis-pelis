// api/controllers/movies.controller.js

import {
  searchMovies,
  getNowPlaying,
  getStreamingNew,
  getTrending,
  getMovieDetail,
} from '../services/tmdb.service.js'

// ─────────────────────────────────────────
// GET /api/movies/search?q=matrix&page=1
// ─────────────────────────────────────────
export const search = async (req, res) => {
  const { q, page = 1 } = req.query

  if (!q?.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'El parámetro de búsqueda "q" es obligatorio.',
    })
  }

  try {
    const data = await searchMovies(q, Number(page))

    return res.status(200).json({
      status: 'success',
      ...data,
    })
  } catch (err) {
    console.error('Error en search:', err.message)
    return res.status(502).json({
      status: 'error',
      message: 'Error al conectar con TMDb. Inténtalo de nuevo.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/movies/now-playing?page=1
// ─────────────────────────────────────────
export const nowPlaying = async (req, res) => {
  const { page = 1 } = req.query

  try {
    const data = await getNowPlaying(Number(page))

    return res.status(200).json({
      status: 'success',
      ...data,
    })
  } catch (err) {
    console.error('Error en nowPlaying:', err.message)
    return res.status(502).json({
      status: 'error',
      message: 'Error al obtener cartelera de TMDb.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/movies/streaming?page=1
// ─────────────────────────────────────────
export const streaming = async (req, res) => {
  const { page = 1 } = req.query

  try {
    const data = await getStreamingNew(Number(page))

    return res.status(200).json({
      status: 'success',
      ...data,
    })
  } catch (err) {
    console.error('Error en streaming:', err.message)
    return res.status(502).json({
      status: 'error',
      message: 'Error al obtener novedades en streaming.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/movies/trending?window=week
// ─────────────────────────────────────────
export const trending = async (req, res) => {
  const { window: timeWindow = 'week' } = req.query

  if (!['day', 'week'].includes(timeWindow)) {
    return res.status(400).json({
      status: 'error',
      message: 'El parámetro "window" debe ser "day" o "week".',
    })
  }

  try {
    const data = await getTrending(timeWindow)

    return res.status(200).json({
      status: 'success',
      ...data,
    })
  } catch (err) {
    console.error('Error en trending:', err.message)
    return res.status(502).json({
      status: 'error',
      message: 'Error al obtener tendencias de TMDb.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/movies/:tmdbId
// ─────────────────────────────────────────
export const detail = async (req, res) => {
  const { tmdbId } = req.params

  if (!tmdbId || isNaN(Number(tmdbId))) {
    return res.status(400).json({
      status: 'error',
      message: 'El ID de la película debe ser un número válido.',
    })
  }

  try {
    const movie = await getMovieDetail(Number(tmdbId))

    return res.status(200).json({
      status: 'success',
      movie,
    })
  } catch (err) {
    // TMDb devuelve 404 cuando no encuentra la película
    if (err.response?.status === 404) {
      return res.status(404).json({
        status: 'error',
        message: 'Película no encontrada.',
      })
    }

    console.error('Error en detail:', err.message)
    return res.status(502).json({
      status: 'error',
      message: 'Error al obtener el detalle de la película.',
    })
  }
}