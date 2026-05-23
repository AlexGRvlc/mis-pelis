// client/src/components/stats/StatCard.jsx

export default function StatCard({ emoji, label, value, sublabel, accent = false }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border
                     transition-all duration-200 hover:scale-[1.02] ${
      accent
        ? 'bg-brand-500/10 border-brand-500/30'
        : 'bg-surface-card border-surface-border'
    }`}>

      {/* Halo decorativo */}
      {accent && (
        <div className="absolute -top-6 -right-6 w-24 h-24
                        bg-brand-500/20 rounded-full blur-2xl" />
      )}

      <div className="relative z-10">
        <span className="text-3xl block mb-3">{emoji}</span>
        <div className={`font-display text-4xl tracking-wide mb-1 ${
          accent ? 'text-brand-400' : 'text-white'
        }`}>
          {value}
        </div>
        <div className="font-body text-sm text-white/60 font-medium">
          {label}
        </div>
        {sublabel && (
          <div className="font-body text-xs text-white/25 mt-0.5">
            {sublabel}
          </div>
        )}
      </div>

    </div>
  )
}