import { Outlet } from "react-router-dom";

import SideBar from "./SideBar.jsx";
import Navbar from "../Dashboard/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const EmployeeDashboard = () => {
  const { user, loading } = useAuth();

  console.log(user.role);

  if (loading) {
    return <div>loading...</div>;
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
