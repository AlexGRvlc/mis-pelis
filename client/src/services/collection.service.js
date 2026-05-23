// client/src/services/collection.service.js

import api from './api.js'

export const collectionService = {
  getAll: async (status, page = 1) => {
    const { data } = await api.get('/collection', { params: { status, page } })
    return data
  },

  add: async (tmdbId, status) => {
    const { data } = await api.post('/collection', { tmdbId, status })
    return data
  },

  updateStatus: async (entryId, status) => {
    const { data } = await api.patch(`/collection/${entryId}`, { status })
    return data
  },

  remove: async (entryId) => {
    const { data } = await api.delete(`/collection/${entryId}`)
    return data
  },

  check: async (tmdbId) => {
    const { data } = await api.get(`/collection/check/${tmdbId}`)
    return data
  },
}