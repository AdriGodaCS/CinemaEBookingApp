import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!isLoggedIn) {
    // LoginPage reads state.from and sends the user back here after a successful login
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute