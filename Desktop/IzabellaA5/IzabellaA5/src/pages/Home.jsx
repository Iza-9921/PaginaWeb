import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <h2>Bienvenidos</h2>
      <p>Proyecto de Apps Web orientadas a servicios. Usa el botón para iniciar sesión.</p>
      <p>
        <Button variant="pink" onClick={() => navigate('/login')}>Ir al Login</Button>
      </p>
    </div>
  )
}
