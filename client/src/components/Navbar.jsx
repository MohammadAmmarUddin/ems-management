import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  return (
    <div className="flex justify-between items-center h-12 bg-primary px-4">
      <p className="text-white font-bold font-sourceSans">
        Welcome {user?.name || "User"}
      </p>
      <div className="flex items-center space-x-4">
        <FaBell className="text-white text-lg" />

        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
          <img
            src={`${baseUrl}/uploads/${user.profileImage}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
