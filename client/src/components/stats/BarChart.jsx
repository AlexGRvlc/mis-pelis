// client/src/components/stats/BarChart.jsx

import { useState, useRef, useEffect } from 'react'
import MovieCard from '../movies/MovieCard.jsx'

export default function BarChart({ data = [], title }) {
  // 🧠 1. Declaramos TODOS los hooks de estado y referencia arriba del todo
  const scrollRef = useRef(null)
  const [selectedYearData, setSelectedYearData] = useState(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  // 🧠 2. La función de control y su useEffect obligatorios antes de cualquier return preventivo
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 5)
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }

  useEffect(() => {
    checkScroll()
  }, [data])

  // 🧠 3. Cláusula de escape colocada de forma segura tras registrar todos los Hooks de React
  if (!data.length) return null

  // ── Lógica de cálculo matemático ─────────────────────────────
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* ── Contenedor del Gráfico de Barras ── */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 nav:p-6 w-full h-full flex flex-col justify-between relative group/chart">
        
        <h3 className="font-display text-xl text-white tracking-wide mb-6 flex-none">
          {title}
        </h3>

        {/* ── Área del Gráfico con Controles Dinámicos ── */}
        <div className="relative flex-1 w-full flex items-end">

          {/* Flecha Izquierda (Solo ordenador) */}
          {showLeft && (
            <button
              onClick={() => {
                scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
              }}
              className="hidden nav:flex absolute left-0 bottom-10 z-20 w-8 h-8 items-center justify-center rounded-full
                         bg-black/80 border border-surface-border text-white hover:bg-brand-500 hover:border-brand-500
                         transition-all duration-200 shadow-2xl scale-90 hover:scale-105 cursor-pointer"
              aria-label="Desplazar gráfico a la izquierda"
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Contenedor del scroll */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="overflow-x-auto carousel-scroll pt-2 flex-1 w-full h-48 nav:h-64 pb-3"
          >
            {/* Envoltura rígida que fuerza el scroll horizontal real */}
            <div className="flex items-end gap-3 h-full min-w-max px-2">
              {data.map((item) => {
                const { year, count } = item
                const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
                const isSelected = selectedYearData?.year === year

                return (
                  <div
                    key={year}
                    onClick={() => {
                      setSelectedYearData(isSelected ? null : item)
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group flex-none w-12 h-full justify-end"
                  >
                    {/* Tooltip */}
                    <span className={`text-[10px] font-body px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-border transition-all duration-150 flex-none ${
                      isSelected ? 'text-brand-400 border-brand-500/30' : 'text-white/40 group-hover:text-white'
                    }`}>
                      {count}
                    </span>

                    {/* Barra vertical */}
                    <div className="w-full bg-surface-elevated border border-surface-border rounded-t-lg flex-1 min-h-[70px] flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected 
                            ? 'bg-brand-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]' 
                            : 'bg-white/10 group-hover:bg-brand-500/50'
                        }`}
                      />
                    </div>

                    {/* Texto del año */}
                    <span className={`text-xs font-body font-medium flex-none transition-colors ${
                      isSelected ? 'text-brand-400 font-semibold' : 'text-white/30 group-hover:text-white'
                    }`}>
                      {year}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Flecha Derecha (Solo ordenador) */}
          {showRight && (
            <button
              onClick={() => {
                scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
              }}
              className="hidden nav:flex absolute right-0 bottom-10 z-20 w-8 h-8 items-center justify-center rounded-full
                         bg-black/80 border border-surface-border text-white hover:bg-brand-500 hover:border-brand-500
                         transition-all duration-200 shadow-2xl scale-90 hover:scale-105 cursor-pointer"
              aria-label="Desplazar gráfico a la derecha"
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

        </div>
      </div>

      {/* ── Panel Interactivo: Películas del año seleccionado ── */}
      {selectedYearData && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 nav:p-6 w-full flex-none animate-slide-up">
          <div className="flex items-baseline justify-between mb-4">
            <h4 className="font-display text-lg text-white tracking-wide">
              🎬 VISTAS EN EL AÑO <span className="text-brand-500">{selectedYearData.year}</span>
            </h4>
            <button 
              onClick={() => setSelectedYearData(null)}
              className="text-white/30 hover:text-white text-xs font-body transition-colors cursor-pointer"
            >
              Cerrar panel ×
            </button>
          </div>

          <div className="carousel-scroll">
            {selectedYearData.movies?.map((movie) => (
              <div key={movie.tmdbId} className="carousel-item">
                <MovieCard movie={movie} size="md" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
