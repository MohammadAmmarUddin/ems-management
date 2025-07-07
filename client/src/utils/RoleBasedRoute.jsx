import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  }

  if (!requiredRole?.includes(user?.role)) {
    <Navigate to="/unauthorized"></Navigate>;
  }

  return user ? children : <Navigate to="/login"></Navigate>;
};

export default RoleBasedRoute;
