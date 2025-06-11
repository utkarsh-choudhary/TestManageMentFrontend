import React from 'react'
import LoginPage from './Login'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import RegisterPage from './Register'
import Dashboard from './dashboard/Dashboard'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/dashboard/*' element={<Dashboard/>}/>
      </Routes>
    </div>
  )
}

export default App