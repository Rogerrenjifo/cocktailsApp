import { calculateChangePercent, formatBs } from '../lib/userTradingEngine'

export default function MarketListView({ items, tradingState, onRowClick, emptyMessage }) {
  if (items.length === 0) {
    return (
      <section className="card market-empty" data-testid="market-empty-state">
        {emptyMessage || 'Aún no hay cockteles disponibles en el mercado.'}
      </section>
    )
  }

  return (
    <section className="market-table-section card" data-testid="market-list">
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
            const normalizedChange = Math.abs(changePercent) < 0.005 ? 0 : changePercent
            const formattedChange = `${normalizedChange > 0 ? '+' : ''}${normalizedChange.toFixed(2)}%`

            return (
              <tr
                key={item.id}
                className="market-row"
                onClick={() => onRowClick(item, trading)}
                data-testid={`market-row-${item.id}`}
                style={{ cursor: 'pointer' }}
              >
                <td className="col-nombre" data-testid={`market-row-nombre-${item.id}`}>
                  {item.nombre}
                </td>
                <td className={`col-precio precio-${priceTrend}`} data-testid={`market-row-precio-${item.id}`}>
                  {formatBs(trading.precioActualBs)}
                </td>
                <td
                  className={`col-cambio ${normalizedChange > 0 ? 'positivo' : normalizedChange < 0 ? 'negativo' : 'neutro'}`}
                  data-testid={`market-row-cambio-${item.id}`}
                >
                  {formattedChange}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
