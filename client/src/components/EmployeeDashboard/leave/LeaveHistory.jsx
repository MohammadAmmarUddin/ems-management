import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const { user, loading } = useAuth();
  // Fetch departments data
  const fetchSingleUserLeave = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/leave/getLeave/${user._id}`
      );
      setLeaves(res.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    if (!loading) {
      fetchSingleUserLeave();
    }
  }, []);

  console.log(leaves);
  // Smoothly remove the department from the local state after deletion
  // const handleDelete = async (rowId) => {
  //   try {
  //     console.log("handleDelete", rowId);
  //     const res = await axios.delete(
  //       `http://localhost:5001/api/department/deleteDep/${rowId}`
  //     );

  //     // Update local state by filtering out the deleted department
  //     setDepartment((prevDepartments) =>
  //       prevDepartments.filter((department) => department._id !== rowId)
  //     );

  //     if (res.data.success === true) {
  //       Swal.fire({
  //         position: "center center",
  //         icon: "success",
  //         title: "Your work has been saved",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //     console.log("Department deleted successfully");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      name: "LEAVE TYPE",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "FROM",
      selector: (row) => row.startDate,
      sortable: true,
    },
    {
      name: "TO",
      selector: (row) => row.endDate
      ,
      sortable: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "APPLIED DATE",
      selector: (row) => row.appliedAt,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
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
            View
          </Link>
        </>
      ),
    },
  ];
  if (!user && loading) {
    return (
      <span className="loading loading-spinner text-[40px] text-secondary top-50% left-50%"></span>
    );
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
          to="/employee-dashboard/add-leave"
          className="px-6 py-1 mr-5 text-white rounded bg-green-600 hover:bg-green-800 font-semibold"
        >
          Add Leave
        </Link>
      </div>

      <div>
        <DataTable
          progressPending={loading}
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

export default LeaveHistory;
