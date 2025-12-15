import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaBuilding,
  FaCalendarAlt,
  FaChartBar,
  FaHome,
  FaMoneyBill,
  FaUsers,
} from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { GrUserManager } from "react-icons/gr";
import { AiFillSetting, AiOutlineHourglass } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

const AdminSideBar = ({ sidebarToggle, setSidebarToggle }) => {
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
    `flex items-center gap-4 py-2.5 px-5 rounded transition-colors ${
      isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarToggle && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarToggle(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 text-white flex flex-col justify-between
        transform transition-transform duration-300
        ${sidebarToggle ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div>
          <div className="bg-primary p-5 flex justify-between items-center">
            <h3 className="font-bold text-2xl">EMS Panel</h3>
            <button
              className="md:hidden"
              onClick={() => setSidebarToggle(false)}
            >
              <FaBars size={22} />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-2 space-y-1">
            {role === "admin" && (
              <>
                <NavLink to="/admin-dashboard" end className={linkClass}>
                  <FaHome /> <span>Home</span>
                </NavLink>
                <NavLink to="/admin-dashboard/employee" className={linkClass}>
                  <FaUsers /> <span>Employees</span>
                </NavLink>
                <NavLink to="/admin-dashboard/managers" className={linkClass}>
                  <GrUserManager /> <span>Managers</span>
                </NavLink>
                <NavLink to="/admin-dashboard/projects" className={linkClass}>
                  <GoProject /> <span>Projects</span>
                </NavLink>
                <NavLink
                  to="/admin-dashboard/departments"
                  className={linkClass}
                >
                  <FaBuilding /> <span>Department</span>
                </NavLink>
                <NavLink to="/admin-dashboard/leave" className={linkClass}>
                  <AiOutlineHourglass /> <span>Leaves</span>
                </NavLink>
                <NavLink to="/admin-dashboard/salary" className={linkClass}>
                  <FaMoneyBill /> <span>Salary</span>
                </NavLink>
                <NavLink to="/admin-dashboard/attendance" className={linkClass}>
                  <FaCalendarAlt /> <span>Attendance</span>
                </NavLink>
                <NavLink
                  to="/admin-dashboard/attendanceReport"
                  className={linkClass}
                >
                  <FaChartBar /> <span>Attendance Report</span>
                </NavLink>
                <NavLink
                  to="/admin-dashboard/annoucement"
                  className={linkClass}
                >
                  <FaBell /> <span>Announcement</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <NavLink to="/settings" className={linkClass}>
            <AiFillSetting /> <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2.5 px-5 text-red-400 hover:bg-red-600 hover:text-white w-full rounded"
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;
