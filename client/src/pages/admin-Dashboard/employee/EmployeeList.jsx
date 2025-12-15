import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const List = () => {
  const { loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchEmployees = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(
        `${baseUrl}/api/employee/searchEmployees`,
        {
          params: {
            q: searchQuery,
            page,
            limit,
            all: showAll ? "true" : "false",
          },
        }
      );

      if (data.success) {
        setEmployees(data.employees);
        setTotal(data.total);
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to fetch employees.", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery, page, limit, showAll]);

  const handleDeleteEmployee = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      try {
        const { data } = await axios.delete(
          `${baseUrl}/api/employee/deleteEmployee/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          Swal.fire("Deleted!", "Employee removed successfully.", "success");
          fetchEmployees();
        }
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  const columns = [
    { name: "S No", selector: (_, ind) => ind + 1, width: "70px" },
    { name: "Emp ID", selector: (row) => row.employeeId, width: "140px" },
    { name: "Name", selector: (row) => row.emp_name, sortable: true },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`${baseUrl}/uploads/${row.profileImage}`}
          className="w-9 h-9 rounded-full object-cover"
          alt=""
        />
      ),
      width: "90px",
    },
    { name: "Role", selector: (row) => row.role, width: "120px" },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "N/A",
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedEmployee(row);
              setShowViewModal(true);
            }}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            View
          </button>

          <Link
            to={`/admin-dashboard/edit-employee/${row.userId}`}
            className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Link>

          <Link
            to={`/admin-dashboard/employee/salary/${row.userId}`}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Salary
          </Link>

          <button
            onClick={() => handleDeleteEmployee(row.userId)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-5">
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
        Manage Employees
      </h3>

      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setPage(1);
            setSearchQuery(e.target.value);
          }}
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search by Name, ID, Role or Department"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary text-white rounded hover:bg-secondary font-semibold transition-colors"
        >
          Add New Employee
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {fetching ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        ) : (
          employees.map((employee, index) => (
            <div
              key={employee.userId}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={`${baseUrl}/uploads/${employee.profileImage}`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  alt={employee.emp_name}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {employee.emp_name}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">ID:</span>{" "}
                    {employee.employeeId}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Role:</span> {employee.role}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Dept:</span>{" "}
                    {employee.department?.dep_name || "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowViewModal(true);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      View
                    </button>
                    <Link
                      to={`/admin-dashboard/edit-employee/${employee.userId}`}
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin-dashboard/employee/salary/${employee.userId}`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Salary
                    </Link>
                    <button
                      onClick={() => handleDeleteEmployee(employee.userId)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {!showAll && total > limit && (
          <div className="flex justify-center gap-2 items-center pt-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() =>
                setPage(Math.min(Math.ceil(total / limit), page + 1))
              }
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        {total > limit && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
            >
              {showAll ? "Show Paginated" : "See All"}
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <DataTable
          columns={columns}
          data={employees}
          progressPending={fetching}
          pagination={!showAll}
          paginationServer
          paginationTotalRows={total}
          paginationPerPage={limit}
          onChangePage={setPage}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          highlightOnHover
          responsive
        />
      </div>

      {total > limit && (
        <div className="hidden md:flex justify-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showAll ? "Show Paginated" : "See All"}
          </button>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-[95%] sm:w-11/12 max-w-md rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Employee Details</h2>
              <button onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="p-4 space-y-2">
              <img
                src={`${baseUrl}/uploads/${selectedEmployee.profileImage}`}
                className="w-16 h-16 rounded-full"
                alt=""
              />
              <p>
                <b>Name:</b> {selectedEmployee.emp_name}
              </p>
              <p>
                <b>Employee ID:</b> {selectedEmployee.employeeId}
              </p>
              <p>
                <b>Department:</b>{" "}
                {selectedEmployee.department?.dep_name || "N/A"}
              </p>
              <p>
                <b>Role:</b> {selectedEmployee.role}
              </p>
              <p>
                <b>Joining Date:</b>{" "}
                {new Date(selectedEmployee.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 border-t text-right">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
