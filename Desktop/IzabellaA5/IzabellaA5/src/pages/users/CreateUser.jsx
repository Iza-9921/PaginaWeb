import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import userService from '../../services/userService'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../../components/components-styles.css'

export default function CreateUser(){
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = ()=>{
    const e = {}
    if(!form.fullName) e.fullName = 'Requerido'
    if(!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if(!form.phone) e.phone = 'Requerido'
    if(!form.city) e.city = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) =>{
    ev.preventDefault()
    if(!validate()) return

    const names = form.fullName.trim().split(' ')
    const firstname = names[0] || ''
    const lastname = names.slice(1).join(' ') || ''
    const username = form.email.split('@')[0]
    const payload = {
      email: form.email,
      username,
      password: 'pass1234',
      name: { firstname, lastname },
      phone: form.phone,
      address: { city: form.city }
    }

    try{
      const res = await userService.create(payload)

      // Guardar localmente para que el usuario aparezca en la lista (fakestore no persiste)
      const localCreatedRaw = JSON.parse(localStorage.getItem('local_users') || '[]')
      const localCreated = localCreatedRaw.map((u) => ({ ...u, id: Number(u.id) }))

      // Obtener IDs actuales desde la API y la cache local para generar un ID único
      let usedIds = []
      try {
        const apiAll = await userService.getAll()
        usedIds = apiAll.map((u) => Number(u.id)).filter((n) => Number.isFinite(n))
      } catch (e) {
        usedIds = []
      }
      const localIds = localCreated.map((u) => Number(u.id)).filter((n) => Number.isFinite(n))
      const allIds = Array.from(new Set([...usedIds, ...localIds]))

      // Construir un conjunto de IDs usados para evitar colisiones
      const idSet = new Set(allIds.filter((n) => Number.isFinite(n)))

      // Preferimos usar el id que devuelve la API si es positivo y no colisiona
      const resId = res && res.id ? Number(res.id) : null
      let finalId = null
      if (resId && Number.isFinite(resId) && !idSet.has(resId) && resId > 0) {
        // API nos dio un id válido y no colisiona
        finalId = resId
      } else {
        // Asignar un id alto no usado (empezando en 507) para evitar colisiones con ids de la API
        let candidate = 507
        while (idSet.has(candidate)) candidate += 1
        finalId = candidate
      }

      const createdUser = {
        id: finalId,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        ...(res && typeof res === 'object' ? res : {}),
      }

      localCreated.push(createdUser)
      localStorage.setItem('local_users', JSON.stringify(localCreated))

      Swal.fire('Creado','Usuario creado correctamente','success')
      // Volver a la lista de usuarios para que se vea la entrada creada
      navigate('/users')
    }catch(e){
      Swal.fire('Error','No se pudo crear usuario','error')
    }
  }

  return (
    <div className="page">
      <h2 style={{ marginBottom: 18 }}>Usuarios</h2>
      <div className="card form-card">
        <h3 className="form-title">Crear Usuario</h3>
        <form onSubmit={handleSubmit}>
          <Input label="Nombre completo *" name="fullName" placeholder="Nombre completo" value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} error={errors.fullName} />
          <Input label="Correo electrónico *" name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} error={errors.email} />
          <Input label="Número de teléfono *" name="phone" placeholder="(123) 456-7890" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} error={errors.phone} />
          <Input label="Ciudad *" name="city" placeholder="Ciudad" value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} error={errors.city} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="submit" variant="primary">CREAR USUARIO</Button>
            <Button type="button" variant="outline" onClick={()=>navigate(-1)}>CANCELAR</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
