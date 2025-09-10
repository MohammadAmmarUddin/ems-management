import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";
import useLeaves from "../../../hooks/FetchLeaves";

const calculateLeaveDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 3600 * 24)) + 1;
};

const LeaveList = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // New state for status filter

  const { data: leaves = [], isLoading } = useLeaves(baseUrl, search, status);

  const columns = [
    { name: "S No", selector: (row, i) => i + 1, maxWidth: "80px" },
    {
      name: "Emp ID",
      selector: (row) => row.empId?.employeeId || "N/A",
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.empId?.emp_name || "N/A",
      wrap: true,
    },
    { name: "Leave Type", selector: (row) => row.leaveType, wrap: true },
    { name: "Description", selector: (row) => row.reason, wrap: true },
    {
      name: "Days",
      selector: (row) => calculateLeaveDays(row.startDate, row.endDate),
    },
    { name: "Status", selector: (row) => row.status, wrap: true },
  ];

  if (loading && user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 lg:py-6 overflow-hidden">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by Name, ID, Type, etc."
          className="px-4 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {["Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              className={`px-4 py-2 rounded text-white ${
                status === s
                  ? s === "Pending"
                    ? "bg-yellow-600"
                    : s === "Approved"
                    ? "bg-green-600"
                    : "bg-red-600"
                  : s === "Pending"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : s === "Approved"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => setStatus(status === s ? "" : s)} // toggle filter
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        highlightOnHover
        pagination
        progressPending={isLoading}
        columns={columns}
        data={leaves}
      />
    </div>
  );
};

export default LeaveList;
