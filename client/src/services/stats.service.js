// client/src/services/stats.service.js

import api from './api.js'

export const statsService = {
  summary: async () => {
    const { data } = await api.get('/stats/summary')
    return data
  },

  byYear: async () => {
    const { data } = await api.get('/stats/by-year')
    return data
  },

  genres: async () => {
    const { data } = await api.get('/stats/genres')
    return data
  },

  overview: async () => {
    const { data } = await api.get('/stats/overview')
    return data
  },
}