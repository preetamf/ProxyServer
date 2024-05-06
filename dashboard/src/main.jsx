import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthProvider } from './utils/useAuth.jsx';
import { AuthLayout } from './utils/AuthLayout.jsx';
import './index.css'
import App from './App.jsx'
import Home from "./pages/Home.jsx"
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Pricing from "./pages/Pricing.jsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<AuthLayout/>} >

      <Route path='dashboard' element={<App />}>
        <Route path='' element={<Home />} />
        <Route path='pricing' element={<Pricing />} />
      </Route>

      <Route path='/' element={<Login />} /> 
      <Route path='signup' element={<Signup />} />

      </Route>
    </>

  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <RouterProvider router={router}>
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    </RouterProvider>
  </React.StrictMode>,
)