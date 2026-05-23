// client/src/components/layout/Layout.jsx

import { Outlet, useLocation } from 'react-router-dom'
import TopNavbar from './TopNavbar.jsx'
import BottomNav from './BottomNav.jsx'
import GuestModal from '../ui/GuestModal.jsx'
import { useGuestGuard } from '../../hooks/useGuestGuard.js'

export default function Layout() {
  const { GuestModalProps } = useGuestGuard()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface">

      {/* TopNavbar — visible solo en escritorio (nav:flex) */}
      <div className="hidden nav:block">
        <TopNavbar />
      </div>

      {/* Contenido principal */}
      <main className={`
        w-full max-w-7xl mx-auto px-4 nav:px-6
        pb-20 nav:pb-8
        nav:pt-24
      `}>
        {/* Clave de ubicación para animar transiciones entre páginas */}
        <div key={location.pathname}>
          <Outlet />
        </div>
      </main>

      {/* BottomNav — visible solo en móvil */}
      <div className="nav:hidden">
        <BottomNav />
      </div>

      {/* Modal de invitado — disponible en todo el layout */}
      <GuestModal {...GuestModalProps} />

    </div>
  )
}