export default function CocktailCard({ item, onEdit, onDelete }) {
  return (
    <div className="cocktail-card">
      <div className="cocktail-card-header">
        <span className="cocktail-name">{item.nombre}</span>
        <div className="cocktail-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(item)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(item)}
          >
            Eliminar
          </button>
        </div>
      </div>

      {item.descripcion && (
        <p className="cocktail-desc">{item.descripcion}</p>
      )}

      <div className="cocktail-prices">
        <span className="price-badge">
          Mín: <strong>${item.precioMinimo.toFixed(2)}</strong>
        </span>
        <span className="price-badge accent">
          Prom: <strong>${item.precioPromedio.toFixed(2)}</strong>
        </span>
      </div>

      <div className="cocktail-date">
        Actualizado: {new Date(item.fechaActualizacion).toLocaleDateString('es')}
      </div>
    </div>
  )
}
