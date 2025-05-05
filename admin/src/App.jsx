import React, { useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Edit from './pages/Edit'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react'
import Analytics from "./pages/Analytics";

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "$"

const App = () => {

  const [ token, setToken ] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  useEffect(() => {
    localStorage.setItem('token', token)

  }, [token])
  return (
    <div>
      <ToastContainer/>
      { token === ""
      ? <Login setToken={setToken} />
    : <>
      <Navbar setToken={setToken}/>
        <div className="flex w-full">
        <SideBar/>
          <div className="mx-auto w-[70%] ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
            <Routes>
              <Route path="/add" element ={<Add token={token}/>} />
              <Route path="/list" element ={<List token={token}/>} />
              <Route path="/orders" element ={<Orders token={token}/>} />
              <Route path="/admin/edit/:id" element={<Edit token={token} />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>

          </div>
        </div>
    </>}
      
    </div>
  )
}

export default App
