export function validateCocktail(fields, existingItems, editingId = null) {
  const errors = {}
  const nombre = fields.nombre ? fields.nombre.trim() : ''
  const precioMinimo = parseFloat(fields.precioMinimo)
  const precioPromedio = parseFloat(fields.precioPromedio)

  if (!nombre) {
    errors.nombre = 'El nombre es obligatorio.'
  } else {
    const duplicate = existingItems.find(
      item =>
        item.nombre.trim().toLowerCase() === nombre.toLowerCase() &&
        item.id !== editingId,
    )
    if (duplicate) {
      errors.nombre = 'Ya existe un cocktail con ese nombre.'
    }
  }

  if (isNaN(precioMinimo) || precioMinimo <= 0) {
    errors.precioMinimo = 'El precio mínimo debe ser un número positivo.'
  }

  if (isNaN(precioPromedio) || precioPromedio <= 0) {
    errors.precioPromedio = 'El precio promedio debe ser un número positivo.'
  }

  if (!errors.precioMinimo && !errors.precioPromedio && precioMinimo > precioPromedio) {
    errors.precios = 'El precio mínimo no puede ser mayor al precio promedio.'
  }

  return errors
}
