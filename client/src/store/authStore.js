// client/src/store/authStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user:  null,
      isAuthenticated: false,

      // ── Acciones ──────────────────────────
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },

      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },

      updateUser: (updatedUser) => {
        set({ user: { ...get().user, ...updatedUser } })
      },
    }),
    {
      name: 'mpelis_auth',           // Clave en localStorage
      partialize: (state) => ({      // Solo persiste token y user
        token: state.token,
        user:  state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)