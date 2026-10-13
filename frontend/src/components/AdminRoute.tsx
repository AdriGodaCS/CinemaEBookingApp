import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

type AdminRouteProps = {
  children: ReactNode
}

function AdminRoute({
  children,
}: AdminRouteProps) {
  const {
    isLoggedIn,
    isAdmin,
    loading,
  } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute