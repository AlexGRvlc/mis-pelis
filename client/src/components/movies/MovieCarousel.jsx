// client/src/components/movies/MovieCarousel.jsx

import MovieCard from './MovieCard.jsx'

export default function MovieCarousel({ title, movies, loading, error, cardSize = 'md' }) {

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

      {/* Carrusel */}
      {loading ? (
        <div className="carousel-scroll">
          {/* Skeletons de carga */}
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
        <div className="carousel-scroll">
          {movies?.map((movie) => (
            <div key={movie.tmdbId} className="carousel-item">
              <MovieCard movie={movie} size={cardSize} />
            </div>
          ))}
        </div>
      )}

    </section>
  )
}