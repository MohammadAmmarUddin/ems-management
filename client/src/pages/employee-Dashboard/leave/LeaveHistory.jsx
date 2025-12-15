import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";
import { dateSlice } from "../../../utils/DateSlice";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const fetchSingleUserLeave = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/leave/getLeave/${user._id}`);
      setLeaves(res.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    if (!loading) {
      fetchSingleUserLeave();
    }
  }, []);

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "3px 5px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  };

  // Columns of table
  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
      sortable: true,
    },
    {
      name: "LEAVE TYPE",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "FROM",
      selector: (row) => row.startDate,
      sortable: true,
    },
    {
      name: "TO",
      selector: (row) => row.endDate,
      sortable: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "APPLIED DATE",
      selector: (row) => row.createdAt?.slice(0, 10),
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            to={`/employee-dashboard/edit-employee-leave/${row._id}`}
            className="bg-view text-white p-2 rounded-lg hover:bg-green-600"
          >
            Edit
          </Link>
        </>
      ),
    },
  ];

  if (!user && loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Leave</h3>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search By Name"
        />
        <Link
          to="/employee-dashboard/add-leave"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add Leave
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {loading ? (
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
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {leave.leaveType || "Leave"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {dateSlice(leave.startDate)} - {dateSlice(leave.endDate)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                {leave.reason || "No description"}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Applied:</span>{" "}
                {leave.createdAt?.slice(0, 10) || "-"}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Status:</span> {leave.status}
              </p>
              <div className="flex justify-end">
                <Link
                  to={`/employee-dashboard/edit-employee-leave/${leave._id}`}
                  className="bg-view text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded shadow">
        <DataTable
          progressPending={loading}
          highlightOnHover
          selectableRows
          pagination
          columns={columns}
          data={leaves}
        />
      </div>
    </div>
  );
};

export default LeaveHistory;
