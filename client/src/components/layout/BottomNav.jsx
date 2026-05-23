// client/src/components/layout/BottomNav.jsx

import { NavLink } from 'react-router-dom'

// Iconos SVG inline — sin dependencia externa
const Icons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round"
                points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2} className="w-6 h-6">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
  ),
  Collection: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
    </svg>
  ),
  Stats: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  ),
}

const NAV_LINKS = [
  { to: '/',           label: 'Inicio',       Icon: Icons.Home       },
  { to: '/search',     label: 'Buscar',       Icon: Icons.Search     },
  { to: '/collection', label: 'Colección',    Icon: Icons.Collection },
  { to: '/stats',      label: 'Estadísticas', Icon: Icons.Stats      },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50
                    bg-surface/90 backdrop-blur-md
                    border-t border-surface-border
                    pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch h-16">
        {NAV_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1
               transition-colors duration-150 ${
                isActive
                  ? 'text-brand-500'
                  : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-150 ${
                  isActive ? 'scale-110' : ''
                }`}>
                  <Icon />
                </span>
                <span className="text-[10px] font-body font-medium tracking-wide">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}