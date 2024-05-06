import { Outlet, Navigate} from 'react-router-dom'
import { useAuth } from './utils/useAuth.jsx'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className='flex h-screen'>
      <Navbar />
      <div className='flex-grow h-screen p-1 overflow-y-hidden flex flex-col'>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default App
