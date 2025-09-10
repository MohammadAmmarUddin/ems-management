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
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      <div className="flex justify-between my-3">
        <input
          type="text"
          className="px-4 ml-5 py-1 border rounded"
          placeholder="Search By Name"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add New Department
        </Link>
      </div>

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
  );
};

export default DepartmentList;
