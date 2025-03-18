import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/Dashboard/AdminSideBar";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Dashboard/Navbar.jsx";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
   
   console.log(user.role);
   
  if (user && loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex">
      <AdminSideBar />
      <div className="flex-1 ml-64  bg-gray-300 h-screen">
        <Navbar />
         <Outlet/>
      </div>
    </div>
  );
};

export default AdminDashboard;
