import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
 const {user} = useAuth()

  
  return (
    <div className="flex justify-between h-12 bg-primary">
      <p className="mt-3 text-white font-bold font-sourceSans">Welcome {user.name}</p>
     
    </div>
  );
};

export default Navbar;
