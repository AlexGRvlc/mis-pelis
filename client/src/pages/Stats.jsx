// client/src/pages/Stats.jsx

import { useQuery }        from '@tanstack/react-query'
import { useAuth }         from '../context/AuthContext.jsx'
import { statsService }    from '../services/stats.service.js'
import StatCard            from '../components/stats/StatCard.jsx'
import BarChart            from '../components/stats/BarChart.jsx'
import GenreChart          from '../components/stats/GenreChart.jsx'
import RecentActivity      from '../components/stats/RecentActivity.jsx'
import EmptyState          from '../components/ui/EmptyState.jsx'
import { useNavigate }     from 'react-router-dom'

// ── Skeletons ─────────────────────────────
const CardSkeleton = () => (
  <div className="rounded-2xl bg-surface-card border border-surface-border
                  animate-pulse h-32" />
)

const ChartSkeleton = () => (
  <div className="rounded-2xl bg-surface-card border border-surface-border
                  animate-pulse h-64" />
)

export default function Stats() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn:  () => statsService.overview(),
    staleTime: 1000 * 60 * 3,
  })

  const overview = data?.overview

  // ── Error ─────────────────────────────────
  if (isError) {
    return (
      <EmptyState
        icon="📡"
        title="ERROR DE RED"
        description="No se pudieron cargar tus estadísticas."
        action={{ label: 'Reintentar', onClick: () => window.location.reload() }}
      />
    )
  }

  // ── Sin datos todavía ─────────────────────
  if (!isLoading && overview?.summary?.total === 0) {
    return (
      <EmptyState
        icon="📊"
        title="SIN ESTADÍSTICAS"
        description="Añade películas a tu colección para ver tus métricas aquí."
        action={{
          label:   'Explorar películas',
          onClick: () => navigate('/'),
        }}
      />
    )
  }

  const { summary, byYear, topGenres, recent, topFavorite } = overview || {}

    // ── 🧠 Lógica elástica de Niveles Cinéfilos (Paso 1) ────────────────
  const watchedCount = summary?.WATCHED || 0

  let rangeName = 'Espectador Casual'
  let minMovies = 0
  let maxMovies = 10

  if (watchedCount > 10 && watchedCount <= 30) {
    rangeName = 'Aficionado'
    minMovies = 10
    maxMovies = 30
  } else if (watchedCount > 30 && watchedCount <= 70) {
    rangeName = 'Amante del Cine'
    minMovies = 30
    maxMovies = 70
  } else if (watchedCount > 70) {
    rangeName = 'Crítico Experto'
    minMovies = 70
    maxMovies = Number.MAX_SAFE_INTEGER
  }

  // La barra vuelve a nacer desde cero en cada umbral de rango
  const moviesInThisLevel = watchedCount - minMovies
  const totalNeededInThisLevel = maxMovies - minMovies
  const levelProgressPct = maxMovies === Number.MAX_SAFE_INTEGER 
    ? 100 
    : Math.min(Math.round((moviesInThisLevel / totalNeededInThisLevel) * 100), 100)


  // ── Película favorita — la más reciente con estado FAVORITE

  return (
    <div className="pt-4 nav:pt-0 w-full max-w-full overflow-x-hidden px-4">

      {/* ── Cabecera ───────────────────────── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl nav:text-5xl text-white
                       tracking-wide mb-1">
          ESTADÍSTICAS
        </h1>
        <p className="text-white/30 font-body text-sm">
          {user?.name?.split(' ')[0]} · Tu historial cinematográfico
        </p>
      </div>

      {/* ── Tarjetas métricas ──────────────── */}
      <div className="grid grid-cols-2 nav:grid-cols-4 gap-3 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              emoji="🎬"
              label="Total guardadas"
              value={summary?.total ?? 0}
              accent
            />
            <StatCard
              emoji="✅"
              label="Vistas"
              value={summary?.WATCHED ?? 0}
              sublabel={
                summary?.total > 0
                  ? `Rango: ${rangeName}`
                  : null
              }
            />
            <StatCard
              emoji="🕐"
              label="Pendientes"
              value={summary?.PENDING ?? 0}
            />
            <StatCard
              emoji="❤️"
              label="Favoritas"
              value={summary?.FAVORITE ?? 0}
            />
          </>
        )}
      </div>

      {/* ── Gráficos ───────────────────────── */}
      <div className="flex flex-col nav:grid nav:grid-cols-2 gap-4 mb-6">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Gráfico de barras por año */}
            {byYear?.length > 0 && (
              <BarChart
                title="📅 VISTAS POR AÑO"
                data={byYear}
              />
            )}

            {/* Gráfico de géneros */}
            {topGenres?.length > 0 && (
              <GenreChart
                title="🎭 GÉNEROS FAVORITOS"
                data={topGenres}
              />
            )}
          </>
        )}
      </div>

      {/* ── Fila inferior ──────────────────── */}
      <div className="grid nav:grid-cols-2 gap-4 mb-6">

        {/* Dato destacado — ratio vistas */}
        {!isLoading && summary?.total > 0 && (
          <div className="bg-surface-card border border-surface-border
                          rounded-2xl p-5 nav:p-6 flex flex-col
                          justify-between nav:justify-start nav:gap-8 min-w-0">

            <h3 className="font-display text-xl text-white
                           tracking-wide mb-4">
              🏆 DESTACADOS
            </h3>

            <div className="flex flex-col gap-4">

             
              {/* Ratio de Progreso Gamificado por Niveles */}
                <div>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex flex-col">
                    <span className="font-body text-xs text-white/40 uppercase tracking-wider">
                      Progreso de Nivel
                    </span>
                    <span className="font-body text-sm text-white/70 font-medium mt-0.5">
                      Rango actual: <span className="text-brand-400 font-semibold">{rangeName}</span>
                    </span>
                  </div>
                  <span className="font-display text-2xl text-brand-400">
                    {levelProgressPct}%
                  </span>
                </div>
                
                <div className="w-full bg-surface-elevated rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                    style={{ width: `${levelProgressPct}%` }}
                  />
                </div>
                
                {maxMovies !== Number.MAX_SAFE_INTEGER && (
                  <p className="text-[11px] text-white/20 font-body mt-1.5 text-right">
                    Te faltan {maxMovies - watchedCount} pelis para el próximo nivel
                  </p>
                )}
              </div>


              {/* Género número 1 */}
              {topGenres?.[0] && (
          <div className="flex items-center justify-between bg-surface-elevated rounded-xl p-3">
            <div>
              <p className="text-white/40 text-xs font-body">
                Género favorito
              </p>
              <p className="text-white font-body font-semibold text-sm mt-0.5">
                {topGenres[0].genre}
              </p>
            </div>
            <span className="font-display text-3xl text-brand-500">
              #{topGenres[0].count}
            </span>
          </div>
        )}

              {/* Favorita más reciente */}
              {topFavorite && (
                <div className="flex items-center gap-3
                                bg-surface-elevated rounded-xl p-3">
                  <div className="w-10 h-14 rounded-lg overflow-hidden flex-none">
                    {topFavorite.movie.posterUrl ? (
                      <img
                        src={topFavorite.movie.posterUrl}
                        alt={topFavorite.movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-border
                                      flex items-center justify-center">
                        <span>🎬</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/40 text-xs font-body">
                      Último favorito
                    </p>
                    <p className="text-white font-body font-semibold
                                  text-sm truncate mt-0.5">
                      {topFavorite.movie.title}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Actividad reciente */}
        {!isLoading && recent?.length > 0 && (
          <RecentActivity entries={recent} />
        )}

      </div>

    </div>
  )
}