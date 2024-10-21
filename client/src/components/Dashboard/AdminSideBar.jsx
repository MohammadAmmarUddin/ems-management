import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaMoneyBill,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { AiFillSetting, AiOutlineHourglass } from "react-icons/ai";

const AdminSideBar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-green-600 p-5">
        <h3 className="font-bold text-3xl">Employee MS</h3>
      </div>
      <div>
        <NavLink to={"/admin-dashboard"} end className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
          <FaTachometerAlt></FaTachometerAlt>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to={"/employee-dashboard"}  className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
          <FaUsers></FaUsers>
          <span>Employee</span>
        </NavLink>
        <NavLink to={"/admin-dashboard/departments"}  className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
          <FaBuilding></FaBuilding>
          <span>Department</span>
        </NavLink>
        <NavLink to={"/leaves"}  className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
        <AiOutlineHourglass />
          <span>Leaves</span>
        </NavLink>
        <NavLink to={"/salary"}  className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
          <FaMoneyBill></FaMoneyBill>
          <span>Salary</span>
        </NavLink>
        <NavLink to={"/setting"}  className={ ({isActive})=>`${isActive ? "bg-green-600": " "} flex  items-center space-x-4 block py-2.5 px-5 rounded`}>
        <AiFillSetting />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSideBar;
