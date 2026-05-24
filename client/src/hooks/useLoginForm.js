import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js' // 👈 Cambiamos Context por tu Store de Zustand
import api from '../services/api.js' // 👈 Importamos tu cliente Axios configurado
import toast from 'react-hot-toast'

const INITIAL_LOGIN    = { email: '', password: '' }
const INITIAL_REGISTER = { name: '', email: '', password: '', confirm: '' }

export const useLoginForm = (initialMode = 'login') => {
  const setAuth             = useAuthStore((state) => state.setAuth) // 🧠 Traemos la acción de Zustand
  const navigate            = useNavigate()

  const [mode,    setMode]    = useState(initialMode)
  const [fields,  setFields]  = useState(
    initialMode === 'login' ? INITIAL_LOGIN : INITIAL_REGISTER
  )
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  // ── Cambio de campo ───────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
  }, [])

  // ── Cambio de modo login ↔ register ──────
  const toggleMode = useCallback(() => {
    const next = mode === 'login' ? 'register' : 'login'
    setMode(next)
    setFields(next === 'login' ? INITIAL_LOGIN : INITIAL_REGISTER)
    setErrors({})
  }, [mode])

  // ── Validación en cliente ─────────────────
  const validate = useCallback(() => {
    const errs = {}

    if (mode === 'register' && !fields.name?.trim()) {
      errs.name = 'El nombre es obligatorio.'
    }

    if (!fields.email?.trim()) {
      errs.email = 'El email es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = 'El email no tiene un formato válido.'
    }

    if (!fields.password) {
      errs.password = 'La contraseña es obligatoria.'
    } else if (fields.password.length < 8) {
      errs.password = 'Mínimo 8 caracteres.'
    }

    if (mode === 'register' && fields.password !== fields.confirm) {
      errs.confirm = 'Las contraseñas no coinciden.'
    }

    return errs
  }, [mode, fields])

  // ── Submit ────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    
    // 🧠 LIMPIEZA CRÍTICA PARA MÓVILES: Evita mayúsculas automáticas y espacios del teclado
    const cleanEmail = fields.email.trim().toLowerCase()
    const cleanPassword = fields.password.trim()

    try {
      if (mode === 'login') {
        // Ejecutamos la petición directa con Axios
        const response = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword })
        
        // Guardamos los datos de la respuesta en tu Zustand validado
        setAuth(response.data.token, response.data.user)
        toast.success('¡Bienvenido de nuevo!')
      } else {
        const cleanName = fields.name.trim()
        const response = await api.post('/auth/register', { name: cleanName, email: cleanEmail, password: cleanPassword })
        
        setAuth(response.data.token, response.data.user)
        toast.success('¡Cuenta creada! Bienvenido a Mis Pelis.')
      }
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Ha ocurrido un error. Inténtalo de nuevo.'
      toast.error(message)

      if (err.response?.status === 409) {
        setErrors({ email: 'Ya existe una cuenta con ese email.' })
      }
    } finally {
      setLoading(false)
    }
  }, [mode, fields, validate, setAuth, navigate])

  return {
    mode,
    fields,
    errors,
    loading,
    handleChange,
    handleSubmit,
    toggleMode,
  }
}
