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
    const now = new Date()
    const nowIso = now.toISOString()
    const fifteenMinAgoIso = new Date(now.getTime() - 15 * 60 * 1000).toISOString()
    const promedio = Number(item.precioPromedio)

    if (!next[item.id]) {
      next[item.id] = {
        precioActualBs: promedio,
        precioHace15Min: syntheticReference,
        precioReferenciaInicialBs: syntheticReference,
        ultimaActualizacion: nowIso,
        ultimaActualizacion15Min: nowIso,
        volumenComprado: 0,
        volumen15Min: 0,
        operaciones15Min: 0,
        historialPrecios: [
          { precioBs: syntheticReference, timestamp: fifteenMinAgoIso },
          { precioBs: promedio, timestamp: nowIso },
        ],
        actividad15Min: [],
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

    if (!Array.isArray(current.historialPrecios)) {
      next[item.id] = {
        ...next[item.id],
        historialPrecios: [
          { precioBs: Number(current.precioHace15Min ?? syntheticReference), timestamp: fifteenMinAgoIso },
          { precioBs: Number(current.precioActualBs ?? promedio), timestamp: nowIso },
        ],
      }
      changed = true
    }

    if (Array.isArray(current.historialPrecios) && current.historialPrecios.length > 0) {
      const normalizedHistory = current.historialPrecios.map(point => ({
        precioBs: Number(point.precioBs ?? point.precio ?? promedio),
        timestamp: point.timestamp ?? nowIso,
      }))
      const needsHistoryNormalization = normalizedHistory.some(
        (point, index) =>
          point.precioBs !== Number((current.historialPrecios[index] || {}).precioBs) ||
          point.timestamp !== (current.historialPrecios[index] || {}).timestamp,
      )

      if (needsHistoryNormalization) {
        next[item.id] = {
          ...next[item.id],
          historialPrecios: normalizedHistory,
        }
        changed = true
      }
    }

    if (!Array.isArray(current.actividad15Min)) {
      next[item.id] = {
        ...next[item.id],
        actividad15Min: [],
      }
      changed = true
    }

    if (current.volumen15Min === undefined || current.operaciones15Min === undefined) {
      next[item.id] = {
        ...next[item.id],
        volumen15Min: Number(current.volumen15Min || 0),
        operaciones15Min: Number(current.operaciones15Min || 0),
      }
      changed = true
    }
  }

  return { state: next, changed }
}
