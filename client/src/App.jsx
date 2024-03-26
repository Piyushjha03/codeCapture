
import './App.css'
import { Feed } from './pages/feed/feed'
import { useEffect } from 'react'
import { Routes , Route, Navigate } from 'react-router-dom'
import { Problem } from './pages/problem/problem'
import { ProtectedRoute } from './components/protectedRoute/protectedRoute'
import Login from './pages/login/login'

function App() {
  useEffect(()=>{
  },[])

  const isLoggedIn = document.cookie.includes('csrftoken') && document.cookie.includes('LEETCODE_SESSION');

  return (
    <>
    <Routes>
      {/* <Route element={<ProtectedRoute/>}> */}
       <Route path='/' element={isLoggedIn ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
      <Route path='/feed'element={<Feed/>} />
      <Route path='/problem/:id'element={<Problem/>} />
      {/* </Route> */}
      <Route path='/login'element={<Login/>} />
    </Routes>

    </>
  )
}

export default App
