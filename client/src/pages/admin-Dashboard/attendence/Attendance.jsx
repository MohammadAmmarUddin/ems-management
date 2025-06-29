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
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage attendances</h3>
        <p className="font-sourceSans">
          Mark Employees for {new Date().toISOString().split("T")[0]}{" "}
        </p>
      </div>

      <div className="flex justify-between my-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-1 border rounded ml-5"
          placeholder="Search By Name, ID, or Department"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Attendance Reports
        </Link>
      </div>

      <div className="overflow-hidden">
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
