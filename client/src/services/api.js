// client/src/services/api.js

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ───────────────────
// Inyecta el JWT en cada petición automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mpelis_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ──────────────────
// Maneja el 401 globalmente — token expirado o inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión y redirigir al login
      localStorage.removeItem('mpelis_token')
      localStorage.removeItem('mpelis_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api