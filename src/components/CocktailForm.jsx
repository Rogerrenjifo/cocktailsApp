import { useState, useEffect } from 'react'
import { validateCocktail } from '../lib/validation'

export default function CocktailForm({ items, editingItem, onSave, onCancelEdit }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioMinimo, setPrecioMinimo] = useState('')
  const [precioPromedio, setPrecioPromedio] = useState('')
  const [errors, setErrors] = useState({})

  const isEditing = !!editingItem

  useEffect(() => {
    if (editingItem) {
      setNombre(editingItem.nombre)
      setDescripcion(editingItem.descripcion)
      setPrecioMinimo(String(editingItem.precioMinimo))
      setPrecioPromedio(String(editingItem.precioPromedio))
      setErrors({})
    } else {
      setNombre('')
      setDescripcion('')
      setPrecioMinimo('')
      setPrecioPromedio('')
      setErrors({})
    }
  }, [editingItem])

  function handleSubmit(e) {
    e.preventDefault()
    const fields = { nombre, descripcion, precioMinimo, precioPromedio }
    const errs = validateCocktail(fields, items, editingItem?.id ?? null)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const now = new Date().toISOString()
    if (isEditing) {
      onSave({
        ...editingItem,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioMinimo: parseFloat(precioMinimo),
        precioPromedio: parseFloat(precioPromedio),
        fechaActualizacion: now,
      })
    } else {
      onSave({
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioMinimo: parseFloat(precioMinimo),
        precioPromedio: parseFloat(precioPromedio),
        fechaCreacion: now,
        fechaActualizacion: now,
      })
    }
  }

  return (
    <form
      className={`cocktail-form card${isEditing ? ' editing' : ''}`}
      onSubmit={handleSubmit}
      data-testid="cocktail-form"
    >
      <h2 className="form-title">
        {isEditing ? '✏️ Editar cocktail' : '➕ Agregar cocktail'}
      </h2>

      <div className="field">
        <label htmlFor="nombre">Nombre del cocktail</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej. Mojito Clásico"
          data-testid="input-nombre"
        />
        {errors.nombre && (
          <span className="field-error" data-testid="error-nombre">
            {errors.nombre}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="descripcion">Descripción</label>
        <input
          id="descripcion"
          type="text"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Ej. Ron, hierbabuena y limón"
          data-testid="input-descripcion"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="precioMinimo">Precio mínimo</label>
          <input
            id="precioMinimo"
            type="number"
            min="0.01"
            step="0.01"
            value={precioMinimo}
            onChange={e => setPrecioMinimo(e.target.value)}
            placeholder="0.00"
            data-testid="input-precio-minimo"
          />
          {errors.precioMinimo && (
            <span className="field-error" data-testid="error-precio-minimo">
              {errors.precioMinimo}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="precioPromedio">Precio promedio</label>
          <input
            id="precioPromedio"
            type="number"
            min="0.01"
            step="0.01"
            value={precioPromedio}
            onChange={e => setPrecioPromedio(e.target.value)}
            placeholder="0.00"
            data-testid="input-precio-promedio"
          />
          {errors.precioPromedio && (
            <span className="field-error" data-testid="error-precio-promedio">
              {errors.precioPromedio}
            </span>
          )}
        </div>
      </div>

      {errors.precios && (
        <span className="field-error" data-testid="error-precios">
          {errors.precios}
        </span>
      )}

      <div className="form-actions">
        {isEditing ? (
          <>
            <button type="submit" className="btn btn-primary" data-testid="btn-actualizar">
              Actualizar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              data-testid="btn-cancelar-edicion"
            >
              Cancelar edición
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-primary" data-testid="btn-guardar">
            Guardar
          </button>
        )}
      </div>
    </form>
  )
}
