import { useState } from 'react'
import { login } from '../lib/auth'

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (login(username, password)) {
      onSuccess()
    } else {
      setError('Credenciales inválidas. Verifica tu usuario y contraseña.')
    }
  }

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit} data-testid="login-form">
        <div className="login-logo">🍹</div>
        <h1 className="login-title">Cocktail Admin</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            data-testid="input-username"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            data-testid="input-password"
          />
        </div>

        {error && (
          <p className="error-msg" data-testid="login-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-full" data-testid="btn-login">
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
