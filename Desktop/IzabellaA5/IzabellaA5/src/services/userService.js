const BASE = 'https://fakestoreapi.com'

// Servicios básicos para gestión de usuarios con fakestoreapi.
// Nota: fakestoreapi es una API de prueba; los cambios pueden ser simulados.
const getAll = async () => {
  const res = await fetch(`${BASE}/users`)
  if (!res.ok) throw new Error('No se pudieron obtener usuarios')
  return res.json()
}

const getOne = async (id) => {
  const res = await fetch(`${BASE}/users/${id}`)
  if (!res.ok) throw new Error('Usuario no encontrado')
  return res.json()
}

const create = async (user) => {
  // El cuerpo sigue la forma que espera la API de prueba
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error('No se pudo crear el usuario')
  return res.json()
}

const remove = async (id) => {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('No se pudo borrar el usuario')
  return res.json()
}

export default { getAll, getOne, create, remove }
