import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBar from "../pages/employee-Dashboard/SideBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const EmployeeDashboard = () => {
  const { loading } = useAuth();
  const [sidebarToggle, setSidebarToggle] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <Navbar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
