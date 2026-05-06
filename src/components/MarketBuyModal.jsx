import { useState, useEffect } from 'react'
import { formatBs, parseQuantity } from '../lib/userTradingEngine'

export default function MarketBuyModal({ item, trading, onBuy, onClose }) {
  const [quantityInput, setQuantityInput] = useState('1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setQuantityInput('1')
    setError('')
    setSuccess('')
  }, [item])

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
    setTimeout(() => {
      setQuantityInput('1')
      setSuccess('')
    }, 1500)
  }

  const parsed = parseQuantity(quantityInput)
  const totalEstimado = parsed.valid ? trading.precioActualBs * parsed.quantity : 0

  return (
    <div className="market-modal-overlay" onClick={onClose}>
      <div className="market-modal" onClick={e => e.stopPropagation()} data-testid="market-modal">
        <div className="modal-header">
          <h3 className="modal-title" data-testid="market-modal-nombre">
            {item.nombre}
          </h3>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-price-section">
            <label>Precio Actual</label>
            <p className="modal-price-display" data-testid="market-modal-precio">
              {formatBs(trading.precioActualBs)}
            </p>
          </div>

          <div className="modal-order-section">
            <label htmlFor="modal-cantidad">Cantidad</label>
            <input
              id="modal-cantidad"
              type="number"
              min="1"
              step="1"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
              data-testid="market-modal-cantidad"
            />

            <div className="modal-total" data-testid="market-modal-total">
              Total: {formatBs(totalEstimado)}
            </div>

            {error && (
              <p className="field-error" data-testid="market-modal-error">
                {error}
              </p>
            )}

            {success && (
              <p className="market-success" data-testid="market-modal-success">
                {success}
              </p>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleBuy}
                data-testid="market-modal-btn-comprar"
              >
                Comprar
              </button>
              <button
                className="btn btn-secondary"
                onClick={onClose}
                data-testid="market-modal-btn-cerrar"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
