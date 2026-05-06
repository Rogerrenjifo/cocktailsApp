const TRADING_KEY = 'cocktail-user-trading-state'

export function getTradingState() {
  const raw = localStorage.getItem(TRADING_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveTradingState(state) {
  localStorage.setItem(TRADING_KEY, JSON.stringify(state))
}

export function ensureTradingStateForItems(items, currentState) {
  const next = { ...currentState }
  let changed = false

  for (const item of items) {
    if (!next[item.id]) {
      next[item.id] = {
        precioActualBs: Number(item.precioPromedio),
        precioHace15Min: Number(item.precioPromedio),
        ultimaActualizacion: new Date().toISOString(),
        ultimaActualizacion15Min: new Date().toISOString(),
        volumenComprado: 0,
        ultimaCompra: null,
      }
      changed = true
    }
  }

  return { state: next, changed }
}
