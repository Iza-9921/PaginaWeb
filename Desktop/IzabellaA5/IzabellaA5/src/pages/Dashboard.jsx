import React, { useContext } from 'react'
import AuthContext from '../security/authContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Dashboard() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <div className="page">
      <h2 style={{ color: 'var(--pink-dark)' }}>Dashboard</h2>
      <div className="card">
        <p>Bienvenidos a tu panel.</p>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => navigate('/users')}>Usuarios</Button>
        </nav>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-pink" onClick={() => logout()}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  )
}
