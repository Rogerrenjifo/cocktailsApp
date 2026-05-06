import { useEffect, useState } from 'react'
import MarketListView from '../components/MarketListView'
import MarketBuyModal from '../components/MarketBuyModal'
import { getItems } from '../lib/storage'
import {
  getTradingState,
  saveTradingState,
  ensureTradingStateForItems,
} from '../lib/userTradingStorage'
import {
  applyBuy,
  applyMinuteTick,
  appendPricePoint,
  appendActivityPoint,
  getActivitySummary,
} from '../lib/userTradingEngine'

const TICK_MS = 60_000

export default function UserMarketPage() {
  const [items, setItems] = useState(() => getItems())
  const [tradingState, setTradingState] = useState(() => getTradingState())
  const [selectedCocktail, setSelectedCocktail] = useState(null)
  const [lastTick, setLastTick] = useState(() => new Date().toISOString())

  useEffect(() => {
    const ensured = ensureTradingStateForItems(items, tradingState)
    if (ensured.changed) {
      setTradingState(ensured.state)
      saveTradingState(ensured.state)
    }
  }, [items, tradingState])

  useEffect(() => {
    function onStorage(event) {
      if (event.key === 'cocktail-app-items') {
        setItems(getItems())
      }
      if (event.key === 'cocktail-user-trading-state') {
        setTradingState(getTradingState())
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Tick cada 60 segundos
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTradingState(prev => {
        const next = { ...prev }
        const nowIso = new Date().toISOString()

        for (const item of items) {
          const current = next[item.id]
          if (!current) continue

          const newPrice = applyMinuteTick(
            Number(current.precioActualBs),
            Number(item.precioMinimo),
            Number(item.precioPromedio),
          )
          const historialPrecios = appendPricePoint(current.historialPrecios, newPrice, nowIso)

          // Simulacion basica de actividad de mercado por minuto.
          const operacionesSimuladas = Math.random() < 0.65 ? Math.floor(Math.random() * 3) : 0
          const volumenSimulado = operacionesSimuladas === 0
            ? 0
            : operacionesSimuladas + Math.floor(Math.random() * 5)
          const actividad15Min = appendActivityPoint(
            current.actividad15Min,
            volumenSimulado,
            operacionesSimuladas,
            nowIso,
          )
          const { volumen15Min, operaciones15Min } = getActivitySummary(actividad15Min)

          next[item.id] = {
            ...current,
            precioActualBs: newPrice,
            precioHace15Min: Number(historialPrecios[0].precioBs),
            historialPrecios,
            actividad15Min,
            volumen15Min,
            operaciones15Min,
            ultimaActualizacion: nowIso,
            ultimaActualizacion15Min: nowIso,
          }
        }

        saveTradingState(next)
        setLastTick(new Date().toISOString())
        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(intervalId)
  }, [items])

  function handleRowClick(item, trading) {
    setSelectedCocktail({ item, trading })
  }

  function handleBuy(item, quantity) {
    setTradingState(prev => {
      const current = prev[item.id]
      if (!current) return prev

      const precioUnitario = Number(current.precioActualBs)
      const newPrice = applyBuy(precioUnitario, quantity)
      const nowIso = new Date().toISOString()
      const historialPrecios = appendPricePoint(current.historialPrecios, newPrice, nowIso)
      const actividad15Min = appendActivityPoint(current.actividad15Min, quantity, 1, nowIso)
      const { volumen15Min, operaciones15Min } = getActivitySummary(actividad15Min)

      const next = {
        ...prev,
        [item.id]: {
          ...current,
          precioActualBs: newPrice,
          precioHace15Min: Number(historialPrecios[0].precioBs),
          historialPrecios,
          actividad15Min,
          volumen15Min,
          operaciones15Min,
          ultimaActualizacion: nowIso,
          ultimaActualizacion15Min: nowIso,
          volumenComprado: Number(current.volumenComprado || 0) + quantity,
          ultimaCompra: {
            cantidad: quantity,
            precioUnitario,
            total: precioUnitario * quantity,
            fecha: nowIso,
          },
        },
      }

      saveTradingState(next)
      return next
    })

    // Actualizar selectedCocktail con el nuevo precio
    setTimeout(() => {
      const updatedState = getTradingState()
      setSelectedCocktail({ item, trading: updatedState[item.id] })
    }, 0)
  }

  function handleCloseModal() {
    setSelectedCocktail(null)
  }

  return (
    <div className="market-page app-wrapper" data-testid="market-page">
      <header className="app-header">
        <span className="app-logo" data-testid="market-title">
          Mercado de Cockteles
        </span>
      </header>

      <main className="app-main">
        <section className="card market-info">
          <p>Haz click en un cocktail para comprar. El precio fluctua con deriva y volatilidad.</p>
          <p className="market-tick" data-testid="market-last-tick">
            Último tick: {new Date(lastTick).toLocaleTimeString('es')}
          </p>
        </section>

        <MarketListView
          items={items}
          tradingState={tradingState}
          onRowClick={handleRowClick}
        />

        {selectedCocktail && (
          <MarketBuyModal
            item={selectedCocktail.item}
            trading={selectedCocktail.trading}
            onBuy={handleBuy}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </div>
  )
}
