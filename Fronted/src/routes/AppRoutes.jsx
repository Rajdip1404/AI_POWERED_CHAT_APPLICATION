import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from '../screens/Login'
import Register from '../screens/Register'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes