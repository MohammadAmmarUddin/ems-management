import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBuilding,
  FaCalendarAlt,
  FaChartBar,
  FaHome,
  FaMoneyBill,
  FaUsers,
} from "react-icons/fa";
import { AiFillSetting, AiOutlineHourglass } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const AdminSideBar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const role = user?.role;

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-4 py-2.5 px-5 rounded transition-colors ${
      isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  const handleLogout = () => {
    logout(); // Clear auth
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 flex flex-col justify-between w-64">
      {/* Top: Brand and Links */}
      <div>
        <div className="bg-primary p-5">
          <h3 className="font-bold text-3xl font-sourceSans">EMS Panel</h3>
        </div>

        <div className="mt-2 space-y-1">
          {/* Admin Links */}
          {role === "admin" && (
            <>
              <NavLink to="/admin-dashboard" end className={linkClass}>
                <FaHome />
                <span>Home</span>
              </NavLink>
              <NavLink to="/admin-dashboard/employee" className={linkClass}>
                <FaUsers />
                <span>Employee</span>
              </NavLink>
              <NavLink to="/admin-dashboard/departments" className={linkClass}>
                <FaBuilding />
                <span>Department</span>
              </NavLink>
              <NavLink to="/admin-dashboard/leave" className={linkClass}>
                <AiOutlineHourglass />
                <span>Leaves</span>
              </NavLink>
              <NavLink to="/admin-dashboard/salary" className={linkClass}>
                <FaMoneyBill />
                <span>Salary</span>
              </NavLink>
              <NavLink to="/admin-dashboard/attendance" className={linkClass}>
                <FaCalendarAlt />
                <span>Attendance</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/attendanceReport"
                className={linkClass}
              >
                <FaChartBar />
                <span>Attendance Report</span>
              </NavLink>
              <NavLink to="/admin-dashboard/announcement" className={linkClass}>
                <FaBell />
                <span>Annoucement</span>
              </NavLink>
            </>
          )}

          {/* Moderator Links */}
          {role === "moderator" && (
            <>
              <NavLink to="/moderator-dashboard/leave" className={linkClass}>
                <AiOutlineHourglass />
                <span>Leaves</span>
              </NavLink>
              <NavLink to="/moderator-dashboard/salary" className={linkClass}>
                <FaMoneyBill />
                <span>Salary</span>
              </NavLink>
            </>
          )}

          {/* User Links */}
          {role === "user" && (
            <NavLink to="/user-dashboard/profile" className={linkClass}>
              <AiFillSetting />
              <span>Profile</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Bottom: Settings and Logout */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <NavLink to="/settings" className={linkClass}>
          <AiFillSetting />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 py-2.5 px-5 text-red-400 hover:bg-red-600 hover:text-white w-full rounded transition-colors"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
