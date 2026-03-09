import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Page404 from './pages/Page404'
import Users from './pages/users/Users'
import UserFindOne from './pages/users/UserFindOne'
import CreateUser from './pages/users/CreateUser'
import ProtectedRoutes from './routes/ProtectedRoutes'
import './App.css'
import './components/components-styles.css'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
          <Route path="/users" element={<ProtectedRoutes><Users /></ProtectedRoutes>} />
          <Route path="/users/create" element={<ProtectedRoutes><CreateUser /></ProtectedRoutes>} />
          <Route path="/users/:id" element={<ProtectedRoutes><UserFindOne /></ProtectedRoutes>} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
