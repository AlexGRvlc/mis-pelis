// client/src/pages/Home.jsx

import { useQuery } from '@tanstack/react-query'
import { moviesService } from '../services/movies.service.js'
import HeroBanner     from '../components/movies/HeroBanner.jsx'
import MovieCarousel  from '../components/movies/MovieCarousel.jsx'

export default function Home() {

  // ── Trending — para el hero ───────────────
  const {
    data:    trendingData,
    isLoading: trendingLoading,
    isError:   trendingError,
  } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn:  () => moviesService.trending('week'),
    staleTime: 1000 * 60 * 10,   // 10 min — trending no cambia rápido
  })

  // ── En cartelera ──────────────────────────
  const {
    data:    nowPlayingData,
    isLoading: nowPlayingLoading,
    isError:   nowPlayingError,
  } = useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn:  () => moviesService.nowPlaying(),
    staleTime: 1000 * 60 * 15,
  })

  // ── Novedades en streaming ────────────────
  const {
    data:    streamingData,
    isLoading: streamingLoading,
    isError:   streamingError,
  } = useQuery({
    queryKey: ['movies', 'streaming'],
    queryFn:  () => moviesService.streaming(),
    staleTime: 1000 * 60 * 15,
  })

  return (
    <div className="pt-4 nav:pt-0">

      {/* Hero — películas trending */}
      <HeroBanner
        movies={trendingData?.results || []}
        loading={trendingLoading}
      />

      {/* En Cartelera */}
      <MovieCarousel
        title="🎟️ En Cartelera"
        movies={nowPlayingData?.results || []}
        loading={nowPlayingLoading}
        error={nowPlayingError}
        cardSize="md"
      />

      {/* Novedades en Streaming */}
      <MovieCarousel
        title="📺 Novedades en Streaming"
        movies={streamingData?.results || []}
        loading={streamingLoading}
        error={streamingError}
        cardSize="md"
      />

      {/* Trending semanal — segunda fila */}
      <MovieCarousel
        title="🔥 Tendencias de la Semana"
        movies={trendingData?.results?.slice(5) || []}
        loading={trendingLoading}
        error={trendingError}
        cardSize="sm"
      />

    </div>
  )
}