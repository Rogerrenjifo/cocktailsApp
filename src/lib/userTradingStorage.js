const TRADING_KEY = 'cocktail-user-trading-state'

function hashToUnit(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return (hash % 10_000) / 10_000
}

function getSyntheticReferencePrice(item) {
  const promedio = Number(item.precioPromedio)
  const min = Number(item.precioMinimo)
  const seed = hashToUnit(`${item.id}:${item.nombre}`)
  const direction = seed >= 0.5 ? 1 : -1
  const amplitude = Math.max(promedio * 0.04, 0.5)
  const intensity = 0.25 + (seed % 0.75)
  const delta = amplitude * intensity * direction
  return Math.max(min, Number((promedio - delta).toFixed(2)))
}

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
    const syntheticReference = getSyntheticReferencePrice(item)

    if (!next[item.id]) {
      next[item.id] = {
        precioActualBs: Number(item.precioPromedio),
        precioHace15Min: syntheticReference,
        precioReferenciaInicialBs: syntheticReference,
        ultimaActualizacion: new Date().toISOString(),
        ultimaActualizacion15Min: new Date().toISOString(),
        volumenComprado: 0,
        ultimaCompra: null,
      }
      changed = true
      continue
    }

    const current = next[item.id]
    if (current.precioReferenciaInicialBs === undefined) {
      next[item.id] = {
        ...current,
        precioReferenciaInicialBs: syntheticReference,
      }
      changed = true
    }

    if (current.precioHace15Min === undefined) {
      next[item.id] = {
        ...next[item.id],
        precioHace15Min: syntheticReference,
      }
      changed = true
    }
  }

  return { state: next, changed }
}
