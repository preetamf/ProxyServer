import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './index.css'
import { AuthProvider } from './utils/useAuth.jsx';
import { ProtectedRoute } from './utils/ProtectedRoute.jsx';
import App from './App.jsx'
import Home from "./pages/Home.jsx"
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { AuthLayout } from './utils/AuthLayout.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<AuthLayout/>} >

      <Route path='dashboard' element={<App />}>
        <Route path='' element={<Home />} />
      </Route>

      <Route path='/' element={<Login />} /> 
      <Route path='signup' element={<Signup />} />

      </Route>
    </>

  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)