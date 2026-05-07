import { calculateChangeAbsolute, calculateChangePercent, formatBs } from '../lib/userTradingEngine'

function buildSparklinePoints(history, currentPrice) {
  const fallback = [Number(currentPrice)]
  const prices = Array.isArray(history) && history.length > 0
    ? history.map(point => Number(point.precioBs))
    : fallback

  const values = prices.slice(-16)
  if (values.length === 1) values.push(values[0])

  const width = 64
  const height = 18
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return values
    .map((price, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((price - min) / range) * height
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

export default function MarketListView({ items, tradingState, onRowClick, emptyMessage }) {
  if (items.length === 0) {
    return (
      <section className="card market-empty">
        {emptyMessage || 'Aún no hay cockteles disponibles en el mercado.'}
      </section>
    )
  }

  return (
    <section className="market-table-section card">
      <table className="market-table">
        <thead>
          <tr>
            <th className="col-nombre">Nombre</th>
            <th className="col-precio">Precio Actual</th>
            <th className="col-cambio">Cambio (15min)</th>
            <th className="col-volumen">Vol 15m</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const trading = tradingState[item.id] || {
              precioActualBs: Number(item.precioPromedio),
            }
            const changePercent = calculateChangePercent(trading)
            const changeAbsolute = calculateChangeAbsolute(trading)
            const precioActual = Number(trading.precioActualBs)
            const precioInicial = Number(item.precioPromedio)
            const priceTrend =
              precioActual > precioInicial ? 'up' : precioActual < precioInicial ? 'down' : 'neutral'
            const normalizedChange = Math.abs(changePercent) < 0.005 ? 0 : changePercent
            const normalizedAbsolute = Math.abs(changeAbsolute) < 0.005 ? 0 : changeAbsolute
            const formattedChangePercent = `${normalizedChange > 0 ? '+' : ''}${normalizedChange.toFixed(2)}%`
            const formattedChangeAbsolute = `${normalizedAbsolute > 0 ? '+' : ''}${normalizedAbsolute.toFixed(2)} Bs`
            const sparklinePoints = buildSparklinePoints(trading.historialPrecios, precioActual)

            return (
              <tr
                key={item.id}
                className="market-row"
                onClick={() => onRowClick(item, trading)}
                style={{ cursor: 'pointer' }}
              >
                <td className="col-nombre">
                  {item.nombre}
                </td>
                <td className={`col-precio precio-${priceTrend}`}>
                  <div className="market-price-stack">
                    <span>{formatBs(trading.precioActualBs)}</span>
                    <svg
                      className="market-sparkline"
                      viewBox="0 0 64 18"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <polyline points={sparklinePoints} fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </td>
                <td
                  className={`col-cambio ${normalizedChange > 0 ? 'positivo' : normalizedChange < 0 ? 'negativo' : 'neutro'}`}
                >
                  <div className="market-cambio-stack">
                    <span className="market-cambio-percent">{formattedChangePercent}</span>
                    <span className="market-cambio-abs">{formattedChangeAbsolute}</span>
                  </div>
                </td>
                <td className="col-volumen">
                  {Number(trading.volumen15Min || 0)}
                  <small>{Number(trading.operaciones15Min || 0)} ops</small>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
