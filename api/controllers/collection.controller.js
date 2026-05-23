// api/controllers/collection.controller.js

import prisma from '../lib/prismaClient.js'
import { getMovieDetail } from '../services/tmdb.service.js'

// ─────────────────────────────────────────
// UTILIDAD — Upsert de Movie en BD local
// Antes de crear una entrada en Collection, nos aseguramos
// de que la película existe en nuestra tabla Movie.
// Si ya existe (otro usuario la añadió antes), la reutilizamos.
// ─────────────────────────────────────────
const upsertMovie = async (tmdbId) => {
  const existing = await prisma.movie.findUnique({
    where: { tmdbId: Number(tmdbId) },
  })

  if (existing) return existing

  // Si no existe, la traemos de TMDb y la persistimos
  const movieData = await getMovieDetail(Number(tmdbId))

  return prisma.movie.create({
    data: {
      tmdbId:    movieData.tmdbId,
      title:     movieData.title,
      year:      movieData.year,
      genre:     movieData.genreNames?.join(',') || null,
      posterUrl: movieData.posterUrl,
      overview:  movieData.overview,
    },
  })
}

// ─────────────────────────────────────────
// GET /api/collection
// Lista toda la colección del usuario autenticado
// Query params opcionales: ?status=WATCHED|PENDING|FAVORITE&page=1
// ─────────────────────────────────────────
export const getCollection = async (req, res) => {
  const { status, page = 1 } = req.query
  const PAGE_SIZE = 20

  // Validar status si viene en la query
  const validStatuses = ['WATCHED', 'PENDING', 'FAVORITE']
  if (status && !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      status: 'error',
      message: `Estado inválido. Usa: ${validStatuses.join(', ')}`,
    })
  }

  try {
    const where = {
      userId: req.user.id,
      ...(status && { status: status.toUpperCase() }),
    }

    // Ejecutar count y data en paralelo para eficiencia
    const [total, entries] = await Promise.all([
      prisma.collection.count({ where }),
      prisma.collection.findMany({
        where,
        include: {
          movie: true,          // JOIN con la tabla Movie
        },
        orderBy: { updatedAt: 'desc' },
        skip:  (Number(page) - 1) * PAGE_SIZE,
        take:  PAGE_SIZE,
      }),
    ])

    return res.status(200).json({
      status:      'success',
      total,
      totalPages:  Math.ceil(total / PAGE_SIZE),
      currentPage: Number(page),
      results:     entries,
    })
  } catch (err) {
    console.error('Error en getCollection:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al obtener la colección.',
    })
  }
}

// ─────────────────────────────────────────
// POST /api/collection
// Añade una película a la colección del usuario
// Body: { tmdbId, status }
// ─────────────────────────────────────────
export const addToCollection = async (req, res) => {
  const { tmdbId, status } = req.body

  if (!tmdbId || !status) {
    return res.status(400).json({
      status:  'error',
      message: 'tmdbId y status son obligatorios.',
    })
  }

  const validStatuses = ['WATCHED', 'PENDING', 'FAVORITE']
  if (!validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      status:  'error',
      message: `Estado inválido. Usa: ${validStatuses.join(', ')}`,
    })
  }

  try {
    // 1. Garantizar que la película existe en nuestra BD
    const movie = await upsertMovie(tmdbId)

    // 2. Verificar que el usuario no la tenga ya en su colección
    const existing = await prisma.collection.findUnique({
      where: {
        userId_movieId: {
          userId:  req.user.id,
          movieId: movie.id,
        },
      },
    })

    if (existing) {
      return res.status(409).json({
        status:  'error',
        message: 'Esta película ya está en tu colección.',
        entry:   existing,
      })
    }

    // 3. Crear la entrada en la colección
    const entry = await prisma.collection.create({
      data: {
        userId:  req.user.id,
        movieId: movie.id,
        status:  status.toUpperCase(),
      },
      include: { movie: true },
    })

    return res.status(201).json({
      status: 'success',
      entry,
    })
  } catch (err) {
    console.error('Error en addToCollection:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al añadir la película a la colección.',
    })
  }
}

// ─────────────────────────────────────────
// PATCH /api/collection/:entryId
// Cambia el estado de una entrada existente
// Body: { status }
// ─────────────────────────────────────────
export const updateStatus = async (req, res) => {
  const { entryId } = req.params
  const { status } = req.body

  const validStatuses = ['WATCHED', 'PENDING', 'FAVORITE']
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      status:  'error',
      message: `Estado inválido. Usa: ${validStatuses.join(', ')}`,
    })
  }

  try {
    // 1. Verificar que la entrada existe Y pertenece al usuario
    const entry = await prisma.collection.findUnique({
      where: { id: entryId },
    })

    if (!entry) {
      return res.status(404).json({
        status:  'error',
        message: 'Entrada no encontrada.',
      })
    }

    // 2. Autorización — un usuario solo puede editar sus propias entradas
    if (entry.userId !== req.user.id) {
      return res.status(403).json({
        status:  'error',
        message: 'No tienes permiso para modificar esta entrada.',
      })
    }

    // 3. Actualizar el estado
    const updated = await prisma.collection.update({
      where: { id: entryId },
      data:  { status: status.toUpperCase() },
      include: { movie: true },
    })

    return res.status(200).json({
      status: 'success',
      entry:  updated,
    })
  } catch (err) {
    console.error('Error en updateStatus:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al actualizar el estado.',
    })
  }
}

// ─────────────────────────────────────────
// DELETE /api/collection/:entryId
// Elimina una película de la colección del usuario
// ─────────────────────────────────────────
export const removeFromCollection = async (req, res) => {
  const { entryId } = req.params

  try {
    // 1. Verificar que existe y pertenece al usuario
    const entry = await prisma.collection.findUnique({
      where: { id: entryId },
    })

    if (!entry) {
      return res.status(404).json({
        status:  'error',
        message: 'Entrada no encontrada.',
      })
    }

    if (entry.userId !== req.user.id) {
      return res.status(403).json({
        status:  'error',
        message: 'No tienes permiso para eliminar esta entrada.',
      })
    }

    // 2. Eliminar
    await prisma.collection.delete({
      where: { id: entryId },
    })

    return res.status(200).json({
      status:  'success',
      message: 'Película eliminada de tu colección.',
    })
  } catch (err) {
    console.error('Error en removeFromCollection:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al eliminar la entrada.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/collection/check/:tmdbId
// Comprueba si una película concreta está en
// la colección del usuario y con qué estado.
// Útil para que el frontend pinte el botón correcto
// en cada MovieCard sin cargar toda la colección.
// ─────────────────────────────────────────
export const checkMovie = async (req, res) => {
  const { tmdbId } = req.params

  try {
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: Number(tmdbId) },
    })

    // Si la película ni siquiera está en nuestra BD, no puede estar en la colección
    if (!movie) {
      return res.status(200).json({
        status:   'success',
        inCollection: false,
        entry:    null,
      })
    }

    const entry = await prisma.collection.findUnique({
      where: {
        userId_movieId: {
          userId:  req.user.id,
          movieId: movie.id,
        },
      },
    })

    return res.status(200).json({
      status:       'success',
      inCollection: !!entry,
      entry:        entry || null,
    })
  } catch (err) {
    console.error('Error en checkMovie:', err)
    return res.status(500).json({
      status:  'error',
      message: 'Error al comprobar la película.',
    })
  }
}