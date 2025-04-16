// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = sessionStorage.getItem("auth") === "true";

  if (!isAuth) {
    return <Navigate to="/fukusuke-sushi/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
