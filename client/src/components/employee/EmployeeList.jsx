import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { user, loading } = useAuth();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const date = new Date(selectedEmployee?.createdAt);
  const joiningDate = date.toLocaleString(); // Automatically formats to local date-time format
  const [depLoading, setdepLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  // Fetch employees data with search functionality
  const fetchEmployees = async (query = "") => {
    try {
      setdepLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/employee/searchEmployees?query=${query}`
      );
      setEmployees(res.data.emp);
    } catch (error) {
       setdepLoading(false);
      console.log(error);
    }
    finally {
      setdepLoading(false);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    if (user && !loading) {
      fetchEmployees();
    }
  }, [user, loading]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchEmployees(e.target.value); // Fetch filtered employees based on the query
  };

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

  // Columns for the DataTable
  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
      sortable: true,
      width: "50px",
    },
    {
      name: "Emp_Id",
      selector: (row) => row.emp_id,
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.emp_name,
      sortable: true,
      width: "180px",
    },
    {
      name: "Email",
      selector: (row) => row.role,
      sortable: true,
      width: "150px",
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleShowViewModal(row)}
            className="bg-view text-white p-2 rounded-lg hover:bg-green-600"
          >
            View
          </button>
          <Link
            to={`/admin-dashboard/edit-employee/${row._id}`}
            className="bg-edit text-white p-2 rounded-lg hover:bg-orange-600"
          >
            Edit
          </Link>
          <Link
            to={`/admin-dashboard/edit-employee/salary-history/${row._id}`}
            className="bg-accent text-white p-2 rounded-lg hover:bg-yellow-600"
          >
            Salary
          </Link>
          <button
            onClick={() => console.log("Delete functionality not added yet!")}
            className="bg-delete text-white p-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
      width: "280px",
    },
  ];

  // Loading spinner view
  if (loading || depLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
     <span className="loading loading-spinner text-white loading-6xl"></span>
      </div>
    );
  }
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>
      <div className="flex justify-between my-4">
        <input
          type="text"
          value={searchQuery} // Controlled input field
          onChange={handleSearchChange} // Update query on change
          className="px-4 py-1 border rounded ml-5"
          placeholder="Search By Name, ID, Role, or Department"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add New Employee
        </Link>
      </div>

      <div className="overflow-hidden">
        <DataTable
          highlightOnHover
          selectableRows
          pagination
          columns={columns}
          data={employees}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
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
                    <strong>Name:</strong> {selectedEmployee.emp_name}
                  </p>
                  <p>
                    <strong>Employee_Id:</strong> {selectedEmployee.emp_id}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedEmployee.dep_name || "N/A"}
                  </p>
                  <p>
                    <strong>Joining Date:</strong> {joiningDate || "N/A"}
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
