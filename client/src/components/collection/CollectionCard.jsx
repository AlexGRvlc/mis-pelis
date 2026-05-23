// client/src/components/collection/CollectionCard.jsx

import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'WATCHED',  label: 'Vista',        emoji: '✅', className: 'badge-watched'  },
  { value: 'PENDING',  label: 'Pendiente',    emoji: '🕐', className: 'badge-pending'  },
  { value: 'FAVORITE', label: 'Favorita',     emoji: '❤️', className: 'badge-favorite' },
]

// ── Icono de menú (tres puntos) ───────────
const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="5"  cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
)

// ── Icono de papelera ─────────────────────
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
)

export default function CollectionCard({ entry, onUpdateStatus, onRemove, isUpdating }) {
  const [menuOpen,        setMenuOpen]        = useState(false)
  const [confirmDelete,   setConfirmDelete]   = useState(false)

  const { movie, status, id } = entry
  const currentStatus = STATUS_OPTIONS.find((o) => o.value === status)

  return (
    <div className="movie-card group relative">

      {/* Póster */}
      <div className="relative aspect-[2/3] bg-surface-card">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                        transition-colors duration-200" />

        {/* Badge de estado — siempre visible */}
        <div className="absolute top-2 left-2">
          <span className={currentStatus?.className}>
            {currentStatus?.emoji}
          </span>
        </div>

        {/* Botón de menú — aparece en hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                        transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((prev) => !prev)
              setConfirmDelete(false)
            }}
            className="bg-black/70 hover:bg-black/90 text-white
                       rounded-lg p-1.5 transition-colors"
            aria-label="Opciones"
          >
            <DotsIcon />
          </button>
        </div>

        {/* ── Menú de opciones ─────────────── */}
        {menuOpen && (
          <div
            className="absolute inset-0 bg-black/90 z-10
                       flex flex-col p-3 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/40 text-[10px] font-body
                          uppercase tracking-wider mb-1">
              Cambiar estado
            </p>

            {/* Opciones de estado */}
            {STATUS_OPTIONS.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => {
                  onUpdateStatus(id, value)
                  setMenuOpen(false)
                }}
                disabled={isUpdating || value === status}
                className={`flex items-center gap-2 text-xs font-body
                            font-medium py-1.5 px-2 rounded-lg
                            transition-colors text-left
                            disabled:opacity-40 ${
                  value === status
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'hover:bg-surface-elevated text-white/70 hover:text-white'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
                {value === status && (
                  <span className="ml-auto text-brand-400">✓</span>
                )}
              </button>
            ))}

            <div className="h-px bg-surface-border my-1" />

            {/* Confirmar eliminación */}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-xs font-body
                           font-medium py-1.5 px-2 rounded-lg
                           text-rose-400 hover:bg-rose-500/10
                           transition-colors text-left"
              >
                <TrashIcon />
                <span>Eliminar</span>
              </button>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-[10px] font-body text-center">
                  ¿Seguro?
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      onRemove(id)
                      setMenuOpen(false)
                    }}
                    className="flex-1 bg-rose-500 hover:bg-rose-600
                               text-white text-xs font-body font-semibold
                               py-1.5 rounded-lg transition-colors"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 bg-surface-elevated hover:bg-surface-border
                               text-white/60 text-xs font-body font-medium
                               py-1.5 rounded-lg transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {/* Cerrar */}
            <button
              onClick={() => {
                setMenuOpen(false)
                setConfirmDelete(false)
              }}
              className="text-white/20 hover:text-white/50 text-[10px]
                         font-body text-center mt-1 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-white text-xs font-body font-medium
                      leading-tight line-clamp-2">
          {movie.title}
        </p>
        {movie.year && (
          <p className="text-white/30 text-xs font-body mt-0.5">
            {movie.year}
          </p>
        )}
      </div>

    </div>
  )
}