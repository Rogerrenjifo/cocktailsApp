import CocktailCard from './CocktailCard'

export default function CocktailList({ items, onEdit, onDelete }) {
  return (
    <section className="cocktail-list-section card" data-testid="cocktail-list">
      <h2 className="list-title">Cockteles registrados</h2>
      {items.length === 0 ? (
        <p className="empty-state" data-testid="empty-state">
          Aún no hay cockteles registrados. Agrega el primero usando el formulario.
        </p>
      ) : (
        <div className="cocktail-grid">
          {items.map(item => (
            <CocktailCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
