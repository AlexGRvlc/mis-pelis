// client/src/components/stats/RecentActivity.jsx

const STATUS_META = {
  WATCHED:  { label: 'Marcada como vista',      emoji: '✅', className: 'badge-watched'  },
  PENDING:  { label: 'Añadida a pendientes',    emoji: '🕐', className: 'badge-pending'  },
  FAVORITE: { label: 'Añadida a favoritos',     emoji: '❤️', className: 'badge-favorite' },
}

const timeAgo = (dateString) => {
  const diff    = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)

  if (minutes < 1)  return 'Ahora mismo'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours   < 24) return `Hace ${hours}h`
  if (days    < 7)  return `Hace ${days}d`
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short'
  })
}

export default function RecentActivity({ entries = [] }) {
  if (!entries.length) return null

  return (
    <div className="bg-surface-card border border-surface-border
                    rounded-2xl p-5 nav:p-6">

      <h3 className="font-display text-xl text-white tracking-wide mb-5">
        🕐 ACTIVIDAD RECIENTE
      </h3>

      <div className="flex flex-col divide-y divide-surface-border">
        {entries.map((entry) => {
          const meta = STATUS_META[entry.status]

          return (
            <div key={entry.id}
                 className="flex items-center gap-3 py-3
                             first:pt-0 last:pb-0 group">

              {/* Póster miniatura */}
              <div className="w-10 h-14 rounded-lg overflow-hidden
                              bg-surface-elevated flex-none">
                {entry.movie.posterUrl ? (
                  <img
                    src={entry.movie.posterUrl}
                    alt={entry.movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg">🎬</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-body font-medium
                              truncate group-hover:text-brand-400
                              transition-colors">
                  {entry.movie.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={meta?.className}>
                    {meta?.emoji} {meta?.label}
                  </span>
                </div>
              </div>

              {/* Tiempo */}
              <span className="text-white/25 text-xs font-body
                               flex-none">
                {timeAgo(entry.updatedAt)}
              </span>

            </div>
          )
        })}
      </div>

    </div>
  )
}