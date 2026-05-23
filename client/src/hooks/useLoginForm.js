// client/src/hooks/useLoginForm.js

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const INITIAL_LOGIN    = { email: '', password: '' }
const INITIAL_REGISTER = { name: '', email: '', password: '', confirm: '' }

export const useLoginForm = (initialMode = 'login') => {
  const { login, register } = useAuth()
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
    // Limpiar error del campo al escribir
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
    try {
      if (mode === 'login') {
        await login({ email: fields.email, password: fields.password })
        toast.success('¡Bienvenido de nuevo!')
      } else {
        await register({ name: fields.name, email: fields.email, password: fields.password })
        toast.success('¡Cuenta creada! Bienvenido a Mis Pelis.')
      }
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Ha ocurrido un error. Inténtalo de nuevo.'
      toast.error(message)

      // Si el error viene del servidor con campo específico, mostrarlo inline
      if (err.response?.status === 409) {
        setErrors({ email: 'Ya existe una cuenta con ese email.' })
      }
    } finally {
      setLoading(false)
    }
  }, [mode, fields, validate, login, register, navigate])

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