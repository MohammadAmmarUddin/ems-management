import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
 

  if (loading) {
    return <div>Loading....</div>;
  }


  return user ? children : <Navigate to="/login"></Navigate>;
};

export default PrivateRoutes;
