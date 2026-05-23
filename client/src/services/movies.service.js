// client/src/services/movies.service.js

import api from './api.js'

export const moviesService = {
  search: async (query, page = 1) => {
    const { data } = await api.get('/movies/search', { params: { q: query, page } })
    return data
  },

  nowPlaying: async (page = 1) => {
    const { data } = await api.get('/movies/now-playing', { params: { page } })
    return data
  },

  streaming: async (page = 1) => {
    const { data } = await api.get('/movies/streaming', { params: { page } })
    return data
  },

  trending: async (window = 'week') => {
    const { data } = await api.get('/movies/trending', { params: { window } })
    return data
  },

  detail: async (tmdbId) => {
    const { data } = await api.get(`/movies/${tmdbId}`)
    return data
  },
}