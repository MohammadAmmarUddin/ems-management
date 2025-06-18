import { Outlet } from "react-router-dom";

import SideBar from "../pages/employee-Dashboard/SideBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
const EmployeeDashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64  bg-gray-300 h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
