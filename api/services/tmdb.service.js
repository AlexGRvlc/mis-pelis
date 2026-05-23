// api/services/tmdb.service.js

import axios from 'axios'

// ─────────────────────────────────────────
// Cliente Axios preconfigurado para TMDb
// ─────────────────────────────────────────
const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  timeout: 8000,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: 'es-ES',        // Respuestas en español
    region: 'ES',             // Resultados priorizados para España
  },
})

// ─────────────────────────────────────────
// UTILIDAD — Normaliza una película cruda de TMDb
// a un objeto limpio y predecible para el cliente
// ─────────────────────────────────────────
const normalizeMovie = (movie) => ({
  tmdbId:    movie.id,
  title:     movie.title || movie.name || 'Sin título',
  year:      movie.release_date
               ? Number(movie.release_date.split('-')[0])
               : null,
  overview:  movie.overview || '',
  posterUrl: movie.poster_path
               ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
               : null,
  backdrop:  movie.backdrop_path
               ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
               : null,
  rating:    movie.vote_average ? Number(movie.vote_average.toFixed(1)) : null,
  voteCount: movie.vote_count || 0,
  genres:    movie.genre_ids || [],        // IDs en listados
  genreNames: movie.genres                 // Nombres en detalle
               ? movie.genres.map((g) => g.name)
               : [],
})

// ─────────────────────────────────────────
// 1. Búsqueda por texto
// ─────────────────────────────────────────
export const searchMovies = async (query, page = 1) => {
  if (!query?.trim()) return { results: [], totalPages: 0, totalResults: 0 }

  const { data } = await tmdb.get('/search/movie', {
    params: { query: query.trim(), page },
  })

  return {
    results:      data.results.map(normalizeMovie),
    totalPages:   data.total_pages,
    totalResults: data.total_results,
    currentPage:  data.page,
  }
}

// ─────────────────────────────────────────
// 2. Películas en cartelera — sección "En Cartelera"
// ─────────────────────────────────────────
export const getNowPlaying = async (page = 1) => {
  const { data } = await tmdb.get('/movie/now_playing', {
    params: { page },
  })

  return {
    results:    data.results.map(normalizeMovie),
    totalPages: data.total_pages,
    currentPage: data.page,
  }
}

// ─────────────────────────────────────────
// 3. Novedades en streaming — sección "Streaming"
// ─────────────────────────────────────────
export const getStreamingNew = async (page = 1) => {
  const { data } = await tmdb.get('/movie/popular', {
    params: { page },
  })

  return {
    results:    data.results.map(normalizeMovie),
    totalPages: data.total_pages,
    currentPage: data.page,
  }
}

// ─────────────────────────────────────────
// 4. Películas trending — para hero/banner
// ─────────────────────────────────────────
export const getTrending = async (timeWindow = 'week') => {
  const { data } = await tmdb.get(`/trending/movie/${timeWindow}`)

  return {
    results: data.results.map(normalizeMovie),
  }
}

// ─────────────────────────────────────────
// 5. Detalle completo de una película
// ─────────────────────────────────────────
export const getMovieDetail = async (tmdbId) => {
  const { data } = await tmdb.get(`/movie/${tmdbId}`, {
    params: {
      append_to_response: 'credits,videos,similar',
    },
  })

  const normalized = normalizeMovie(data)

  // Enriquecer con datos del detalle que no vienen en listados
  return {
    ...normalized,
    runtime:   data.runtime || null,
    tagline:   data.tagline || '',
    status:    data.status || '',
    budget:    data.budget || 0,
    revenue:   data.revenue || 0,
    // Director extraído de credits
    director: data.credits?.crew?.find((p) => p.job === 'Director')?.name || null,
    // Top 5 del reparto
    cast: data.credits?.crew
      ? data.credits.cast.slice(0, 5).map((a) => ({
          name:      a.name,
          character: a.character,
          photo:     a.profile_path
                       ? `https://image.tmdb.org/t/p/w185${a.profile_path}`
                       : null,
        }))
      : [],
    // Tráiler oficial de YouTube
    trailer: data.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    )?.key || null,
    // Películas similares normalizadas
    similar: data.similar?.results?.slice(0, 8).map(normalizeMovie) || [],
  }
}