import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/fukusuke-sushi/login/" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/fukusuke-sushi/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 