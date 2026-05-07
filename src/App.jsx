import { useEffect, useState } from 'react'
import { getSession, logout } from './lib/auth'
import { getItems, createItem, updateItem, deleteItem } from './lib/storage'
import LoginForm from './components/LoginForm'
import CocktailForm from './components/CocktailForm'
import CocktailList from './components/CocktailList'
import UserMarketPage from './pages/UserMarketPage'

function getViewFromHash() {
  return window.location.hash === '#market' ? 'market' : 'admin'
}

export default function App() {
  const [view, setView] = useState(() => getViewFromHash())
  const [session, setSession] = useState(() => getSession())
  const [items, setItems] = useState(() => getItems())
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    function onHashChange() {
      setView(getViewFromHash())
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleLoginSuccess() {
    setSession(getSession())
  }

  function handleLogout() {
    logout()
    setSession(null)
  }

  function handleSave(item) {
    if (editingItem) {
      updateItem(item)
    } else {
      createItem(item)
    }
    setItems(getItems())
    setEditingItem(null)
  }

  function handleEdit(item) {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingItem(null)
  }

  function handleDelete(item) {
    if (window.confirm(`¿Eliminar "${item.nombre}"?\nEsta acción no se puede deshacer.`)) {
      deleteItem(item.id)
      setItems(getItems())
      if (editingItem?.id === item.id) setEditingItem(null)
    }
  }

  if (view === 'market') {
    return <UserMarketPage />
  }

  if (!session) {
    return <LoginForm onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <span className="app-logo">🍹 Cocktail Admin</span>
        <div className="header-actions">
          <a className="btn btn-secondary" href="#market">
            Ver Mercado
          </a>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="app-main">
        <CocktailForm
          items={items}
          editingItem={editingItem}
          onSave={handleSave}
          onCancelEdit={handleCancelEdit}
        />
        <CocktailList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
