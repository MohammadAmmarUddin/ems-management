import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useDepartments from "../../../hooks/FetchDepartment";

const DepartmentList = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data, isLoading, refetch } = useDepartments(
    baseUrl,
    search,
    page,
    limit
  );

  const departments = data?.result || [];
  const total = data?.total || 0;

  console.log(departments);

  const handleDelete = async (rowId) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/api/department/deleteDep/${rowId}`
      );

      if (res.data.success) {
        Swal.fire({
          position: "center center",
          icon: "success",
          title: "Department deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "S No",
      selector: (row, ind) => (page - 1) * limit + ind + 1, // ✅ correct serial number across pages
      sortable: false,
      width: "80px",
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Manager",
      selector: (row) => row.manager?.name || "N/A",
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) =>
        row.manager?.profileImage ? (
          <img
            src={`${baseUrl}/uploads/${row.manager?.profileImage}`}
            width={30}
            className="rounded-full"
            alt="Manager"
          />
        ) : (
          "N/A"
        ),
      width: "100px",
    },
    {
      name: "Total Employees",
      selector: (row) => row.employeeCount,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            to={`/admin-dashboard/edit-department/${row._id}`}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Departments</h3>
      </div>

      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search By Name"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Link
          to="/admin-dashboard/add-department"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded bg-primary hover:bg-secondary font-semibold transition-colors"
        >
          Add New Department
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {departments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No departments found</div>
        ) : (
          departments.map((dep, index) => (
            <div
              key={dep._id}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  {dep.dep_name?.charAt(0)?.toUpperCase() || "D"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {dep.dep_name}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{(page - 1) * limit + index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Manager:</span>{" "}
                    {dep.manager?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Employees:</span>{" "}
                    {dep.employeeCount ?? "N/A"}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {dep.manager?.profileImage ? (
                      <img
                        src={`${baseUrl}/uploads/${dep.manager.profileImage}`}
                        alt="Manager"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `${baseUrl}/uploads/default.png`;
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Link
                      to={`/admin-dashboard/edit-department/${dep._id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dep._id)}
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

        {total > limit && (
          <div className="flex justify-center gap-2 items-center pt-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit) || 1}
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
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <DataTable
          progressPending={isLoading}
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={total}
          paginationPerPage={limit}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          columns={columns}
          data={departments}
        />
      </div>
    </div>
  );
};

export default DepartmentList;
