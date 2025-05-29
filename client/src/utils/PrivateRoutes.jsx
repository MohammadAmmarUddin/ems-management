import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoutes = ({ children }) => {
  const { loading ,user} = useAuth();

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }


  return user? children:  <Navigate to="/login" replace />; // Assuming 'user' is defined in the context
};

export default PrivateRoutes;
