import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  return Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
};

const LeaveList = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { user, loading } = useAuth();
  const [depLoading, setdepLoading] = useState(true);

  const date = new Date(selectedEmployee?.createdAt);
  const joiningDate = date.toLocaleString();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const fetchData = async () => {
    try {
      setdepLoading(true);
      const [employeeRes, leaveRes] = await Promise.all([
        axios.get(`${baseUrl}/api/employee/getEmployees`),
        axios.get(`${baseUrl}/api/leave/getAllleaves`),
      ]);
      setEmployees(employeeRes.data.emp);
      setLeaves(leaveRes.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("There was an issue fetching the data. Please try again.");
    } finally {
      setdepLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchData();
    }
  }, [user, loading]);

  const getEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/employee/getEmployee/${employeeId}`);
      return response.data.employee;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      return null;
    }
  };

  const handleShowViewModal = async (row) => {
    const employeeDetails = await getEmployeeDetails(row.employeeId);
    if (employeeDetails) {
      setSelectedEmployee(employeeDetails);
      setShowViewModal(true);
    }
  };
const handleApprove = async (id) => {
  try {
    console.log("id is",id);
    await axios.put(`${baseUrl}/api/leave/approveLeave/${id}`);
    Swal.fire("Success", "Leave Approved", "success");
    fetchData(); // Refresh the list
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to approve leave", "error");
  }
};

const handleReject = async (id) => {
  try {
    console.log("id is",id);
    await axios.put(`${baseUrl}/api/leave/rejectLeave/${id}`);
       Swal.fire("Rejected", "Leave has been rejected", "success");
    fetchData(); // Refresh the list
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to reject leave", "error");
  }
};

   const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "3px 5px",
    marginRight: "5px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    borderRadius: "4px",
  };


  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedEmployee(null);
  };

const rejectButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#dc3545",
};

const approveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#28a745",
};

const viewButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#17a2b8",
};

const columns = [
  {
    name: "S No",
    selector: (row, ind) => ind + 1,
    sortable: true,
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => {
      const employee = employees?.find((emp) => emp._id === row.employeeId);
      return employee ? employee.emp_name : "N/A";
    },
    sortable: true,
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.reason,
    sortable: true,
  },
  {
    name: "Days",
    selector: (row) => calculateLeaveDays(row.startDate, row.endDate),
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
 {
  name: "Actions",
  cell: (row) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "200px" }}>
      <button onClick={() => handleShowViewModal(row)} style={viewButtonStyle}>
        View
      </button>
      <button onClick={() => handleApprove(row._id)} style={approveButtonStyle}>
        Approve
      </button>
      <button
        onClick={() => {
          Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "This will reject the leave request.",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Yes, reject it!",
          }).then((result) => {
            if (result.isConfirmed) {
              handleReject(row._id);
              Swal.fire("Rejected", "Leave has been rejected", "success");
            }
          });
        }}
        style={rejectButtonStyle}
      >
        Reject
      </button>
    </div>
  ),
  grow: 2, // Allow this column to grow to prevent squishing
},

];


  if (loading || depLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <span className="loading loading-spinner text-white loading-3xl"></span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex flex-wrap justify-between items-center  gap-2">
        <input
          type="text"
          className="px-4 py-2 border rounded"
          placeholder="Search By Name"
        />
        <div className="flex flex-wrap gap-2 ">
          <Link
            to="/admin-dashboard/pending-leaves"
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold"
          >
            Pending Leave
          </Link>
          <Link
            to="/admin-dashboard/approve-leaves"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
          >
            Approve Leave
          </Link>
          <Link
            to="/admin-dashboard/rejected-leaves"
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
          >
            Rejected Leave
          </Link>
        </div>
      </div>

      {leaves.length > 0 ? (
        <DataTable
          highlightOnHover
          pagination
          columns={columns}
          data={leaves}
        />
      ) : (
        <div className="text-center text-gray-600">No leaves found.</div>
      )}

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Details</h2>
              <button
                onClick={handleCloseViewModal}
                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-2">
              <img src="/mn.png" width={70} alt="Employee" />
              <p><strong>Name:</strong> {selectedEmployee.emp_name}</p>
              <p><strong>Employee ID:</strong> {selectedEmployee.emp_id}</p>
              <p><strong>Department:</strong> {selectedEmployee.dep_name || "N/A"}</p>
              <p><strong>Joining Date:</strong> {joiningDate || "N/A"}</p>
              <p><strong>Role:</strong> {selectedEmployee.role || "N/A"}</p>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={handleCloseViewModal}
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
