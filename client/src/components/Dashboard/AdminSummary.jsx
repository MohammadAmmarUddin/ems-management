import { FaBuilding, FaUsers } from "react-icons/fa";
import SummaryCard from "./SummaryCard";

const AdminSummary = () => {
  return (
    <div className="p-6 ">
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text={"Total Employees"}
          number={"13"}
          color={"bg-green-600"}
        />
        <SummaryCard
          icon={<FaBuilding />}
          text={"Total Departments"}
          number={"14"}
          color={"bg-yellow-600"}
        />
        <SummaryCard
          icon={<FaUsers />}
          text={"Total Salary"}
          number={"13"}
          color={"bg-red-600"}
        />
     
      </div>

      <div className="mt-12">
      <h3 className="text-2xl font-bold text-center">Leaves Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text={"Leaves Applied"}
          number={"13"}
          color={"bg-green-600"}
        />
        <SummaryCard
          icon={<FaBuilding />}
          text={"Leaves Pending"}
          number={"14"}
          color={"bg-yellow-600"}
        />
        <SummaryCard
          icon={<FaBuilding />}
          text={"Leaves Rejected"}
          number={"14"}
          color={"bg-yellow-600"}
        />
        <SummaryCard
          icon={<FaBuilding />}
          text={"Leaves Approved"}
          number={"14"}
          color={"bg-yellow-600"}
        />
      
     
      </div>
      </div>
    </div>
  );
};

export default AdminSummary;
