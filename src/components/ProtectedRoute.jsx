import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <p>Vérification de la session...</p>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
