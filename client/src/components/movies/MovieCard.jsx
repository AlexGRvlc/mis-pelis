// client/src/components/movies/MovieCard.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuestGuard } from '../../hooks/useGuestGuard.js'
import { collectionService } from '../../services/collection.service.js'
import { useQueryClient } from '@tanstack/react-query'
import GuestModal from '../ui/GuestModal.jsx'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'WATCHED',  label: '✅ Vista',        className: 'badge-watched'  },
  { value: 'PENDING',  label: '🕐 Quiero verla', className: 'badge-pending'  },
  { value: 'FAVORITE', label: '❤️ Favorita',      className: 'badge-favorite' },
]

const PosterFallback = ({ title }) => (
  <div className="w-full h-full bg-surface-elevated flex flex-col
                  items-center justify-center gap-2 p-3">
    <span className="text-4xl">🎬</span>
    <span className="text-white/40 text-xs text-center font-body leading-tight">
      {title}
    </span>
  </div>
)

export default function MovieCard({ movie, size = 'md' }) {
  const navigate    = useNavigate()
  const { guardAction, GuestModalProps } = useGuestGuard()
  const queryClient = useQueryClient()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [entryStatus, setEntryStatus] = useState(null)

  const sizes = {
    sm: 'w-28 flex-none',
    md: 'w-36 flex-none',
    lg: 'w-44 flex-none',
  }

  const posterHeights = {
    sm: 'h-40',
    md: 'h-52',
    lg: 'h-64',
  }

  const handleStatusSelect = async (status) => {
    setMenuOpen(false)
    setLoading(true)
    try {
      await collectionService.add(movie.tmdbId, status)
      setEntryStatus(status)
      toast.success(`"${movie.title}" añadida como ${
        STATUS_OPTIONS.find(o => o.value === status)?.label
      }`)
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    } catch (err) {
      if (err.response?.status === 409) {
        toast('Esta película ya está en tu colección.', { icon: 'ℹ️' })
      } else {
        toast.error('No se pudo añadir la película.')
      }
    } finally {
      setLoading(false)
    }
  }

  const currentBadge = STATUS_OPTIONS.find(o => o.value === entryStatus)

  return (
    <>
      <div className={`movie-card group ${sizes[size]}`}>

        {/* Póster — clickable al detalle */}
        <div
          className={`relative ${posterHeights[size]} bg-surface-card cursor-pointer`}
          onClick={() => navigate(`/movie/${movie.tmdbId}`)}
        >
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <PosterFallback title={movie.title} />
          )}

          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50
                          transition-colors duration-200" />

          {/* Badge de estado */}
          {currentBadge && (
            <div className="absolute top-2 left-2">
              <span className={currentBadge.className}>
                {currentBadge.label}
              </span>
            </div>
          )}

          {/* Botón añadir — aparece en hover */}
          <div className="absolute inset-0 flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation()
                guardAction(() => setMenuOpen(true), 'añadir películas a tu colección')
              }}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 text-white
                         rounded-full p-3 shadow-lg transition-all duration-150
                         disabled:opacity-50 hover:scale-110 active:scale-95"
              aria-label="Añadir a colección"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>

          {/* Menú de estado */}
          {menuOpen && (
            <div
              className="absolute inset-0 bg-black/90 flex flex-col
                         items-stretch justify-center gap-2 p-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white/50 text-xs text-center font-body mb-1">
                Añadir como…
              </p>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleStatusSelect(value)}
                  className="bg-surface-elevated hover:bg-surface-border
                             text-white text-xs font-body font-medium
                             py-2 px-3 rounded-lg transition-colors text-left"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/30 hover:text-white/60 text-xs
                           font-body text-center mt-1 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Info — también clickable */}
        <div
          className="p-2 cursor-pointer"
          onClick={() => navigate(`/movie/${movie.tmdbId}`)}
        >
          <p className="text-white text-xs font-body font-medium
                        leading-tight line-clamp-2 group-hover:text-brand-400
                        transition-colors">
            {movie.title}
          </p>
          {movie.year && (
            <p className="text-white/30 text-xs font-body mt-0.5">
              {movie.year}
            </p>
          )}
        </div>

      </div>

      <GuestModal {...GuestModalProps} />
    </>
  )
}