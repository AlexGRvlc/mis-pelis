// client/src/components/collection/CollectionFilters.jsx

const FILTERS = [
  { value: null,       label: 'Todas',       emoji: '🎬', count: 'total'    },
  { value: 'WATCHED',  label: 'Vistas',      emoji: '✅', count: 'WATCHED'  },
  { value: 'PENDING',  label: 'Pendientes',  emoji: '🕐', count: 'PENDING'  },
  { value: 'FAVORITE', label: 'Favoritas',   emoji: '❤️', count: 'FAVORITE' },
]

export default function CollectionFilters({ active, onChange, summary }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map(({ value, label, emoji, count }) => {
        const isActive    = active === value
        const countValue  = summary?.[count] ?? null

        return (
          <button
            key={String(value)}
            onClick={() => onChange(value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
                        font-body text-sm font-medium whitespace-nowrap
                        transition-all duration-150 border flex-none ${
              isActive
                ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-surface-card border-surface-border text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            {countValue !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-elevated text-white/40'
              }`}>
                {countValue}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}