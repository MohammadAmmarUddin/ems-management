import { NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaUsers, FaProjectDiagram } from "react-icons/fa";
import {
    AiFillDashboard,
    AiFillSetting,
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../context/AuthContext";

const SideBarManager = () => {
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
        `flex items-center space-x-4 py-2.5 px-5 rounded transition-colors ${isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700"
        }`;

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token") || sessionStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 flex flex-col justify-between w-64">
            {/* Top Section */}
            <div>
                <div className="bg-primary p-5">
                    <h3 className="font-bold text-3xl">Manager Panel</h3>
                </div>

                {role === "manager" && (
                    <div className="mt-2 space-y-1">
                        <NavLink to="/manager-dashboard/summary" className={linkClass}>
                            <AiFillDashboard />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink to="/manager-dashboard/profile" className={linkClass}>
                            <CgProfile />
                            <span>My Profile</span>
                        </NavLink>

                        <NavLink to="/manager-dashboard/projects" className={linkClass}>
                            <FaProjectDiagram />
                            <span>Projects</span>
                        </NavLink>

                        <NavLink to="/manager-dashboard/employees" className={linkClass}>
                            <FaUsers />
                            <span>Employees</span>
                        </NavLink>

                        <NavLink to="/manager-dashboard/annoucementManager" className={linkClass}>
                            <FaBell />
                            <span>Announcements</span>
                        </NavLink>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
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

export default SideBarManager;
