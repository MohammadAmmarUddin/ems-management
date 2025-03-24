import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
 const {user,logout} = useAuth()

  const handleLogout=async()=>{
    await logout().then(()=>{<Navigate to="/login"/>})
  }
  return (
    <div className="flex justify-between h-12 bg-primary">
      <p className="mt-3 text-white font-bold">Welcome {user.name}</p>
      <button onClick={handleLogout} className="px-4 py-2 bg-primary text-white font-semibold hover:bg-secondary">LogOut</button>
    </div>
  );
};

export default Navbar;
