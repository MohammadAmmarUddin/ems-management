import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import useProjects from "../../../hooks/FetchProjects";

const Projects = () => {
  const { loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, refetch, isLoading } = useProjects(
    baseUrl,
    debouncedSearch,
    page,
    limit
  );

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await axios.delete(`${baseUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire("Deleted!", "Project has been removed.", "success");
        refetch();
      }
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const columns = [
    { name: "S/N", selector: (_, i) => i + 1, width: "70px" },
    { name: "Project Name", selector: (row) => row.title, sortable: true },
    { name: "Manager", selector: (row) => row.manager?.emp_name || "N/A" },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "N/A",
    },
    {
      name: "Issue Date",
      selector: (row) =>
        row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A",
    },
    {
      name: "Expected Date",
      selector: (row) =>
        row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-white text-xs font-medium ${
            row.status === "completed"
              ? "bg-green-600"
              : row.status === "in progress"
              ? "bg-yellow-600"
              : "bg-gray-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            to={`/admin-dashboard/edit-project/${row._id}`}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </>
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
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Projects</h3>
      </div>

      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search by project, manager, department, status..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Link
          to="/admin-dashboard/add-project"
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded bg-primary hover:bg-secondary font-semibold transition-colors"
        >
          Add New Project
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (data?.projects || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500">No projects found</div>
        ) : (
          data.projects.map((project, index) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  {project.title?.charAt(0)?.toUpperCase() || "P"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {project.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Manager:</span>{" "}
                    {project.manager?.emp_name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Dept:</span>{" "}
                    {project.department?.dep_name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Status:</span> {project.status}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Start:</span>{" "}
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Due:</span>{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Link
                      to={`/admin-dashboard/edit-project/${project._id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
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

        {(data?.total || 0) > limit && (
          <div className="flex justify-center gap-2 items-center pt-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil((data?.total || 0) / limit) || 1}
            </span>
            <button
              onClick={() =>
                setPage(Math.min(Math.ceil((data?.total || 0) / limit), page + 1))
              }
              disabled={page >= Math.ceil((data?.total || 0) / limit)}
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
          highlightOnHover
          pagination
          paginationServer
          paginationTotalRows={data?.total || 0}
          paginationPerPage={limit}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          columns={columns}
          data={data?.projects || []}
        />
      </div>
    </div>
  );
};

export default Projects;
