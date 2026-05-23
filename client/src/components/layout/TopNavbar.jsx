// client/src/components/layout/TopNavbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { to: '/',           label: 'Inicio' },
  { to: '/search',     label: 'Buscar' },
  { to: '/collection', label: 'Mi Colección' },
  { to: '/stats',      label: 'Estadísticas' },
]

export default function TopNavbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80
                        backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎬</span>
          <span className="font-display text-2xl text-white tracking-wider
                           group-hover:text-brand-500 transition-colors">
            MIS PELIS
          </span>
        </Link>

        {/* Links centrales */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-white/60 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-white/50 font-body">
                {user?.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm px-4 py-2">
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm px-4 py-2">
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}