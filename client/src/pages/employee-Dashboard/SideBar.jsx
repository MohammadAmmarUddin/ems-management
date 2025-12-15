import { NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaMoneyBill, FaBars } from "react-icons/fa";
import {
  AiFillDashboard,
  AiFillGift,
  AiFillSetting,
  AiOutlineHourglass,
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { CgProfile } from "react-icons/cg";

const SideBar = ({ sidebarToggle, setSidebarToggle }) => {
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
      {/* Mobile overlay */}
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
        {/* Top section */}
        <div>
          <div className="bg-primary p-5 flex justify-between items-center">
            <h3 className="font-bold text-2xl">Employee MS</h3>

            {/* Close button (mobile) */}
            <button
              className="md:hidden"
              onClick={() => setSidebarToggle(false)}
            >
              <FaBars size={22} />
            </button>
          </div>

          {/* Employee Links */}
          {role === "employee" && (
            <nav className="mt-2 space-y-1">
              <NavLink to="/employee-dashboard/summary" className={linkClass}>
                <AiFillDashboard />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/employee-dashboard/profile" className={linkClass}>
                <CgProfile />
                <span>My Profile</span>
              </NavLink>

              <NavLink to="/employee-dashboard/tasks" className={linkClass}>
                <AiFillGift />
                <span>My Tasks</span>
              </NavLink>

              <NavLink
                to="/employee-dashboard/leave-History"
                className={linkClass}
              >
                <AiOutlineHourglass />
                <span>My Leaves</span>
              </NavLink>

              <NavLink
                to="/employee-dashboard/salary-history"
                className={linkClass}
              >
                <FaMoneyBill />
                <span>My Salary</span>
              </NavLink>

              <NavLink
                to="/employee-dashboard/annoucementEmployee"
                className={linkClass}
              >
                <FaBell />
                <span>Announcement</span>
              </NavLink>
            </nav>
          )}
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <NavLink to="/settings" className={linkClass}>
            <AiFillSetting />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2.5 px-5 text-red-400 hover:bg-red-600 hover:text-white w-full rounded transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
