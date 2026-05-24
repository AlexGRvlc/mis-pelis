// client/src/pages/MovieDetail.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { moviesService }     from '../services/movies.service.js'
import { collectionService } from '../services/collection.service.js'
import { useGuestGuard }     from '../hooks/useGuestGuard.js'
import { useQueryClient }    from '@tanstack/react-query'
import GuestModal            from '../components/ui/GuestModal.jsx'
import toast                 from 'react-hot-toast'

// ── Icono de flecha atrás ─────────────────
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

// ── Icono de estrella ─────────────────────
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const STATUS_OPTIONS = [
  { value: 'WATCHED',  label: 'Vista',        emoji: '✅' },
  { value: 'PENDING',  label: 'Quiero verla', emoji: '🕐' },
  { value: 'FAVORITE', label: 'Favorita',     emoji: '❤️' },
]

// ── Skeleton de carga ─────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 nav:h-96 bg-surface-card rounded-2xl mb-6" />
    <div className="flex gap-4 mb-6">
      <div className="w-32 h-48 bg-surface-card rounded-xl flex-none" />
      <div className="flex-1 space-y-3">
        <div className="h-8 bg-surface-card rounded-lg w-3/4" />
        <div className="h-4 bg-surface-card rounded w-1/4" />
        <div className="h-4 bg-surface-card rounded w-1/2" />
        <div className="h-20 bg-surface-card rounded-lg" />
      </div>
    </div>
  </div>
)

export default function MovieDetail() {
  const { tmdbId }     = useParams()
  const navigate       = useNavigate()
  const queryClient    = useQueryClient()
  const { guardAction, GuestModalProps } = useGuestGuard()

  const [adding, setAdding]   = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // ── Datos de la película ──────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', tmdbId],
    queryFn:  () => moviesService.detail(tmdbId),
    staleTime: 1000 * 60 * 10,
  })

  const movie = data?.movie

  // ── Añadir a colección ────────────────────
  const handleAdd = async (status) => {
    setMenuOpen(false)
    setAdding(true)
    try {
      await collectionService.add(movie.tmdbId, status)
      toast.success(`"${movie.title}" añadida como ${
        STATUS_OPTIONS.find(o => o.value === status)?.emoji
      }`)
      queryClient.invalidateQueries({ queryKey: ['collection'] })
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

  // ── Error ─────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl">😕</span>
        <p className="font-display text-2xl text-white">PELÍCULA NO ENCONTRADA</p>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="pb-8">

        {/* ── Botón volver ───────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white
                     font-body text-sm transition-colors mb-4 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-150">
            <BackIcon />
          </span>
          Volver
        </button>

        {isLoading ? <DetailSkeleton /> : (
          <>
            {/* ── Backdrop ───────────────────── */}
            {movie.backdrop && (
              <div className="relative w-full h-48 nav:h-80
                              rounded-2xl overflow-hidden mb-6">
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                                from-surface via-surface/40 to-transparent" />
              </div>
            )}

            {/* ── Cabecera — póster + info principal ── */}
            <div className="flex gap-5 mb-8 -mt-16 nav:-mt-24 relative z-10 px-2">

              {/* Póster */}
              <div className="w-28 nav:w-44 flex-none">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl shadow-black/60"
                />
              </div>

              {/* Info principal */}
              <div className="flex-1 min-w-0 pt-16 nav:pt-24">

                {/* Título */}
                <h1 className="font-display text-2xl nav:text-4xl text-white
                               tracking-wide leading-tight mb-1">
                  {movie.title.toUpperCase()}
                </h1>

                {/* Tagline */}
                {movie.tagline && (
                  <p className="text-brand-400 font-body text-sm italic mb-2">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Metadatos */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1
                                text-white/40 font-body text-xs mb-3">
                  {movie.year && <span>{movie.year}</span>}
                  {movie.runtime && (
                    <>
                      <span>·</span>
                      <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    </>
                  )}
                  {movie.rating && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <StarIcon />
                        <span className="text-amber-400 font-semibold">
                          {movie.rating}
                        </span>
                        <span className="text-white/25">
                          ({movie.voteCount?.toLocaleString()})
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {/* Géneros */}
                {movie.genreNames?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {movie.genreNames.map((genre) => (
                      <span
                        key={genre}
                        className="bg-surface-elevated border border-surface-border
                                   text-white/60 text-xs font-body px-2.5 py-1
                                   rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA añadir */}
                <div className="relative">
                  <button
                    onClick={() => guardAction(() => setMenuOpen(true), 'añadir películas a tu colección')}
                    disabled={adding}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <span>{adding ? '…' : '+'}</span>
                    <span>Añadir a colección</span>
                  </button>

                  {/* Menú desplegable de estados */}
                  {menuOpen && (
                    <div className="absolute top-full left-0 mt-2 z-20
                                    bg-surface-card border border-surface-border
                                    rounded-xl shadow-xl overflow-hidden min-w-48">
                      {STATUS_OPTIONS.map(({ value, label, emoji }) => (
                        <button
                          key={value}
                          onClick={() => handleAdd(value)}
                          className="flex items-center gap-3 w-full px-4 py-3
                                     text-white/70 hover:text-white hover:bg-surface-elevated
                                     font-body text-sm transition-colors text-left"
                        >
                          <span>{emoji}</span>
                          <span>{label}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full px-4 py-2 text-white/25 hover:text-white/50
                                   font-body text-xs transition-colors border-t
                                   border-surface-border"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* ── Sinopsis ───────────────────── */}
            {movie.overview && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-white tracking-wide mb-3">
                  SINOPSIS
                </h2>
                <p className="font-body text-white/60 leading-relaxed text-sm
                               nav:text-base max-w-3xl">
                  {movie.overview}
                </p>
              </section>
            )}

            {/* ── Equipo ─────────────────────── */}
            {(movie.director || movie.cast?.length > 0) && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-white tracking-wide mb-4">
                  EQUIPO
                </h2>
                <div className="flex flex-col gap-2 max-w-md">
                  {movie.director && (
                    <div className="flex items-center justify-between
                                    bg-surface-card border border-surface-border
                                    rounded-xl px-4 py-3">
                      <span className="text-white/40 font-body text-xs uppercase
                                       tracking-wider">
                        Director
                      </span>
                      <span className="text-white font-body font-medium text-sm">
                        {movie.director}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Reparto ────────────────────── */}
            {movie.cast?.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-white tracking-wide mb-4">
                  REPARTO PRINCIPAL
                </h2>
                <div className="grid grid-cols-2 nav:grid-cols-3 lg:grid-cols-5 gap-3">
                  {movie.cast.map((actor) => (
                    <div
                      key={actor.name}
                      className="bg-surface-card border border-surface-border
                                 rounded-xl overflow-hidden"
                    >
                      {/* Foto del actor */}
                      <div className="aspect-[2/3] bg-surface-elevated">
                        {actor.photo ? (
                          <img
                            src={actor.photo}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center
                                          justify-center">
                            <span className="text-3xl">👤</span>
                          </div>
                        )}
                      </div>
                      {/* Nombre y personaje */}
                      <div className="p-2.5">
                        <p className="text-white font-body font-medium text-xs
                                      leading-tight truncate">
                          {actor.name}
                        </p>
                        <p className="text-white/30 font-body text-xs truncate mt-0.5">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Tráiler ────────────────────── */}
            {movie.trailer && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-white tracking-wide mb-4">
                  TRÁILER
                </h2>
                <div className="relative w-full max-w-2xl"
                     style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailer}`}
                    title={`Tráiler de ${movie.title}`}
                    allow="accelerometer; autoplay; clipboard-write;
                           encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-2xl"
                  />
                </div>
              </section>
            )}

            {/* ── Películas similares ─────────── */}
            {movie.similar?.length > 0 && (
              <section className="mb-4">
                <h2 className="font-display text-xl text-white tracking-wide mb-4">
                  PELÍCULAS SIMILARES
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-3 carousel-scroll">
                  {movie.similar.map((similar) => (
                    <div
                      key={similar.tmdbId}
                      onClick={() => navigate(`/movie/${similar.tmdbId}`)}
                      className="carousel-item w-28 nav:w-36 flex-none
                                 movie-card cursor-pointer"
                    >
                      <div className="h-40 nav:h-52 bg-surface-card">
                        {similar.posterUrl ? (
                          <img
                            src={similar.posterUrl}
                            alt={similar.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl">🎬</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-body font-medium
                                      leading-tight line-clamp-2">
                          {similar.title}
                        </p>
                        {similar.year && (
                          <p className="text-white/30 text-xs font-body mt-0.5">
                            {similar.year}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </>
        )}
      </div>

      <GuestModal {...GuestModalProps} />
    </>
  )
}