// client/src/components/movies/MovieGrid.jsx

import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ movies, loading, skeletonCount = 12 }) {

  if (loading) {
    return (
      <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6
                      gap-3 nav:gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-card animate-pulse"
            style={{ aspectRatio: '2/3' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6
                    gap-3 nav:gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.tmdbId} movie={movie} size="md" />
      ))}
    </div>
  )
}