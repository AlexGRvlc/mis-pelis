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

  const { summary, byYear, topGenres, recent } = overview || {}

  // ── Película favorita — la más reciente con estado FAVORITE
  const topFavorite = recent?.find((e) => e.status === 'FAVORITE')

  return (
    <div className="pt-4 nav:pt-0">

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
                  ? `${Math.round((summary.WATCHED / summary.total) * 100)}% del total`
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
      <div className="grid nav:grid-cols-2 gap-4 mb-6">
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
                          justify-between">

            <h3 className="font-display text-xl text-white
                           tracking-wide mb-4">
              🏆 HIGHLIGHTS
            </h3>

            <div className="flex flex-col gap-4">

              {/* Ratio completadas */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-body text-sm text-white/50">
                    Completadas
                  </span>
                  <span className="font-display text-2xl text-brand-400">
                    {Math.round((summary.WATCHED / summary.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((summary.WATCHED / summary.total) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Género número 1 */}
              {topGenres?.[0] && (
                <div className="flex items-center justify-between
                                bg-surface-elevated rounded-xl p-3">
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