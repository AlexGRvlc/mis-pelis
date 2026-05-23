// client/src/hooks/useGuestGuard.js

import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

// Uso:
// const { guardAction, GuestModalProps } = useGuestGuard()
// <button onClick={() => guardAction(() => addFavorite(id), 'añadir favoritos')}>
// <GuestModal {...GuestModalProps} />

export const useGuestGuard = () => {
  const { isAuthenticated } = useAuth()
  const [modalOpen, setModalOpen]   = useState(false)
  const [actionLabel, setActionLabel] = useState('hacer esto')

  // Envuelve cualquier acción — si no está auth, abre el modal
  const guardAction = useCallback((action, label = 'hacer esto') => {
    if (isAuthenticated) {
      action()
    } else {
      setActionLabel(label)
      setModalOpen(true)
    }
  }, [isAuthenticated])

  const GuestModalProps = {
    isOpen:  modalOpen,
    onClose: () => setModalOpen(false),
    action:  actionLabel,
  }

  return { guardAction, GuestModalProps }
}