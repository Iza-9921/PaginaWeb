import React, { useEffect, useState } from 'react'
import userService from '../../services/userService'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../security/authContext'
import Swal from 'sweetalert2'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [localIds, setLocalIds] = useState(new Set())
  const navigate = useNavigate()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Obtener usuarios de la API
      const apiData = await userService.getAll()

      // Recuperar usuarios creados localmente (no persistidos por fakestore)
      const localCreatedRaw = JSON.parse(localStorage.getItem('local_users') || '[]')
      const localCreated = localCreatedRaw.map((u) => ({ ...u, id: Number(u.id) }))

      // Asegurar que los ids de deleted sean numéricos
      const deletedIdsRaw = JSON.parse(localStorage.getItem('deleted_users') || '[]')
      const deletedIds = deletedIdsRaw.map((i) => Number(i))

      // Filtrar usuarios borrados localmente (convertir id de API a número)
      const filteredApi = apiData.filter((u) => !deletedIds.includes(Number(u.id)))

      // Mezclar: usar API filtrada + usuarios locales (evitar duplicados por id)
      const map = new Map()
      filteredApi.forEach((u) => map.set(Number(u.id), { ...u, id: Number(u.id) }))
      localCreated.forEach((u) => map.set(Number(u.id), u))

      let merged = Array.from(map.values())

      // Ordenar: usuarios locales primero
      const localIdSet = new Set(localCreated.map((u) => Number(u.id)))
      merged.sort((a, b) => {
        const aLocal = localIdSet.has(Number(a.id)) ? 0 : 1
        const bLocal = localIdSet.has(Number(b.id)) ? 0 : 1
        return aLocal - bLocal
      })

      setUsers(merged)
      // Guardar ids locales para mostrar origen en la tabla
      setLocalIds(localIdSet)
    } catch (err) {
      // Si falla la consulta mostramos alerta para el usuario
      Swal.fire('Error', 'No se pudieron cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const auth = useContext(AuthContext)
  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout()
    }
    navigate('/login')
  }

  const handleView = (id) => {
    navigate(`/users/${id}`)
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: 'Confirmar', text: '¿Borrar usuario?', icon: 'warning', showCancelButton: true })
    if (!res.isConfirmed) return
    try {
      // Intentamos borrar en la API (fakestore puede simularlo)

      try { await userService.remove(id) } catch(e){ /* no bloquear si falla */ }

      // Marcar borrado en localStorage para mantener la apariencia de persistencia
      const deletedIdsRaw2 = JSON.parse(localStorage.getItem('deleted_users') || '[]')
      const deletedIds2 = deletedIdsRaw2.map((i) => Number(i))
      const nid = Number(id)
      if (!deletedIds2.includes(nid)) {
        deletedIds2.push(nid)
        localStorage.setItem('deleted_users', JSON.stringify(deletedIds2))
      }

      // Eliminar cualquier usuario creado localmente con este id
      const localCreated2 = JSON.parse(localStorage.getItem('local_users') || '[]')
      const remainingLocal = localCreated2.filter((u) => Number(u.id) !== nid)
      localStorage.setItem('local_users', JSON.stringify(remainingLocal))

      Swal.fire('Borrado', 'Usuario eliminado', 'success')
      fetchUsers()
    } catch (err) {
      Swal.fire('Error', 'No se pudo borrar', 'error')
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Usuario' },
    { key: 'name', label: 'Nombre', render: (r) => `${r.name?.firstname || ''} ${r.name?.lastname || ''}` },
    { key: 'email', label: 'Email' },
  ]

  return (
    <div>
      <div className="toolbar">
        <div>
          <Button variant="primary" onClick={() => navigate('/users/create')}>Agregar usuario</Button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary" onClick={() => fetchUsers()}>Actualizar</Button>
          <Button variant="pink" onClick={handleLogout}>Cerrar sesión</Button>
        </div>
      </div>

      {loading ? <p>Cargando...</p> : (
        <Table columns={columns} data={users} actions={(row) => (
          <>
            <Button variant="primary" onClick={() => handleView(row.id)}>Ver</Button>
            <Button variant="danger" onClick={() => handleDelete(row.id)}>Borrar</Button>
          </>
        )} />
      )}
    </div>
  )
}
