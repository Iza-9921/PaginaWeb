import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import userService from '../../services/userService'
import Button from '../../components/Button'
import Swal from 'sweetalert2'

export default function UserFindOne(){
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const load = async ()=>{
      try{
        // Revisar cache local primero (soporta id en número o string)
        const localCreatedRaw = JSON.parse(localStorage.getItem('local_users') || '[]')
        const localCreated = localCreatedRaw.map((u) => ({ ...u, id: Number(u.id) }))
        const deletedIdsRaw = JSON.parse(localStorage.getItem('deleted_users') || '[]')
        const deletedIds = deletedIdsRaw.map((i) => Number(i))
        const parsedIdNum = Number(id)

        if (deletedIds.includes(parsedIdNum)) {
          throw new Error('Usuario borrado')
        }

        // Buscar en la cache local por coincidencia exacta numérica
        const local = localCreated.find((u) => Number(u.id) === parsedIdNum)
        if (local) {
          setUser(local)
          return
        }

        // Intentar obtener desde la API. Si la API no tiene, mostrar mensaje claro.
        const data = await userService.getOne(parsedIdNum)
        setUser({ ...data, id: Number(data.id) })
      }catch(e){
        // Mostrar alerta y dejar la pantalla en estado de no encontrado
        Swal.fire('Error','No se encontró el usuario. Si lo creaste recientemente aparece en la lista local, o intenta actualizar.','error')
        setUser(null)
      }
    }
    load()
  },[id])

  return (
    <div className="page">
      <h2>Detalle usuario</h2>
      <div className="card">
        {!user ? <p>Cargando...</p> : (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Nombre:</strong> {user.name?.firstname} {user.name?.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.phone}</p>
            <div style={{ marginTop: 12 }}>
              <Button variant="pink" onClick={() => navigate(-1)}>Volver</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
