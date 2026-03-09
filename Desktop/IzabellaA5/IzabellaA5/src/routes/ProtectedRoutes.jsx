import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../security/authContext'

// Wrapper para rutas protegidas. Si no hay token en contexto redirige a login.
export default function ProtectedRoutes({ children }) {
  const { token } = useContext(AuthContext)
  if (!token) return <Navigate to="/login" replace />
  return children
}
