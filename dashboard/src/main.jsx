import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from './App.jsx'
import Home from "./pages/Home.jsx"
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/dashboard' element={<App />}>
      <Route path='' element={<Home />} />
      {/* <Route path='about' element={<About />} /> */}
      {/* <Route path='user/:userid' element={<User />} /> */}
      {/* <Route loader={githubInfoLoader} path='github' element={<Github />} /> */}
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
