import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  // Fetch departments data
  const fetchSingleUserLeave = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/leave/getLeave/${user._id}`
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

  if (!user && loading){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
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
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
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
