// client/src/components/stats/BarChart.jsx

export default function BarChart({ data = [], title }) {
  if (!data.length) return null

  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="bg-surface-card border border-surface-border
                    rounded-2xl p-5 nav:p-6">

      <h3 className="font-display text-xl text-white tracking-wide mb-6">
        {title}
      </h3>

      {/* Barras */}
      <div className="flex items-end gap-1.5 nav:gap-2 h-40 overflow-x-auto pb-1">
        {data.map(({ year, count }) => {
          const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
          const isMax     = count === maxCount

          return (
            <div
              key={year}
              className="flex flex-col items-center gap-1.5 flex-none group"
              style={{ minWidth: '2.25rem' }}
            >
              {/* Valor encima de la barra */}
              <span className="text-[10px] font-body text-white/0
                               group-hover:text-white/60
                               transition-colors duration-150">
                {count}
              </span>

              {/* Barra */}
              <div
                className="w-8 nav:w-9 rounded-t-lg transition-all duration-500
                           relative overflow-hidden"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              >
                <div className={`absolute inset-0 rounded-t-lg ${
                  isMax
                    ? 'bg-brand-500'
                    : 'bg-surface-elevated group-hover:bg-brand-500/60'
                } transition-colors duration-200`} />
              </div>

              {/* Año */}
              <span className={`text-[9px] nav:text-[10px] font-body
                                rotate-0 transition-colors ${
                isMax ? 'text-brand-400' : 'text-white/25'
              }`}>
                {String(year).slice(2)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <p className="text-white/20 text-[10px] font-body text-right mt-2">
        Año de estreno
      </p>

    </div>
  )
}