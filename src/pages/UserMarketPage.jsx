import { useEffect, useMemo, useState } from 'react'
import MarketListView from '../components/MarketListView'
import MarketBuyModal from '../components/MarketBuyModal'
import { getItems } from '../lib/storage'
import {
  getTradingState,
  saveTradingState,
  ensureTradingStateForItems,
} from '../lib/userTradingStorage'
import { applyBuy, applyMinuteTick } from '../lib/userTradingEngine'

const TICK_MS = 60_000
const TICK_15MIN_MS = 15 * 60 * 1000

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

        for (const item of items) {
          const current = next[item.id]
          if (!current) continue

          const newPrice = applyMinuteTick(Number(current.precioActualBs), Number(item.precioMinimo))
          next[item.id] = {
            ...current,
            precioActualBs: newPrice,
            ultimaActualizacion: new Date().toISOString(),
          }
        }

        saveTradingState(next)
        setLastTick(new Date().toISOString())
        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(intervalId)
  }, [items])

  // Actualizar precio hace 15 min cada 15 minutos
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTradingState(prev => {
        const next = { ...prev }

        for (const item of items) {
          const current = next[item.id]
          if (!current) continue

          next[item.id] = {
            ...current,
            precioHace15Min: Number(current.precioActualBs),
            ultimaActualizacion15Min: new Date().toISOString(),
          }
        }

        saveTradingState(next)
        return next
      })
    }, TICK_15MIN_MS)

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

      const next = {
        ...prev,
        [item.id]: {
          ...current,
          precioActualBs: newPrice,
          ultimaActualizacion: new Date().toISOString(),
          volumenComprado: Number(current.volumenComprado || 0) + quantity,
          ultimaCompra: {
            cantidad: quantity,
            precioUnitario,
            total: precioUnitario * quantity,
            fecha: new Date().toISOString(),
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
    <div className="market-page app-wrapper">
      <header className="app-header">
        <span className="app-logo">
          Mercado de Cockteles
        </span>
        <a className="btn btn-secondary" href="#admin">
          Ir a Admin
        </a>
      </header>

      <main className="app-main">
        <section className="card market-info">
          <p>Haz click en un cocktail para comprar. El precio baja 1 Bs por minuto.</p>
          <p className="market-tick">
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
