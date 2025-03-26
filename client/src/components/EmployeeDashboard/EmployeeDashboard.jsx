import { Outlet } from "react-router-dom";

import SideBar from "./SideBar.jsx";
import Navbar from "../Dashboard/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const EmployeeDashboard = () => {
  const { loading } = useAuth();
  if (loading ) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <span className="loading loading-spinner text-5xl text-white"></span>
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
