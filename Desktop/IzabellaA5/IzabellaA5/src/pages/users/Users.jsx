import React from 'react'
import UserList from './UserList'

export default function Users() {
  return (
    <div className="page">
      <h2 style={{ color: 'var(--pink-dark)' }}>Gestión de usuarios</h2>
      <div className="card">
        <UserList />
      </div>
    </div>
  )
}
