// client/src/components/movies/HeroBanner.jsx

import { useState, useEffect } from 'react'
import { useGuestGuard } from '../../hooks/useGuestGuard.js'
import { collectionService } from '../../services/collection.service.js'
import GuestModal from '../ui/GuestModal.jsx'
import toast from 'react-hot-toast'

export default function HeroBanner({ movies = [], loading }) {
  const [current, setCurrent]   = useState(0)
  const [adding,  setAdding]    = useState(false)
  const { guardAction, GuestModalProps } = useGuestGuard()

  // Autoplay cada 6 segundos
  useEffect(() => {
    if (!movies.length) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(movies.length, 5))
    }, 6000)
    return () => clearInterval(timer)
  }, [movies.length])

  const handleAddFavorite = async () => {
    const movie = movies[current]
    setAdding(true)
    try {
      await collectionService.add(movie.tmdbId, 'FAVORITE')
      toast.success(`"${movie.title}" añadida a favoritos ❤️`)
    } catch (err) {
      if (err.response?.status === 409) {
        toast('Ya está en tu colección.', { icon: 'ℹ️' })
      } else {
        toast.error('No se pudo añadir.')
      }
    } finally {
      setAdding(false)
    }
  }

  // Skeleton de carga
  if (loading) {
    return (
      <div className="relative w-full h-[420px] nav:h-[520px]
                      bg-surface-card rounded-2xl animate-pulse mb-10" />
    )
  }

  if (!movies.length) return null

  const movie = movies[current]

  return (
    <>
      <div className="relative w-full h-[420px] nav:h-[520px]
                      rounded-2xl overflow-hidden mb-10 group">

        {/* Backdrop */}
        <img
          key={movie.tmdbId}
          src={movie.backdrop || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Gradientes */}
        <div className="absolute inset-0 bg-gradient-to-t
                        from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r
                        from-black/60 via-transparent to-transparent" />

        {/* Contenido */}
        <div className="absolute bottom-0 left-0 right-0 p-6 nav:p-10">

          {/* Rating */}
          {movie.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-amber-400 text-sm font-body font-semibold">
                {movie.rating}
              </span>
              <span className="text-white/30 text-xs font-body">
                ({movie.voteCount?.toLocaleString()} votos)
              </span>
            </div>
          )}

          {/* Título */}
          <h1 className="font-display text-4xl nav:text-6xl text-white
                         tracking-wide leading-none mb-3 max-w-2xl">
            {movie.title.toUpperCase()}
          </h1>

          {/* Año */}
          {movie.year && (
            <p className="text-white/50 font-body text-sm mb-4">
              {movie.year}
            </p>
          )}

          {/* Overview */}
          <p className="text-white/70 font-body text-sm nav:text-base
                        leading-relaxed max-w-xl line-clamp-2 nav:line-clamp-3 mb-6">
            {movie.overview}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => guardAction(handleAddFavorite, 'añadir a favoritos')}
              disabled={adding}
              className="btn-primary flex items-center gap-2"
            >
              <span>{adding ? '…' : '❤️'}</span>
              <span>Añadir a favoritos</span>
            </button>
            <button
              onClick={() => guardAction(
                () => collectionService.add(movie.tmdbId, 'PENDING')
                  .then(() => toast.success('Añadida a pendientes 🕐'))
                  .catch(() => toast('Ya está en tu colección.', { icon: 'ℹ️' })),
                'marcar como pendiente'
              )}
              className="btn-ghost flex items-center gap-2"
            >
              <span>🕐</span>
              <span>Quiero verla</span>
            </button>
          </div>
        </div>

        {/* Indicadores de página */}
        <div className="absolute bottom-6 right-6 flex gap-1.5">
          {Array.from({ length: Math.min(movies.length, 5) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-brand-500'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Película ${i + 1}`}
            />
          ))}
        </div>

      </div>

      <GuestModal {...GuestModalProps} />
    </>
  )
}