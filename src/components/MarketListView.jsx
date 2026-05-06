import { calculateChangePercent, formatBs } from '../lib/userTradingEngine'

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
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const trading = tradingState[item.id] || {
              precioActualBs: Number(item.precioPromedio),
            }
            const changePercent = calculateChangePercent(trading)
            // Determinar tendencia de precio vs inicial
            const precioActual = Number(trading.precioActualBs)
            const precioInicial = Number(item.precioPromedio)
            const priceTrend = precioActual > precioInicial ? 'up' : precioActual < precioInicial ? 'down' : 'neutral'
            const isZeroChange = Math.abs(changePercent) < 0.01

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
                  {formatBs(trading.precioActualBs)}
                </td>
                <td
                  className={`col-cambio ${changePercent > 0 ? 'positivo' : changePercent < 0 ? 'negativo' : 'neutro'}`}
                >
                  {isZeroChange ? '—' : (changePercent >= 0 ? '+' : '')}{isZeroChange ? '' : changePercent.toFixed(2) + '%'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
