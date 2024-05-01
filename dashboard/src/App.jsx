import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'

function App() {

  return (
    <div className='flex'>
      <div className='flex flex-col'><Navbar /></div>
      <div className='w-full'>
        <div className=''><Header /></div>
        {/* <div>Main Page</div> */}
        <Outlet/>
      </div>
    </div>
  )
}

export default App
