// client/src/pages/Collection.jsx

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCollection }       from '../hooks/useCollection.js'
// import { collectionService }   from '../services/collection.service.js' // — toda la lógica va a través del hook useCollection
import { useAuth }             from '../context/AuthContext.jsx'
import CollectionFilters       from '../components/collection/CollectionFilters.jsx'
import CollectionCard          from '../components/collection/CollectionCard.jsx'
import EmptyState              from '../components/ui/EmptyState.jsx'
import { useNavigate }         from 'react-router-dom'

export default function Collection() {
  const [activeFilter, setActiveFilter] = useState(null)
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const {
    entries,
    total,
    isLoading,
    isError,
    updateStatus,
    remove,
    isUpdating,
  } = useCollection(activeFilter)

  // ── Summary para los contadores del filtro ─
  const { data: summaryData } = useQuery({
    queryKey: ['stats', 'summary'],
    queryFn:  () => import('../services/stats.service.js')
                      .then(m => m.statsService.summary()),
    staleTime: 1000 * 60 * 2,
  })

  // ── Estados de la página ──────────────────

  if (isError) {
    return (
      <EmptyState
        icon="📡"
        title="ERROR DE RED"
        description="No se pudo cargar tu colección. Comprueba tu conexión."
        action={{ label: 'Reintentar', onClick: () => window.location.reload() }}
      />
    )
  }

  return (
    <div className="pt-4 nav:pt-0">

      {/* ── Cabecera ───────────────────────── */}
      <div className="mb-6">
        <h1 className="font-display text-4xl nav:text-5xl text-white
                       tracking-wide mb-1">
          MI COLECCIÓN
        </h1>
        <p className="text-white/30 font-body text-sm">
          {user?.name?.split(' ')[0]} ·{' '}
          {summaryData?.summary?.total ?? '—'} películas guardadas
        </p>
      </div>

      {/* ── Filtros ────────────────────────── */}
      <div className="mb-6">
        <CollectionFilters
          active={activeFilter}
          onChange={setActiveFilter}
          summary={summaryData?.summary}
        />
      </div>

      {/* ── Skeletons de carga ─────────────── */}
      {isLoading && (
        <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-card animate-pulse"
              style={{ aspectRatio: '2/3' }}
            />
          ))}
        </div>
      )}

      {/* ── Colección vacía ────────────────── */}
      {!isLoading && entries.length === 0 && (
        <>
          {activeFilter ? (
            // Vacío con filtro activo
            <EmptyState
              icon={
                activeFilter === 'WATCHED'  ? '✅' :
                activeFilter === 'PENDING'  ? '🕐' : '❤️'
              }
              title="NADA AQUÍ AÚN"
              description={
                activeFilter === 'WATCHED'
                  ? 'No tienes películas marcadas como vistas todavía.'
                  : activeFilter === 'PENDING'
                    ? 'No tienes películas pendientes de ver.'
                    : 'No tienes películas marcadas como favoritas.'
              }
              action={{
                label:   'Explorar películas',
                onClick: () => navigate('/search'),
              }}
            />
          ) : (
            // Colección completamente vacía
            <EmptyState
              icon="🎬"
              title="TU COLECCIÓN ESPERA"
              description="Aún no has añadido ninguna película. Explora la cartelera o busca tus títulos favoritos."
              action={{
                label:   'Buscar películas',
                onClick: () => navigate('/search'),
              }}
            />
          )}
        </>
      )}

      {/* ── Grid de entradas ───────────────── */}
      {!isLoading && entries.length > 0 && (
        <>
          {/* Contador filtrado */}
          <p className="text-white/20 text-xs font-body mb-4">
            {activeFilter
              ? `${total} ${
                  activeFilter === 'WATCHED'  ? 'vista' :
                  activeFilter === 'PENDING'  ? 'pendiente' : 'favorita'
                }${total !== 1 ? 's' : ''}`
              : `${total} en total`
            }
          </p>

          <div className="grid grid-cols-3 nav:grid-cols-4 lg:grid-cols-6 gap-3">
            {entries.map((entry) => (
              <CollectionCard
                key={entry.id}
                entry={entry}
                onUpdateStatus={updateStatus}
                onRemove={remove}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </>
      )}

    </div>
  )
}