import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="absolute left-[50%] top-[50%]">Loading.....</div>;
  }

  if (!requiredRole?.includes(user.role)) {
    <Navigate to="/unauthorized"></Navigate>;
  }

  return user ? children : <Navigate to="/login"></Navigate>;
};

export default RoleBasedRoute;
