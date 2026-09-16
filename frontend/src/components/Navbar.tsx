import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <NavLink className="brand" to="/" end>
          <span className="brand-mark" aria-hidden="true">
            CE
          </span>
          <span>Cinema E-Booking System</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/"
          end
        >
          Home
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
