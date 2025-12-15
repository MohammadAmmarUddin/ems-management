import { Link } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import useManagers from "../../../hooks/FetchManagers";

const ManagerList = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, refetch } = useManagers({
    baseUrl,
    search: searchQuery,
    page,
    limit,
    showAll,
  });

  const managers = data?.managers || [];
  const total = data?.total || 0;

  const handleDeleteManager = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const { data } = await axios.delete(
          `${baseUrl}/api/employee/deleteEmployee/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          Swal.fire("Deleted!", "Manager removed successfully.", "success");
          refetch(); // refresh list
        } else {
          Swal.fire("Failed!", "Something went wrong.", "error");
        }
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || err.message,
          "error"
        );
      }
    }
  };

  const columns = [
    { name: "S No", selector: (row, i) => i + 1, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.emp_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "N/A",
      width: "180px",
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          src={`${baseUrl}/uploads/${row.profileImage}`}
          width={30}
          className="rounded-full"
          alt=""
        />
      ),
      width: "120px",
    },
    { name: "Phone", selector: (row) => row.emp_phone, width: "150px" },
    { name: "Email", selector: (row) => row.emp_email, width: "200px" },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin-dashboard/edit-employee/${row._id}`}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDeleteManager(row._id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
      width: "200px",
      center: true,
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
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Managers</h3>
      </div>

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
          placeholder="Search by Name, ID, Phone"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary text-white rounded hover:bg-secondary font-semibold transition-colors"
        >
          Add New Manager
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : managers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No managers found</div>
        ) : (
          managers.map((manager, index) => (
            <div
              key={manager._id}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={`${baseUrl}/uploads/${manager.profileImage}`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  alt={manager.emp_name}
                  onError={(e) => {
                    e.target.src = `${baseUrl}/uploads/default.png`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {manager.emp_name}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Dept:</span>{" "}
                    {manager.department?.dep_name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Phone:</span>{" "}
                    {manager.emp_phone}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Email:</span>{" "}
                    {manager.emp_email}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Link
                      to={`/admin-dashboard/edit-employee/${manager._id}`}
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteManager(manager._id)}
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
              onClick={() => setPage(Math.min(Math.ceil(total / limit), page + 1))}
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
          highlightOnHover
          pagination={!showAll}
          paginationServer
          paginationTotalRows={total}
          paginationPerPage={limit}
          onChangePage={setPage}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          progressPending={isLoading}
          columns={columns}
          data={managers}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
        />
      </div>

      {total > limit && (
        <div className="hidden md:flex justify-center my-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showAll ? "Show Paginated" : "See All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerList;
