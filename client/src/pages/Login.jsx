// client/src/pages/Login.jsx

// import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLoginForm } from '../hooks/useLoginForm.js'
// import { useAuth } from '../context/AuthContext.jsx'
import FormField from '../components/ui/FormField.jsx'
import Spinner   from '../components/ui/Spinner.jsx'
import toast     from 'react-hot-toast'

// ── Botón de login social ─────────────────
function SocialButton({ icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-3 w-full
                 bg-surface-elevated hover:bg-surface-border
                 border border-surface-border hover:border-white/20
                 text-white font-body font-medium py-3 px-4 rounded-xl
                 transition-all duration-150 disabled:opacity-50
                 disabled:cursor-not-allowed"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ── Iconos SVG de proveedores ─────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

// ─────────────────────────────────────────
// Página principal de Login/Registro
// ─────────────────────────────────────────
export default function Login() {
  const [searchParams] = useSearchParams()
  //const { socialLogin } = useAuth() // seguirá este flujo cuando llegue el momento:

  // Leer ?mode=register de la URL (viene del GuestModal)
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login'

  const {
    mode, fields, errors, loading,
    handleChange, handleSubmit, toggleMode,
  } = useLoginForm(initialMode)

  // ── Login social simulado ─────────────────
  // En producción integrarías Google OAuth SDK / GitHub OAuth App.
  // Este handler muestra la estructura correcta para cuando lo conectes.
  const handleSocialLogin = async (provider) => {
    toast(
      `Integración con ${provider} lista para conectar.\nImplementa el SDK OAuth y llama a socialLogin({ name, email, provider, providerId }).`,
      { icon: 'ℹ️', duration: 5000 }
    )
    // Ejemplo de llamada cuando tengas el token del proveedor:
    // await socialLogin({ name, email, provider: 'google', providerId: googleId })
  }

  return (
    <div className="min-h-screen bg-surface flex">

      {/* ── Panel izquierdo — solo escritorio ── */}
      <div className="hidden nav:flex nav:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-surface-card via-surface to-black
                      items-center justify-center">

        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: `radial-gradient(circle at 30% 50%, #f97316 0%, transparent 60%),
                                 radial-gradient(circle at 80% 20%, #ea580c 0%, transparent 50%)`,
             }}
        />

        {/* Patrón de cuadrícula sutil */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                                 linear-gradient(90deg, #fff 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
             }}
        />

        <div className="relative z-10 text-center px-12">
          <span className="text-8xl block mb-8">🎬</span>
          <h1 className="font-display text-6xl text-white tracking-widest mb-4">
            MIS PELIS
          </h1>
          <p className="font-body text-white/40 text-lg leading-relaxed max-w-xs mx-auto">
            Tu colección personal de cine. Guarda, organiza y descubre películas.
          </p>

          {/* Stats decorativas */}
          <div className="flex justify-center gap-8 mt-12">
            {[
              { value: '∞',   label: 'Películas' },
              { value: 'Free', label: 'Siempre' },
              { value: '3',   label: 'Estados' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl text-brand-500">{value}</div>
                <div className="font-body text-xs text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho — formulario ─────── */}
      <div className="flex-1 flex items-center justify-center
                      px-6 py-12 nav:px-16">
        <div className="w-full max-w-sm">

          {/* Logo móvil */}
          <div className="nav:hidden text-center mb-10">
            <span className="text-5xl block mb-3">🎬</span>
            <h1 className="font-display text-4xl text-white tracking-widest">
              MIS PELIS
            </h1>
          </div>

          {/* Título dinámico */}
          <div className="mb-8">
            <h2 className="font-display text-4xl text-white tracking-wide mb-1">
              {mode === 'login' ? 'BIENVENIDO' : 'CREAR CUENTA'}
            </h2>
            <p className="font-body text-white/40 text-sm">
              {mode === 'login'
                ? 'Inicia sesión para acceder a tu colección.'
                : 'Únete y empieza a guardar tus pelis.'}
            </p>
          </div>

          {/* ── Botones sociales ───────────── */}
          <div className="flex flex-col gap-3 mb-6">
            <SocialButton
              provider="google"
              icon={<GoogleIcon />}
              label="Continuar con Google"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
            />
            <SocialButton
              provider="github"
              icon={<GitHubIcon />}
              label="Continuar con GitHub"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loading}
            />
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-white/20 text-xs font-body">o con email</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          {/* ── Formulario ────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Nombre — solo en registro */}
            {mode === 'register' && (
              <FormField label="Nombre" error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className={`input-base ${errors.name ? 'border-rose-500' : ''}`}
                />
              </FormField>
            )}

            {/* Email */}
            <FormField label="Email" error={errors.email}>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                autoComplete="email"
                className={`input-base ${errors.email ? 'border-rose-500' : ''}`}
              />
            </FormField>

            {/* Contraseña */}
            <FormField label="Contraseña" error={errors.password}>
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={`input-base ${errors.password ? 'border-rose-500' : ''}`}
              />
            </FormField>

            {/* Confirmar contraseña — solo en registro */}
            {mode === 'register' && (
              <FormField label="Confirmar contraseña" error={errors.confirm}>
                <input
                  type="password"
                  name="confirm"
                  value={fields.confirm}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
                  className={`input-base ${errors.confirm ? 'border-rose-500' : ''}`}
                />
              </FormField>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>{mode === 'login' ? 'Entrando…' : 'Creando cuenta…'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</span>
              )}
            </button>

          </form>

          {/* Toggle login/register */}
          <p className="text-center font-body text-sm text-white/40 mt-6">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-brand-400 hover:text-brand-500
                         font-medium transition-colors"
            >
              {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>

          {/* Volver al inicio */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-white/20 hover:text-white/50
                         font-body text-xs transition-colors"
            >
              ← Volver al inicio sin cuenta
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}