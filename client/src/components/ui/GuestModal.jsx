// client/src/components/ui/GuestModal.jsx

import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GuestModal({ isOpen, onClose, action = 'hacer esto' }) {
  const navigate = useNavigate()

  // Cerrar con Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 z-[100] flex items-end nav:items-center
                 justify-center p-4 nav:p-0"
      onClick={onClose}
    >
      {/* Fondo oscuro con blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel del modal */}
      <div
        className="relative z-10 w-full nav:max-w-md bg-surface-card
                   rounded-t-3xl nav:rounded-2xl p-8
                   border border-surface-border
                   animate-[slideUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Pill de arrastre — solo móvil */}
        <div className="nav:hidden w-12 h-1 bg-surface-border rounded-full
                        mx-auto mb-6" />

        {/* Icono */}
        <div className="w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center
                        justify-center mx-auto mb-5">
          <span className="text-3xl">🎬</span>
        </div>

        {/* Texto */}
        <div className="text-center mb-7">
          <h2 className="font-display text-3xl text-white tracking-wide mb-2">
            ÚNETE A MIS PELIS
          </h2>
          <p className="text-white/50 font-body text-sm leading-relaxed">
            Para poder{' '}
            <span className="text-white/80 font-medium">{action}</span>,
            necesitas tener una cuenta. Es gratis y tarda menos de un minuto.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { onClose(); navigate('/login') }}
            className="btn-primary w-full text-center py-3"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { onClose(); navigate('/login?mode=register') }}
            className="btn-ghost w-full text-center py-3"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 font-body text-sm
                       transition-colors py-1"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  )
}