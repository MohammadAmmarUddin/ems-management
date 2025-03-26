import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaMoneyBill,
  FaUsers,
} from "react-icons/fa";
import {  AiOutlineHourglass } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

const SideBar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <span className="loading loading-spinner text-white"></span>
      </div>
    );
  }

  const role = user?.role; // Access user's role

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-primary p-5">
        <h3 className="font-bold text-3xl">Employee MS</h3>
      </div>

      {/* Admin-Specific Links */}
      {role === "employee" && (
        <>
          <NavLink
            to={"/employee-dashboard/summary"}
            className={({ isActive }) =>
              `${
                isActive ? "bg-primary" : " "
              } flex  items-center space-x-4 block py-2.5 px-5 rounded`
            }
          >
            <FaUsers />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={"/employee-dashboard/profile"}
            className={({ isActive }) =>
              `${
                isActive ? "bg-primary" : " "
              } flex  items-center space-x-4 block py-2.5 px-5 rounded`
            }
          >
            <FaBuilding />
            <span>My Profile</span>
          </NavLink>
          <NavLink
            to={"/employee-dashboard/leave-History"}
            className={({ isActive }) =>
              `${
                isActive ? "bg-primary" : " "
              } flex  items-center space-x-4 block py-2.5 px-5 rounded`
            }
          >
            <AiOutlineHourglass />
            <span>Leaves</span>
          </NavLink>
          <NavLink
            to={"/employee-dashboard/salary"}
            className={({ isActive }) =>
              `${
                isActive ? "bg-primary" : " "
              } flex  items-center space-x-4 block py-2.5 px-5 rounded`
            }
          >
            <FaMoneyBill />
            <span>Salary</span>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default SideBar;
