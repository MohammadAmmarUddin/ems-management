import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/Dashboard/AdminSideBar";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Dashboard/Navbar.jsx";

const AdminDashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSideBar />
      <div className="flex-1 ml-64  bg-gray-300 h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
