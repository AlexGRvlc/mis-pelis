// api/controllers/stats.controller.js

import prisma from '../lib/prismaClient.js'

// ─────────────────────────────────────────
// UTILIDAD — Parsea el campo genre almacenado
// como string "Acción,Drama" a un array limpio
// ─────────────────────────────────────────
const parseGenres = (genreString) => {
  if (!genreString) return []
  return genreString.split(',').map((g) => g.trim()).filter(Boolean)
}

// ─────────────────────────────────────────
// GET /api/stats/summary
// Resumen global de la colección del usuario:
// totales por estado + total general
// ─────────────────────────────────────────
export const getSummary = async (req, res) => {
  try {
    // groupBy de Prisma — una sola query para todos los conteos
    const grouped = await prisma.collection.groupBy({
      by: ['status'],
      where: { userId: req.user.id },
      _count: { status: true },
    })

    // Construir objeto con valores por defecto en 0
    const summary = {
      WATCHED:  0,
      PENDING:  0,
      FAVORITE: 0,
      total:    0,
    }

    grouped.forEach(({ status, _count }) => {
      summary[status] = _count.status
      summary.total  += _count.status
    })

    return res.status(200).json({
      status: 'success',
      summary,
    })
  } catch (err) {
    console.error('Error en getSummary:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener el resumen.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/stats/by-year
// Películas VISTAS agrupadas por año de estreno
// Devuelve array ordenado para pintar un gráfico de barras
// ─────────────────────────────────────────
export const getByYear = async (req, res) => {
  try {
    // Traemos las entradas WATCHED con el año de su película
    const entries = await prisma.collection.findMany({
      where: {
        userId: req.user.id,
        status: 'WATCHED',
      },
      select: {
        movie: {
          select: { year: true },
        },
      },
    })

    // Agregar en memoria — más flexible que un groupBy con JOIN
    const yearMap = {}

    entries.forEach(({ movie }) => {
      if (!movie.year) return
      yearMap[movie.year] = (yearMap[movie.year] || 0) + 1
    })

    // Convertir a array ordenado cronológicamente
    const byYear = Object.entries(yearMap)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year)

    return res.status(200).json({
      status: 'success',
      byYear,
    })
  } catch (err) {
    console.error('Error en getByYear:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener estadísticas por año.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/stats/genres
// Géneros más consumidos (películas WATCHED)
// Devuelve array ordenado por frecuencia descendente
// ─────────────────────────────────────────
export const getTopGenres = async (req, res) => {
  try {
    const entries = await prisma.collection.findMany({
      where: {
        userId: req.user.id,
        status: 'WATCHED',
      },
      select: {
        movie: {
          select: { genre: true },
        },
      },
    })

    // Contar frecuencia de cada género
    const genreMap = {}

    entries.forEach(({ movie }) => {
      const genres = parseGenres(movie.genre)
      genres.forEach((genre) => {
        genreMap[genre] = (genreMap[genre] || 0) + 1
      })
    })

    // Ordenar por frecuencia y tomar top 10
    const topGenres = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return res.status(200).json({
      status: 'success',
      topGenres,
    })
  } catch (err) {
    console.error('Error en getTopGenres:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener géneros.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/stats/recent
// Últimas 10 películas añadidas a la colección
// independientemente del estado — para el feed de actividad
// ─────────────────────────────────────────
export const getRecent = async (req, res) => {
  try {
    const entries = await prisma.collection.findMany({
      where: { userId: req.user.id },
      include: {
        movie: {
          select: {
            tmdbId:    true,
            title:     true,
            year:      true,
            posterUrl: true,
            genre:     true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    })

    return res.status(200).json({
      status: 'success',
      recent: entries,
    })
  } catch (err) {
    console.error('Error en getRecent:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener actividad reciente.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/stats/overview
// Endpoint único que agrega TODOS los datos anteriores
// en una sola llamada — optimizado para el dashboard
// Evita que el frontend haga 4 peticiones separadas
// ─────────────────────────────────────────
export const getOverview = async (req, res) => {
  try {
    // Ejecutar las 4 consultas en paralelo
    const [grouped, watchedEntries, recentEntries] = await Promise.all([

      // 1. Conteos por estado
      prisma.collection.groupBy({
        by: ['status'],
        where: { userId: req.user.id },
        _count: { status: true },
      }),

      // 2. Entradas vistas con año y género para agregar
      prisma.collection.findMany({
        where: {
          userId: req.user.id,
          status: 'WATCHED',
        },
        select: {
          movie: {
            select: { year: true, genre: true },
          },
        },
      }),

      // 3. Actividad reciente
      prisma.collection.findMany({
        where: { userId: req.user.id },
        include: {
          movie: {
            select: {
              tmdbId:    true,
              title:     true,
              year:      true,
              posterUrl: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    ])

    // ── Procesar summary ──────────────────
    const summary = { WATCHED: 0, PENDING: 0, FAVORITE: 0, total: 0 }
    grouped.forEach(({ status, _count }) => {
      summary[status] = _count.status
      summary.total  += _count.status
    })

    // ── Procesar byYear ───────────────────
    const yearMap = {}
    watchedEntries.forEach(({ movie }) => {
      if (!movie.year) return
      yearMap[movie.year] = (yearMap[movie.year] || 0) + 1
    })
    const byYear = Object.entries(yearMap)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year)

    // ── Procesar topGenres ────────────────
    const genreMap = {}
    watchedEntries.forEach(({ movie }) => {
      parseGenres(movie.genre).forEach((genre) => {
        genreMap[genre] = (genreMap[genre] || 0) + 1
      })
    })
    const topGenres = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return res.status(200).json({
      status: 'success',
      overview: {
        summary,
        byYear,
        topGenres,
        recent: recentEntries,
      },
    })
  } catch (err) {
    console.error('Error en getOverview:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener el overview.',
    })
  }
}