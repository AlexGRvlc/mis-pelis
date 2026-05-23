// client/src/components/ui/EmptyState.jsx

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center
                    py-20 px-6 text-center">

      {/* Icono con halo */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-surface-elevated
                        flex items-center justify-center">
          <span className="text-5xl">{icon}</span>
        </div>
        {/* Halo decorativo */}
        <div className="absolute inset-0 rounded-3xl bg-brand-500/10
                        blur-xl -z-10 scale-150" />
      </div>

      <h3 className="font-display text-3xl text-white tracking-wide mb-2">
        {title}
      </h3>

      <p className="font-body text-white/40 text-sm max-w-xs
                    leading-relaxed mb-6">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}

    </div>
  )
}