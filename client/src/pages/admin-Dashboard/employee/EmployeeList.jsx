import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const List = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // rows per page
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
      console.error(err);
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
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const { data } = await axios.delete(
          `${baseUrl}/api/employee/deleteEmployee/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          Swal.fire("Deleted!", "Employee removed successfully.", "success");
          fetchEmployees();
        } else {
          Swal.fire("Failed!", "Something went wrong.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    }
  };

  const columns = [
    { name: "S No", selector: (row, ind) => ind + 1, width: "70px" },
    {
      name: "Emp_Id",
      selector: (row) => row.employeeId,
      sortable: true,
      width: "150px",
    },
    {
      name: "Name",
      selector: (row) => row.emp_name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          src={`${baseUrl}/uploads/${row.profileImage}`}
          width={35}
          className="rounded-full"
          alt=""
        />
      ),
      width: "150px",
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      width: "150px",
    },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "N/A",
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedEmployee(row);
              setShowViewModal(true);
            }}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
          >
            View
          </button>
          <Link
            to={`/admin-dashboard/edit-employee/${row.userId}`}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
          >
            Edit
          </Link>
          <Link
            to={`/admin-dashboard/employee/salary/${row.userId}`}
            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
          >
            Salary
          </Link>
          <button
            onClick={() => handleDeleteEmployee(row.userId)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
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
          value={searchQuery}
          onChange={(e) => {
            setPage(1);
            setSearchQuery(e.target.value);
          }}
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
          pagination={!showAll}
          paginationServer
          paginationTotalRows={total}
          paginationPerPage={limit}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit);
            setPage(1); // reset to first page
          }}
          progressPending={fetching}
          columns={columns}
          data={employees}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
        />
      </div>

      <div className="flex justify-center my-4">
        {total > limit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAll ? "Show Paginated" : "See All"}
          </button>
        )}
      </div>

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <img
                src={`${baseUrl}/uploads/${selectedEmployee.profileImage}`}
                width={70}
                alt=""
              />
              <p>
                <strong>Name:</strong> {selectedEmployee.emp_name}
              </p>
              <p>
                <strong>Employee_Id:</strong> {selectedEmployee.employeeId}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {selectedEmployee.department?.dep_name || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedEmployee.role || "N/A"}
              </p>
              <p>
                <strong>Joining Date:</strong>{" "}
                {new Date(selectedEmployee.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
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
