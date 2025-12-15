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
    <div className="p-2 sm:p-3 md:p-5 overflow-hidden">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Leaves</h3>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Search by Name, ID, Type, etc."
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {["Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              className={`px-3 sm:px-4 py-2 rounded text-white text-sm sm:text-base ${
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

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leaves found</div>
        ) : (
          leaves.map((leave, index) => (
            <div
              key={leave._id || index}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  {leave.empId?.emp_name?.charAt(0)?.toUpperCase() || "E"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {leave.empId?.emp_name || "N/A"}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Emp ID:</span>{" "}
                    {leave.empId?.employeeId || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Type:</span>{" "}
                    {leave.leaveType || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Days:</span>{" "}
                    {calculateLeaveDays(leave.startDate, leave.endDate)}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    {leave.status || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    <span className="font-medium">Reason:</span>{" "}
                    {leave.reason || "N/A"}
                  </p>
                  <div className="text-xs text-gray-500">
                    {leave.startDate
                      ? new Date(leave.startDate).toLocaleDateString()
                      : ""}{" "}
                    -{" "}
                    {leave.endDate
                      ? new Date(leave.endDate).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <DataTable
          highlightOnHover
          pagination
          progressPending={isLoading}
          columns={columns}
          data={leaves}
        />
      </div>
    </div>
  );
};

export default LeaveList;
