import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <NavLink className="brand" to="/" end>          
          <span>Cinema E-Booking System</span>
        </NavLink>

        <div className="links">
          <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/"
          end
        >
          Home
        </NavLink>
         <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/"
          end
        >
          Login
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/"
          end
        >
          Signup
        </NavLink>
        </div>        
      </nav>
    </header>
  )
}

export default Navbar
