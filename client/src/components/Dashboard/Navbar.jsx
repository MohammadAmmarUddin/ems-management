import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
 const {user} = useAuth()
  return (
    <div className="flex justify-between h-12 bg-green-600">
      <p className="mt-3 text-white font-bold">Welcome {user.name}</p>
      <button className="px-4 py-2 bg-green-700 text-white font-semibold hover:bg-green-800">LogOut</button>
    </div>
  );
};

export default Navbar;
