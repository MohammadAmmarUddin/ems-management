import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
const DepartmentList = () => {
  const [departments, setDepartment] = useState([]);
  const [depLoading, setdepLoading] = useState(true);

  const fetchDepartment = async () => {
    try {
      setdepLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/department/getAllDep"
      );
      console.log(res);
      setDepartment(res.data.result);
      setdepLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setdepLoading(false);
    }
  };
  useEffect(() => {
    fetchDepartment();
  }, []);

  // deleting item from table

  const handleDelete = async (rowId) => {
    try {
      console.log("handleDelete", rowId);
      const res = await axios.delete(
        `http://localhost:5000/api/department/deleteDep/${rowId}`
      );
      fetchDepartment();

      // setDepartment((prev) => {
      //   prev.filter((dep) => dep._id !== rowId);
      // });
      if (res.data.success === true) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      console.log(res);
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

  // columns of table

  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
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

  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>
      <div className="flex justify-between">
        <input
          type="text"
          className="px-4  ml-5 py-0.5"
          placeholder="Search By Name"
          name=""
          id=""
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-6 py-1 mr-5 text-white rounded bg-green-600 hover:bg-green-800 font-semibold"
        >
          Add New Department
        </Link>
      </div>

      <div>
        <DataTable
          progressPending={depLoading}
          highlightOnHover
          selectableRows
          pagination
          columns={columns}
          data={departments}
        ></DataTable>
      </div>
    </div>
  );
};

export default DepartmentList;
