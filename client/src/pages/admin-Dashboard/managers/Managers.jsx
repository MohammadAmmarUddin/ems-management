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
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Managers</h3>
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
          placeholder="Search by Name, ID, Phone"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add New Manager
        </Link>
      </div>

      <div className="overflow-hidden">
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
        <div className="flex justify-center my-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAll ? "Show Paginated" : "See All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerList;
