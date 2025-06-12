import React from 'react'
import LoginPage from './Login'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import RegisterPage from './Register'
import Dashboard from './dashboard/Dashboard'
import UserTest from './components/tests/UserTest'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import TestUser from "./components/user/TestUser"
import NotFound from "./components/notFound/NotFound"

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <PublicRoute>
            <LoginPage/>
          </PublicRoute>
        }/>
        <Route path='/register' element={
          <PublicRoute>
            <RegisterPage/>
          </PublicRoute>
        }/>
        <Route path='/dashboard/*' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path='/test/:id' element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserTest/>
          </ProtectedRoute>
        }/>
        <Route path='/user' element={
          <ProtectedRoute allowedRoles={['USER']}>
            <TestUser/>
          </ProtectedRoute>
        }/>
        <Route path='*' element={<NotFound></NotFound>}></Route>
      </Routes>
    </div>
  )
}

export default App