// client/src/hooks/useDebounce.js

import { useState, useEffect } from 'react'

// Retrasa la actualización de un valor hasta que el usuario
// deje de escribir. Evita lanzar una petición por cada tecla.
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}