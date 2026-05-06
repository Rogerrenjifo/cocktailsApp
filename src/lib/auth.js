const SESSION_KEY = 'cocktail-app-session'
const ADMIN = { username: 'roger', password: '12345' }

export function login(username, password) {
  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username }))
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
