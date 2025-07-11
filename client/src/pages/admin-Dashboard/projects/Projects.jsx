import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import useProjects from "../../../hooks/FetchProjects"; // make sure this exists

const Projects = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const {
    data: projects,
    refetch,

  } = useProjects(baseUrl);
  const handleDelete = async (projectId) => {
    try {
      const res = await axios.delete(`${baseUrl}/api/projects/${projectId}`);

      if (res.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Project deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to delete project", "error");
    }
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    marginRight: "6px",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const columns = [
    {
      name: "S/N",
      selector: (row, i) => i + 1,
      width: "70px",
    },
    {
      name: "Project Name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Manager",
      selector: (row) => row.department?.manager?.emp_name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name,
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
          className={`px-2 py-1 rounded text-white text-xs font-medium ${row.status === "Completed"
            ? "bg-green-600"
            : row.status === "In Progress"
              ? "bg-yellow-600"
              : "bg-gray-500"
            }`}
        >
          {row.status || "Pending"}
        </span>
      ),
    },
    // {
    //   name: "Tasks",
    //   selector: (row) => row.tasks?.length || 0,
    //   cell: (row) => (
    //     <Link
    //       to={`/admin-dashboard/project-tasks/${row._id}`}
    //       className="text-blue-600 underline hover:text-blue-800"
    //     >
    //       View Tasks
    //     </Link>
    //   ),
    // },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            to={`/admin-dashboard/edit-project/${row._id}`}
            style={buttonStyle}
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
          >
            Delete
          </button>
        </>
      ),
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
    <div className="py-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-700">Manage Projects</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="px-4 ml-5 py-1 border rounded"
          placeholder="Search by project name"
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
          columns={columns}
          data={projects || []}
        />
      </div>
    </div>
  );
};

export default Projects;
