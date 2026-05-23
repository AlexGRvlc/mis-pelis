// client/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { authService } from '../services/auth.service.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  // Sincronizar el token del store con el header de Axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  // Al montar, verificar que el token guardado sigue siendo válido
  useEffect(() => {
    const verifySession = async () => {
      if (!token) return
      try {
        await authService.getMe()
      } catch {
        // Token inválido o expirado — limpiar sesión
        clearAuth()
      }
    }
    verifySession()
  }, []) // Solo al montar

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    setAuth(data.token, data.user)
    return data
  }, [setAuth])

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData)
    setAuth(data.token, data.user)
    return data
  }, [setAuth])

  const socialLogin = useCallback(async (oauthData) => {
    const data = await authService.socialLogin(oauthData)
    setAuth(data.token, data.user)
    return data
  }, [setAuth])

  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      register,
      socialLogin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de consumo — más limpio que useContext directo

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}