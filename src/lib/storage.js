const ITEMS_KEY = 'cocktail-app-items'

const DEFAULT_ITEMS = [
  {
    id: 'default-tequila-shot',
    nombre: 'Tequila Shot',
    descripcion: 'El clasico con sal y limon. Simple pero infalible.',
    precioMinimo: 10,
    precioPromedio: 30,
    fechaCreacion: '2026-05-06T00:00:00.000Z',
    fechaActualizacion: '2026-05-06T00:00:00.000Z',
  },
  {
    id: 'default-jagerbomb',
    nombre: 'Jagerbomb',
    descripcion: 'Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.',
    precioMinimo: 20,
    precioPromedio: 30,
    fechaCreacion: '2026-05-06T00:00:00.000Z',
    fechaActualizacion: '2026-05-06T00:00:00.000Z',
  },
  {
    id: 'default-b-52',
    nombre: 'B-52',
    descripcion: 'Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.',
    precioMinimo: 25,
    precioPromedio: 40,
    fechaCreacion: '2026-05-06T00:00:00.000Z',
    fechaActualizacion: '2026-05-06T00:00:00.000Z',
  },
]

function getDefaultItems() {
  return DEFAULT_ITEMS.map(item => ({ ...item }))
}

export function getItems() {
  const raw = localStorage.getItem(ITEMS_KEY)
  if (!raw) {
    const defaults = getDefaultItems()
    saveItems(defaults)
    return defaults
  }
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      const defaults = getDefaultItems()
      saveItems(defaults)
      return defaults
    }
    return parsed
  } catch {
    const defaults = getDefaultItems()
    saveItems(defaults)
    return defaults
  }
}

function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

export function createItem(item) {
  const items = getItems()
  items.unshift(item)
  saveItems(items)
}

export function updateItem(updatedItem) {
  const items = getItems().map(i => (i.id === updatedItem.id ? updatedItem : i))
  saveItems(items)
}

export function deleteItem(id) {
  const items = getItems().filter(i => i.id !== id)
  saveItems(items)
}
