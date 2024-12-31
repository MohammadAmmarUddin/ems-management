import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const GetLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [depLoading, setdepLoading] = useState(true);
  const { user,loading } = useAuth();
  console.log("user from dep" , user);
  // Fetch departments data
  const fetchDepartment = async () => {
    try {
      setdepLoading(true);
      const res = await axios.get(
        "http://localhost:5001/api/department/getAllDep"
      );
      setLeaves(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setdepLoading(false);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    fetchDepartment();
  }, []);

  // Smoothly remove the department from the local state after deletion
  const handleDelete = async (rowId) => {
    try {
      console.log("handleDelete", rowId);
      const res = await axios.delete(
        `http://localhost:5001/api/department/deleteDep/${rowId}`
      );

      // Update local state by filtering out the deleted department
      setDepartment((prevDepartments) =>
        prevDepartments.filter((department) => department._id !== rowId)
      );

      if (res.data.success === true) {
        Swal.fire({
          position: "center center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      console.log("Department deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "3px 5px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  };

  // Columns of table
  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Department Desc",
      selector: (row) => row.dep_desc,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            to={`/admin-dashboard/edit-department/${row._id}`}
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
  if (!user && loading) {
    return <div>loading-----</div>;
  }
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leave</h3>
      </div>
      <div className="flex justify-between">
        <input
          type="text"
          className="px-4 ml-5 py-0.5"
          placeholder="Search By Name"
        />
        <Link
          to="/admin-dashboard/request-leave"
          className="px-6 py-1 mr-5 text-white rounded bg-green-600 hover:bg-green-800 font-semibold"
        >
          Add Leave
        </Link>
      </div>

      <div>
        <DataTable
          progressPending={depLoading}
          highlightOnHover
          selectableRows
          pagination
          columns={columns}
          data={leaves}
        />
      </div>
    </div>
  );
};

export default GetLeave;
