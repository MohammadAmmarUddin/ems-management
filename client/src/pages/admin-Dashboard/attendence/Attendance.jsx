import { Link } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import useAttendance from "../../../hooks/FetchAttendance.jsx";
import { useAuth } from "../../../context/AuthContext";

const Attendance = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const {
    data: attendances = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAttendance(baseUrl);

  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token") || sessionStorage.getItem('token');
  const handleStatusChnage = async (employeeId, status) => {
    const res = await axios.put(
      `${baseUrl}/api/attendance/updateAttendance/${employeeId}`,
      { status },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Attendance ${status} has been updated`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    }
  };

  const columns = [
    {
      name: "S No",
      selector: (row, idx) => idx + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Employee_ID",
      selector: (row) => row?.employeeId?.employeeId,
      sortable: true,
      width: "150px",
    },
    {
      name: "Employee_ID",
      selector: (row) => row?.status,
      sortable: true,
      width: "150px",
    },
    {
      name: "Name",
      selector: (row) => row?.employeeId?.emp_name,
      sortable: true,
      width: "180px",
    },
    {
      name: "Department",
      selector: (row) => row?.employeeId?.department?.dep_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) =>
        row?.status === null ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChnage(row.employeeId._id, "Present")}
              className="bg-view text-white p-2 rounded-lg hover:bg-green-600"
            >
              Present
            </button>

            <button
              onClick={() => handleStatusChnage(row.employeeId._id, "Absent")}
              className="bg-edit text-white p-2 rounded-lg hover:bg-orange-600"
            >
              Absent
            </button>

            <button
              onClick={() => handleStatusChnage(row.employeeId._id, "Sick")}
              className="bg-accent text-white p-2 rounded-lg hover:bg-yellow-600"
            >
              Sick
            </button>

            <button
              onClick={() => handleStatusChnage(row.employeeId._id, "Leave")}
              className="bg-delete text-white p-2 rounded-lg hover:bg-red-600"
            >
              Leave
            </button>
          </div>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-gray-800 p-2 rounded-lg cursor-not-allowed"
          >
            {row?.status}
          </button>
        ),
      width: "280px",
      center: true,
    },
  ];

  // Loader
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Error fetching attendances: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Attendances</h3>
        <p className="font-sourceSans text-sm sm:text-base">
          Mark Employees for {new Date().toISOString().split("T")[0]}{" "}
        </p>
      </div>

      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search By Name, ID, or Department"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded bg-primary hover:bg-secondary font-semibold transition-colors"
        >
          Attendance Reports
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {attendances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No attendance records found</div>
        ) : (
          attendances
            .filter(
              (item) =>
                item?.employeeId?.emp_name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                item?.employeeId?.employeeId
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                item?.employeeId?.department?.dep_name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white rounded-lg shadow p-3 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                    {item.employeeId?.emp_name?.charAt(0)?.toUpperCase() || "E"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {item.employeeId?.emp_name || "N/A"}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Emp ID:</span>{" "}
                      {item.employeeId?.employeeId || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Department:</span>{" "}
                      {item.employeeId?.department?.dep_name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">Status:</span>{" "}
                      {item.status ?? "Pending"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item?.status === null ? (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChnage(item.employeeId._id, "Present")
                            }
                            className="bg-view text-white px-2 py-1 rounded text-xs"
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChnage(item.employeeId._id, "Absent")
                            }
                            className="bg-edit text-white px-2 py-1 rounded text-xs"
                          >
                            Absent
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChnage(item.employeeId._id, "Sick")
                            }
                            className="bg-accent text-white px-2 py-1 rounded text-xs"
                          >
                            Sick
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChnage(item.employeeId._id, "Leave")
                            }
                            className="bg-delete text-white px-2 py-1 rounded text-xs"
                          >
                            Leave
                          </button>
                        </>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-400 text-gray-800 px-2 py-1 rounded text-xs cursor-not-allowed"
                        >
                          {item?.status}
                        </button>
                      )}
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
          selectableRows
          pagination
          columns={columns}
          data={attendances?.filter(
            (item) =>
              item?.employeeId?.emp_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item?.employeeId?.employeeId
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item?.employeeId?.department?.dep_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          )}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
        />
      </div>
    </div>
  );
};

export default Attendance;
