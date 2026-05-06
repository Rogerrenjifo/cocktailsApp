export function clampToMin(value, min) {
  return Math.max(min, value)
}

export function applyMinuteTick(precioActualBs, precioMinimo, precioPromedio = precioActualBs) {
  const actual = Number(precioActualBs)
  const min = Number(precioMinimo)
  const promedio = Number(precioPromedio)

  // Slight mean reversion plus bounded random noise and a small sell bias.
  const drift = (promedio - actual) * 0.03
  const noise = (Math.random() - 0.5) * Math.max(promedio * 0.02, 0.4)
  const sellPressure = -0.15
  const max = Math.max(promedio * 2, min + 1)

  const candidate = actual + drift + noise + sellPressure
  const bounded = Math.min(max, clampToMin(candidate, min))
  return Number(bounded.toFixed(2))
}

export function applyBuy(precioActualBs, quantity) {
  return precioActualBs + quantity
}

export function appendPricePoint(history, precioBs, timestamp = new Date().toISOString()) {
  const next = Array.isArray(history) ? [...history] : []
  next.push({ precioBs: Number(precioBs), timestamp })
  return next.slice(-16)
}

export function appendActivityPoint(history, volumen, operaciones, timestamp = new Date().toISOString()) {
  const next = Array.isArray(history) ? [...history] : []
  next.push({ volumen: Number(volumen), operaciones: Number(operaciones), timestamp })
  return next.slice(-15)
}

export function getActivitySummary(activityHistory) {
  if (!Array.isArray(activityHistory) || activityHistory.length === 0) {
    return { volumen15Min: 0, operaciones15Min: 0 }
  }

  return activityHistory.reduce(
    (acc, point) => ({
      volumen15Min: acc.volumen15Min + Number(point.volumen || 0),
      operaciones15Min: acc.operaciones15Min + Number(point.operaciones || 0),
    }),
    { volumen15Min: 0, operaciones15Min: 0 },
  )
}

export function parseQuantity(raw) {
  const quantity = Number(raw)
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, quantity: 0, error: 'La cantidad debe ser un entero mayor que 0.' }
  }
  return { valid: true, quantity, error: '' }
}

export function formatBs(value) {
  return `${Number(value).toFixed(2)} Bs`
}

export function calculateChangePercent(trading) {
  if (!trading) return 0
  const actual = Number(trading.precioActualBs || 0)
  const referencia = getReferencePrice(trading)

  if (referencia === 0) return 0
  return ((actual - referencia) / referencia) * 100
}

export function calculateChangeAbsolute(trading) {
  if (!trading) return 0
  const actual = Number(trading.precioActualBs || 0)
  const referencia = getReferencePrice(trading)
  return actual - referencia
}

function getReferencePrice(trading) {
  if (Array.isArray(trading.historialPrecios) && trading.historialPrecios.length > 0) {
    return Number(trading.historialPrecios[0].precioBs)
  }

  if (trading.precioHace15Min !== undefined) {
    return Number(trading.precioHace15Min || trading.precioActualBs)
  }

  return Number(trading.precioActualBs || 0)
}
