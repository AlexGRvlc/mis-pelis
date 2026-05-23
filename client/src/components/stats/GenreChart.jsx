// client/src/components/stats/GenreChart.jsx

// Colores para cada posición del ranking
const RANK_COLORS = [
  'bg-brand-500',
  'bg-brand-400',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-orange-400',
  'bg-teal-500',
  'bg-pink-500',
]

export default function GenreChart({ data = [], title }) {
  if (!data.length) return null

  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="bg-surface-card border border-surface-border
                    rounded-2xl p-5 nav:p-6">

      <h3 className="font-display text-xl text-white tracking-wide mb-6">
        {title}
      </h3>

      <div className="flex flex-col gap-3">
        {data.map(({ genre, count }, index) => {
          const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0
          const color    = RANK_COLORS[index] || 'bg-surface-elevated'

          return (
            <div key={genre} className="flex items-center gap-3 group">

              {/* Posición */}
              <span className="text-white/20 font-body text-xs w-4
                               text-right flex-none group-hover:text-white/50
                               transition-colors">
                {index + 1}
              </span>

              {/* Nombre del género */}
              <span className="text-white/70 font-body text-sm
                               w-24 nav:w-32 flex-none truncate
                               group-hover:text-white transition-colors">
                {genre}
              </span>

              {/* Barra */}
              <div className="flex-1 bg-surface-elevated rounded-full h-2
                              overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}
                               transition-all duration-700`}
                  style={{
                    width: `${widthPct}%`,
                    transitionDelay: `${index * 60}ms`,
                  }}
                />
              </div>

              {/* Contador */}
              <span className="text-white/30 font-body text-xs w-6
                               text-right flex-none">
                {count}
              </span>

            </div>
          )
        })}
      </div>

    </div>
  )
}