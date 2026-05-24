// // client/src/components/movies/MovieGrid.jsx

// import MovieCard from './MovieCard.jsx'

// export default function MovieGrid({ movies, loading, skeletonCount = 12 }) {

//   if (loading) {
//     return (
//       <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6
//                       gap-3 nav:gap-4">
//         {Array.from({ length: skeletonCount }).map((_, i) => (
//           <div
//             key={i}
//             className="rounded-xl bg-surface-card animate-pulse"
//             style={{ aspectRatio: '2/3' }}
//           />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6
//                     gap-3 nav:gap-4">
//       {movies.map((movie) => (
//         <MovieCard key={movie.tmdbId} movie={movie} size="md" />
//       ))}
//     </div>
//   )
// }

import MovieCard from './MovieCard.jsx'

// 🧠 Añadimos la prop "cols" con un valor por defecto de 3 por si otras páginas lo usan
export default function MovieGrid({ movies, loading, skeletonCount = 12, cols = 3 }) {

  // Definimos dinámicamente las clases del grid según la prop pasada
  const gridClasses = cols === 2 
    ? "grid grid-cols-2 sm:grid-cols-3 nav:grid-cols-4 lg:grid-cols-6 gap-4"
    : "grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6 gap-3 nav:gap-4";

  if (loading) {
    return (
      <div className={gridClasses}>
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
    <div className={gridClasses}>
      {movies.map((movie) => (
        <MovieCard key={movie.tmdbId} movie={movie} size="md" />
      ))}
    </div>
  )
}
