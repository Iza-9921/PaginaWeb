const BASE = 'https://fakestoreapi.com'

// Servicio para autenticación contra fakestoreapi.
// La API de fakestore devuelve un token cuando las credenciales son válidas.
// Aquí solo devolvemos la respuesta para que el AuthProvider la guarde.
const login = async ({ username, password }) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Error en autenticación')
  return res.json()
}

export default { login }
