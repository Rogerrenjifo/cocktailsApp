export function clampToMin(value, min) {
  return Math.max(min, value)
}

export function applyMinuteTick(precioActualBs, precioMinimo) {
  return clampToMin(precioActualBs - 1, precioMinimo)
}

export function applyBuy(precioActualBs, quantity) {
  return precioActualBs + quantity
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
  if (!trading || trading.precioHace15Min === undefined) {
    return 0
  }

  const hace15 = Number(trading.precioHace15Min || trading.precioActualBs)
  const actual = Number(trading.precioActualBs)

  if (hace15 === 0) return 0

  return ((actual - hace15) / hace15) * 100
}
