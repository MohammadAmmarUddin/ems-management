import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import useProjects from "../../../hooks/FetchProjects";
import { useState, useEffect } from "react";
import axios from "axios";

const Projects = () => {
  const { user, loading } = useAuth();
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
      if (res.data.success) refetch();
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const columns = [
    { name: "S/N", selector: (_, i) => i + 1, width: "70px" },
    { name: "Project Name", selector: (row) => row.title, sortable: true },
    {
      name: "Manager",
      selector: (row) => row.manager?.emp_name || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "N/A",
      sortable: true,
    },
    {
      name: "Issue Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      name: "Expected Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      name: "Status",
      selector: (row) => row.status || "Pending",
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
          {row.status || "Pending"}
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

  if (loading || isLoading) return <div>Loading...</div>;

  return (
    <div className="py-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Projects</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="px-4 ml-5 py-1 border rounded"
          placeholder="Search by project, manager, department, status..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Link
          to="/admin-dashboard/add-project"
          className="px-6 py-2 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add New Project
        </Link>
      </div>

      <div className="bg-white py-4 rounded shadow">
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
