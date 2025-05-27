import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/leave/getAllleaves`
      );
      setEmployees(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    if (user && !loading) {
      fetchEmployees();
    }
  }, []);

  console.log(selectedEmployee);
  // Open the View modal
  const handleShowViewModal = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // Close the View modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedEmployee(null);
  };

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
      name: "Emp ID",
      selector: (row) => row.emp_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leave_type,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Days",
      selector: (row) => row.days,
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
        <>
          <button
            onClick={() => handleShowViewModal(row)}
            style={{
              ...buttonStyle,
              backgroundColor: "green",
              whiteSpace: "nowrap",
            }}
          >
            View
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>
      <div className="flex justify-between my-4">
        <input
          type="text"
          className="px-4 py-1 border rounded ml-5"
          placeholder="Search By Name"
        />
        <Link
          to={`/admin-dashboard/salary/addSalary/${user._id}`}
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
         Add Leave
        </Link>
       
      </div>

      <div>
        <DataTable
          highlightOnHover
          selectableRows
          pagination
          columns={columns}
          data={employees}
        />
      </div>

      {/* Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Details</h2>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {selectedEmployee ? (
                <div>
                  <img src="/mn.png" width={70} alt="" />
                  <p>
                    <strong>Name:</strong> {selectedEmployee.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedEmployee.email}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedEmployee.department || "N/A"}
                  </p>
                  <p>
                    <strong>Joining Date:</strong>{" "}
                    {selectedEmployee.joiningDate || "N/A"}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedEmployee.role || "N/A"}
                  </p>
                </div>
              ) : (
                <p>No employee selected.</p>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={handleCloseViewModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default Salary;
