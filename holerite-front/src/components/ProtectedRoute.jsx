import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!token || !usuario) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && usuario.role !== allowedRole) {
    if (usuario.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/funcionario" replace />;
  }

  return children;
}

export default ProtectedRoute;