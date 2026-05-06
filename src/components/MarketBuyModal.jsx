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
      <div className="market-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {item.nombre}
          </h3>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-price-section">
            <label>Precio Actual</label>
            <p className="modal-price-display">
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
            />

            <div className="modal-total">
              Total: {formatBs(totalEstimado)}
            </div>

            {error && (
              <p className="field-error">
                {error}
              </p>
            )}

            {success && (
              <p className="market-success">
                {success}
              </p>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleBuy}
              >
                Comprar
              </button>
              <button
                className="btn btn-secondary"
                onClick={onClose}
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
