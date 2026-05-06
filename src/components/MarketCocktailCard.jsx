import { useMemo, useState } from 'react'
import { formatBs, parseQuantity } from '../lib/userTradingEngine'

export default function MarketCocktailCard({ item, trading, onBuy }) {
  const [quantityInput, setQuantityInput] = useState('1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const parsed = useMemo(() => parseQuantity(quantityInput), [quantityInput])
  const totalEstimado = parsed.valid ? trading.precioActualBs * parsed.quantity : 0

  function handleBuy() {
    const qty = parseQuantity(quantityInput)
    if (!qty.valid) {
      setError(qty.error)
      setSuccess('')
      return
    }

    onBuy(item, qty.quantity)
    setError('')
    setSuccess('Compra ejecutada')
  }

  return (
    <article className="market-card" data-testid={`market-item-${item.id}`}>
      <div className="market-card-head">
        <h3 className="market-item-name" data-testid={`market-nombre-${item.id}`}>
          {item.nombre}
        </h3>
        <span className={`market-variation ${trading.variacion || 'sin-cambio'}`} data-testid={`market-variacion-${item.id}`}>
          {trading.variacion === 'subio' ? 'Subio' : trading.variacion === 'bajo' ? 'Bajo' : 'Sin cambio'}
        </span>
      </div>

      <div className="market-prices">
        <div className="market-price-row">
          <span>Precio actual</span>
          <strong data-testid={`market-precio-actual-${item.id}`}>{formatBs(trading.precioActualBs)}</strong>
        </div>
        <div className="market-price-row">
          <span>Precio promedio</span>
          <strong data-testid={`market-precio-promedio-${item.id}`}>{formatBs(item.precioPromedio)}</strong>
        </div>
        <div className="market-price-row">
          <span>Precio minimo</span>
          <strong data-testid={`market-precio-minimo-${item.id}`}>{formatBs(item.precioMinimo)}</strong>
        </div>
      </div>

      <div className="market-order">
        <label htmlFor={`cantidad-${item.id}`}>Cantidad</label>
        <input
          id={`cantidad-${item.id}`}
          type="number"
          min="1"
          step="1"
          value={quantityInput}
          onChange={e => setQuantityInput(e.target.value)}
          data-testid={`market-cantidad-${item.id}`}
        />

        <div className="market-total" data-testid={`market-total-estimado-${item.id}`}>
          Total estimado: {formatBs(totalEstimado)}
        </div>

        {error && (
          <p className="field-error" data-testid={`market-error-cantidad-${item.id}`}>
            {error}
          </p>
        )}
        {success && (
          <p className="market-success" data-testid={`market-feedback-exito-${item.id}`}>
            {success}
          </p>
        )}

        <button className="btn btn-primary" onClick={handleBuy} data-testid={`market-btn-comprar-${item.id}`}>
          Comprar
        </button>
      </div>
    </article>
  )
}
