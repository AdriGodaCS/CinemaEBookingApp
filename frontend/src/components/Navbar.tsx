import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const {
    user,
    isLoggedIn,
    isAdmin,
    logout,
  } = useAuth()

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <nav
        className="site-nav"
        aria-label="Primary navigation"
      >
        <NavLink
          className="brand"
          to="/"
          end
        >
          <span>
            Cinema E-Booking System
          </span>
        </NavLink>

        <div className="links">
          {!isLoggedIn && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/"
                end
              >
                Home
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/login"
              >
                Login
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/signup"
              >
                Signup
              </NavLink>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/"
                end
              >
                Home
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/profile"
              >
                Profile
              </NavLink>

              <button
                type="button"
                className="nav-link logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {isLoggedIn && isAdmin && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
                to="/admin"
              >
                Admin
              </NavLink>

              <button
                type="button"
                className="nav-link logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar