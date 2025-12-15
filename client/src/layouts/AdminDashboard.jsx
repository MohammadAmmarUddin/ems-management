import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AdminSideBar from "../pages/admin-Dashboard/Dashboard/AdminSideBar.jsx";
import { useState } from "react";

const AdminDashboard = () => {
  const { loading } = useAuth();
  const [sidebarToggle, setSidebarToggle] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar
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

export default AdminDashboard;
