// client/src/pages/Search.jsx

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce }    from '../hooks/useDebounce.js'
import { moviesService }  from '../services/movies.service.js'
import MovieGrid          from '../components/movies/MovieGrid.jsx'
import MovieCarousel      from '../components/movies/MovieCarousel.jsx'
import EmptyState         from '../components/ui/EmptyState.jsx'

// ── Icono de lupa ─────────────────────────
const SearchIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={2} className={className}>
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
)

// ── Icono de borrar ───────────────────────
const ClearIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={2} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export default function Search() {
  const [query,    setQuery]    = useState('')
  const [page,     setPage]     = useState(1)
  const inputRef               = useRef(null)
  const debouncedQuery         = useDebounce(query, 400)

  // Resetear página al cambiar búsqueda
//   useEffect(() => { setPage(1) }, [debouncedQuery]) // → lo moví al onChange para resetear inmediatamente, sin esperar debounce

  // Autofocus al montar en escritorio
  useEffect(() => {
    if (window.innerWidth >= 768) inputRef.current?.focus()
  }, [])

  // ── Query de búsqueda ─────────────────────
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['movies', 'search', debouncedQuery, page],
    queryFn:  () => moviesService.search(debouncedQuery, page),
    enabled:  debouncedQuery.trim().length > 1,   // Mínimo 2 caracteres
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,                        // No parpadea al paginar
  })

  // ── Trending — se muestra cuando no hay búsqueda activa
  const {
    data:    trendingData,
    isLoading: trendingLoading,
  } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn:  () => moviesService.trending('week'),
    staleTime: 1000 * 60 * 10,
    enabled:  debouncedQuery.trim().length <= 1,  // Solo cuando no hay búsqueda
  })

  const hasQuery   = debouncedQuery.trim().length > 1
  const hasResults = data?.results?.length > 0
  const isSearching = isLoading || isFetching

  const handleClear = () => {
    setQuery('')
    setPage(1)
    inputRef.current?.focus()
  }

  return (
    <div className="pt-4 nav:pt-0">

      {/* ── Barra de búsqueda ───────────────── */}
      <div className="sticky top-0 nav:top-20 z-30 pb-4
                      bg-surface/95 backdrop-blur-sm">

        <div className="relative">
          {/* Icono lupa */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2
                          pointer-events-none">
            <SearchIcon className={`w-5 h-5 transition-colors duration-150 ${
              query ? 'text-brand-500' : 'text-white/30'
            }`} />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={query}
            // onChange={(e) => setQuery(e.target.value)}
            onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)           // reset aquí, sin useEffect
                }}
            placeholder="Busca una película…"
            className="input-base pl-12 pr-12 py-4 text-base
                       rounded-2xl nav:text-lg"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {/* Botón limpiar */}
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-white/30 hover:text-white
                         transition-colors duration-150 p-1"
              aria-label="Limpiar búsqueda"
            >
              <ClearIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Contador de resultados y spinner */}
        <div className="flex items-center justify-between mt-3 h-5">
          {hasQuery && (
            <>
              <span className="text-white/30 text-xs font-body">
                {isSearching
                  ? 'Buscando…'
                  : hasResults
                    ? `${data.totalResults.toLocaleString()} resultados para "${debouncedQuery}"`
                    : `Sin resultados para "${debouncedQuery}"`
                }
              </span>

              {/* Indicador de fetching sutil */}
              {isFetching && !isLoading && (
                <div className="w-4 h-4 border-2 border-brand-500/30
                                border-t-brand-500 rounded-full animate-spin" />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Contenido principal ─────────────── */}

      {/* Estado: sin búsqueda — muestra trending */}
      {!hasQuery && (
        <div>
          <p className="text-white/30 font-body text-sm mb-6">
            Empieza a escribir para buscar cualquier película.
          </p>
          <MovieCarousel
            title="🔥 Tendencias"
            movies={trendingData?.results || []}
            loading={trendingLoading}
            cardSize="md"
          />
        </div>
      )}

      {/* Estado: buscando — grid con skeletons */}
      {hasQuery && isLoading && (
        <MovieGrid loading={true} skeletonCount={12} />
      )}

      {/* Estado: error de red */}
      {hasQuery && isError && (
        <EmptyState
          icon="📡"
          title="ERROR DE RED"
          description="No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo."
          action={{ label: 'Reintentar', onClick: () => setQuery(query + ' ') }}
        />
      )}

      {/* Estado: sin resultados */}
      {hasQuery && !isLoading && !isError && !hasResults && (
        <EmptyState
          icon="🎬"
          title="SIN RESULTADOS"
          description={`No encontramos ninguna película que coincida con "${debouncedQuery}". Prueba con otro título o año.`}
        />
      )}

      {/* Estado: resultados */}
      {hasQuery && hasResults && (
        <>
          <MovieGrid
            movies={data.results}
            loading={isLoading}
          />

          {/* Paginación */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10 mb-4">

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
              >
                ← Anterior
              </button>

              {/* Páginas visibles */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(data.totalPages, 5) },
                  (_, i) => {
                    // Calcula el rango de páginas visible centrado en la actual
                    const half  = 2
                    let start   = Math.max(1, page - half)
                    const end   = Math.min(data.totalPages, start + 4)
                    start       = Math.max(1, end - 4)
                    return start + i
                  }
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    disabled={isFetching}
                    className={`w-9 h-9 rounded-lg text-sm font-body
                                font-medium transition-colors duration-150
                                disabled:opacity-50 ${
                      p === page
                        ? 'bg-brand-500 text-white'
                        : 'text-white/40 hover:text-white hover:bg-surface-elevated'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages || isFetching}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
              >
                Siguiente →
              </button>

            </div>
          )}

          {/* Info de página */}
          <p className="text-center text-white/20 text-xs font-body pb-4">
            Página {page} de {data.totalPages}
          </p>
        </>
      )}

    </div>
  )
}