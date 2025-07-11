import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import useEmployeeById from "../../../hooks/FetchEmployeeById";
import useEmployees from "../../../hooks/FetchEmployee.jsx";
import useEmployeesAndLeaves from "../../../hooks/FetchLeaves.jsx";

const calculateLeaveDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 3600 * 24)) + 1;
};

const LeaveList = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { data: employees = [] } = useEmployees({
    baseUrl,
    user,
    loading,
  });
  const { data: leaves = [] } = useEmployeesAndLeaves(
    { baseUrl, user, loading }
  );

  const {
    data: selectedEmployee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
  } = useEmployeeById(baseUrl, selectedEmployeeId, showViewModal);

  const handleShowViewModal = (row) => {
    setSelectedEmployeeId(row.employeeId);
    setShowViewModal(true);
  };

  const handleAction = async (type, id) => {
    try {
      await axios.put(`${baseUrl}/api/leave/${type}Leave/${id}`);
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Leave ${type === "approve" ? "approved" : "rejected"
          } successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries(["leaves"]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${type} leave`,
        position: "center",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const columns = [
    {
      name: "S No",
      selector: (row, i) => i + 1,
      sortable: true,
      maxWidth: "80px",
    },
    {
      name: "Emp ID",
      selector: (row) => row.employeeId,
      wrap: true,
      maxWidth: "120px",
    },
    {
      name: "Name",
      selector: (row) => {
        const emp = employees.find((e) => e._id === row.employeeId);
        return emp?.emp_name || "N/A";
      },
      wrap: true,
      maxWidth: "160px",
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      wrap: true,
      maxWidth: "120px",
    },
    {
      name: "Description",
      selector: (row) => row.reason,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Days",
      selector: (row) => calculateLeaveDays(row.startDate, row.endDate),
      maxWidth: "80px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex flex-nowrap gap-2">
          <button
            onClick={() => handleShowViewModal(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 whitespace-nowrap min-w-[75px]"
          >
            View
          </button>
          <button
            onClick={() => handleAction("approve", row._id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 whitespace-nowrap min-w-[75px]"
          >
            Approve
          </button>
          <button
            onClick={() =>
              Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "This will reject the leave request.",
                showCancelButton: true,
                confirmButtonText: "Yes, reject it!",
              }).then((result) => {
                if (result.isConfirmed) handleAction("reject", row._id);
              })
            }
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 whitespace-nowrap min-w-[75px]"
          >
            Reject
          </button>
        </div>
      ),
      allowOverflow: true,
      button: true,
      maxWidth: "280px",
    },
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
          placeholder="Search By Name"
          className="px-4 py-2 border rounded"
        />
        <div className="flex gap-2 flex-wrap whitespace-nowrap">
          <Link
            to="/admin-dashboard/pending-leaves"
            className="bg-yellow-500 whitespace-nowrap text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Pending
          </Link>
          <Link
            to="/admin-dashboard/approve-leaves"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approved
          </Link>
          <Link
            to="/admin-dashboard/rejected-leaves"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Rejected
          </Link>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <DataTable
          highlightOnHover
          pagination
          progressPending={loading}
          columns={columns}
          data={leaves}
          responsive
          customStyles={{
            table: {
              style: {
                tableLayout: "auto",
                width: "100%",
              },
            },
            cells: {
              style: {
                wordBreak: "break-word",
                whiteSpace: "normal",
              },
            },
          }}
        />
      </div>

      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-2 text-sm sm:text-base">
              {isEmployeeLoading ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : isEmployeeError || !selectedEmployee ? (
                <p className="text-red-500 text-center">
                  Error loading employee.
                </p>
              ) : (
                <>
                  <div className="flex justify-center">
                    <img src="/mn.png" width={70} alt="Employee" />
                  </div>
                  <p>
                    <strong>Name:</strong> {selectedEmployee.emp_name}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedEmployee.employeeId}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedEmployee.department || "N/A"}
                  </p>
                  <p>
                    <strong>Joining:</strong>{" "}
                    {new Date(selectedEmployee.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedEmployee.role || "N/A"}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveList;
