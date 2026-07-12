import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute
