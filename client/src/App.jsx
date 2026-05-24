// client/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

// Layout
import Layout from './components/layout/Layout.jsx'

// Pages (las iremos creando en pasos siguientes)
import Home       from './pages/Home.jsx'
import Search     from './pages/Search.jsx'
import Collection from './pages/Collection.jsx'
import Stats      from './pages/Stats.jsx'
import Login      from './pages/Login.jsx'
import MovieDetail from './pages/MovieDetail.jsx'

// ── Guardia de ruta autenticada ───────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />
}

// ── Redirige al home si ya está logueado ──
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
    ? <Navigate to="/" replace />
    : children
}

export default function App() {
  return (
    <Routes>
      {/* Ruta pública — solo accesible sin sesión */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />

      {/* Rutas con Layout compartido (nav + contenido) */}
      <Route element={<Layout />}>
        {/* Públicas — invitado puede navegar */}
        <Route path="/"       element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:tmdbId" element={<MovieDetail />} />

        {/* Protegidas — requieren autenticación */}
        <Route path="/collection" element={
          <ProtectedRoute><Collection /></ProtectedRoute>
        } />
        <Route path="/stats" element={
          <ProtectedRoute><Stats /></ProtectedRoute>
        } />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}