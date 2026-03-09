import React, { useState, useEffect } from 'react'
import AuthContext from './authContext'

// Provider sencillo para mantener el token de autenticación en contexto
// y sincronizarlo con localStorage. Se mantienen solo las funciones mínimas
// necesarias para la práctica: login(token) y logout().
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  // Guardar/limpiar token en localStorage cuando cambia
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const login = (tok) => setToken(tok)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
