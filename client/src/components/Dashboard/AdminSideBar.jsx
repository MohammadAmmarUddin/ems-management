import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaMoneyBill,
  FaUsers,
} from "react-icons/fa";
import { AiFillSetting, AiOutlineHourglass } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

const AdminSideBar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  const role = user?.role; // Access user's role

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-primary p-5">
        <h3 className="font-bold text-3xl font-sourceSans">Employee MS</h3>
      </div>

      <div>
        {/* Admin-Specific Links */}
        {role === "admin" && (
          <>
            <NavLink
              to={"/admin-dashboard/employee"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <FaUsers />
              <span>Employee</span>
            </NavLink>
            <NavLink
              to={"/admin-dashboard/departments"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <FaBuilding />
              <span>Department</span>
            </NavLink>
            <NavLink
              to={"/admin-dashboard/leave"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <AiOutlineHourglass />
              <span>Leaves</span>
            </NavLink>
            <NavLink
              to={"/admin-dashboard/salary"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <FaMoneyBill />
              <span>Salary</span>
            </NavLink>
          </>
        )}

        {/* Moderator-Specific Links */}
        {role === "moderator" && (
          <>
            <NavLink
              to={"/moderator-dashboard/leave"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <AiOutlineHourglass />
              <span>Leaves</span>
            </NavLink>
            <NavLink
              to={"/moderator-dashboard/salary"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <FaMoneyBill />
              <span>Salary</span>
            </NavLink>
          </>
        )}

        {/* User-Specific Links */}
        {role === "user" && (
          <>
            <NavLink
              to={"/user-dashboard/profile"}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-primary" : " "
                } flex items-center space-x-4 block py-2.5 px-5 rounded`
              }
            >
              <AiFillSetting />
              <span>Profile</span>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSideBar;
