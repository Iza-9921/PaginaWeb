import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/AuthService'
import AuthContext from '../security/authContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Swal from 'sweetalert2'
import '../components/components-styles.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.username) e.username = 'Requerido'
    if (!form.password) e.password = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    try {
      const data = await AuthService.login(form)
      // fakestore devuelve token
      // Guardamos el token en contexto para proteger rutas
      login(data.token)
      Swal.fire('Bienvenidos', 'Has iniciado sesión', 'success')
      navigate('/dashboard')
    } catch (err) {
      Swal.fire('Error', 'Credenciales inválidas o error de red', 'error')
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h2 style={{ color: 'var(--pink-dark)' }}>Login</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <Input label="Usuario" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} error={errors.username} />
          <Input label="Contraseña" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button type="submit" variant="pink">Entrar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
