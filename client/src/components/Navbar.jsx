import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between h-12 bg-primary">
      <p className="mt-3 text-white font-bold font-sourceSans">
        Welcome {user.name}
      </p>
      <p className="mt-3 mr-4 text-white font-bold font-sourceSans flex items-center space-x-4">
        <FaBell />
        <span>
          <img
            src={`http://localhost:5001/uploads/${user?.profileImage}`}
            width={30}
            className="rounded-full"
            alt=""
          />
        </span>
      </p>
    </div>
  );
};

export default Navbar;
