// client/src/components/movies/MovieCarousel.jsx

import { useRef, useState, useEffect } from 'react'
import MovieCard from './MovieCard.jsx'

export default function MovieCarousel({ title, movies, loading, error, cardSize = 'md' }) {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 5)
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }

  useEffect(() => {
    checkScroll()
  }, [movies, loading])

  if (error) {
    return (
      <section className="mb-10">
        <h2 className="font-display text-2xl text-white tracking-wide mb-4">
          {title}
        </h2>
        <div className="flex items-center justify-center h-40
                        bg-surface-card rounded-xl border border-surface-border">
          <p className="text-white/30 font-body text-sm">
            No se pudo cargar esta sección.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-10">

      {/* Cabecera de sección */}
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-display text-2xl text-white tracking-wide">
          {title}
        </h2>
        {!loading && movies?.length > 0 && (
          <span className="text-white/20 text-xs font-body">
            {movies.length} títulos
          </span>
        )}
      </div>

      {/* Carrusel con controles dinámicos premium */}
      <div className="relative group/carousel">
        
        {/* ── Control Izquierdo: Cortina + Flecha SVG ── */}
        {showLeft && !loading && (
          <div className="hidden nav:flex absolute left-0 top-0 bottom-3 w-20 z-20
                          bg-gradient-to-r from-surface to-transparent 
                          pointer-events-none items-center justify-start pl-2">
            <button
              onClick={() => {
                scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' })
              }}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full
                         bg-black/60 border border-surface-border text-white
                         hover:bg-brand-500 hover:border-brand-500 transition-all duration-200
                         shadow-2xl hover:scale-110 cursor-pointer"
              aria-label="Desplazar a la izquierda"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Contenedor del scroll */}
        {loading ? (
          <div className="carousel-scroll">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`carousel-item flex-none rounded-xl bg-surface-card
                            animate-pulse ${
                              cardSize === 'sm' ? 'w-28 h-52'
                            : cardSize === 'lg' ? 'w-44 h-72'
                            : 'w-36 h-64'
                            }`}
              />
            ))}
          </div>
        ) : (
          <div 
            ref={scrollRef} 
            onScroll={checkScroll}
            className="carousel-scroll"
          >
            {movies?.map((movie) => (
              <div key={movie.tmdbId} className="carousel-item">
                <MovieCard movie={movie} size={cardSize} />
              </div>
            ))}
          </div>
        )}

        {/* ── Control Derecho: Cortina + Flecha SVG ── */}
        {showRight && !loading && (
          <div className="hidden nav:flex absolute right-0 top-0 bottom-3 w-20 z-20
                          bg-gradient-to-l from-surface to-transparent 
                          pointer-events-none items-center justify-end pr-2">
            <button
              onClick={() => {
                scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' })
              }}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full
                         bg-black/60 border border-surface-border text-white
                         hover:bg-brand-500 hover:border-brand-500 transition-all duration-200
                         shadow-2xl hover:scale-110 cursor-pointer"
              aria-label="Desplazar a la derecha"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

      </div>

    </section>
  )
}
