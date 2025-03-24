import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";

const List = () => {
  const [employees, setEmployees] = useState([]);

  const { user, loading } = useAuth();

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/employee/getEmployees"
      );
      setEmployees(res.data.emp);
      console.log(res.data.emp[0]);
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
      name: "Emp_Id",
      selector: (row) => row.emp_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.emp_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            onClick={() => handleShowViewModal(row)}
            style={{ ...buttonStyle, backgroundColor: "green", whiteSpace: "nowrap" }}
          >
            View
          </button>
          <Link
            to={`/admin-dashboard/edit-employee/${row._id}`}
            style={{ ...buttonStyle, backgroundColor: "blue", whiteSpace: "nowrap" }}
          >
            Edit
          </Link>
          <Link
            to={`/admin-dashboard/edit-employee/salary-history/${row._id}`}
            style={{ ...buttonStyle, backgroundColor: "orange", whiteSpace: "nowrap" }}
          >
            Salary
          </Link>
          <button
            onClick={() => console.log("Delete functionality not added yet!")}
            style={{ ...buttonStyle, backgroundColor: "#dc3545", whiteSpace: "nowrap" }}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>
      <div className="flex justify-between my-4">
        <input
          type="text"
          className="px-4 py-1 border rounded ml-5"
          placeholder="Search By Name"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-6 py-1 mr-5 text-white rounded bg-green-600 hover:bg-green-800 font-semibold"
        >
          Add New Employee
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

export default List;
