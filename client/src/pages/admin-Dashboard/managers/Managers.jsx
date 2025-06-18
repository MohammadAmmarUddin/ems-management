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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const {
    data: managers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useManagers({ baseUrl });

  const date = new Date(selectedManager?.createdAt);
  const joiningDate = date.toLocaleString();

  const handleShowViewModal = (manager) => {
    setSelectedManager(manager);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedManager(null);
  };

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
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.delete(
          `${baseUrl}/api/manager/deleteManager/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Manager deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        } else {
          Swal.fire("Failed!", "Something went wrong.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    }
  };

  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
      sortable: true,
      width: "50px",
    },
    {
      name: "Manager_Id",
      selector: (row) => row.managerId,
      sortable: true,
      width: "150px",
    },
    {
      name: "Name",
      selector: (row) => row.mang_name,
      sortable: true,
      width: "180px",
    },
    {
      name: "Phone",
      selector: (row) => row.mang_phone,
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.mang_email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleShowViewModal(row)}
            className="bg-view text-white p-2 rounded-lg hover:bg-green-600"
          >
            View
          </button>
          <Link
            to={`/admin-dashboard/edit-manager/${row._id}`}
            className="bg-edit text-white p-2 rounded-lg hover:bg-orange-600"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDeleteManager(row._id)}
            className="bg-delete text-white p-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
      width: "250px",
      center: true,
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Error fetching managers: {error.message}</p>
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-1 border rounded ml-5"
          placeholder="Search by Name, ID, Phone"
        />
        <Link
          to="/admin-dashboard/add-manager"
          className="px-6 py-1 mr-5 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add New Manager
        </Link>
      </div>

      <div className="overflow-hidden">
        <DataTable
          highlightOnHover
          pagination
          columns={columns}
          data={managers || []}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          responsive
        />
      </div>

      {/* Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Manager Details</h2>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {selectedManager ? (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedManager?.mang_name}
                  </p>
                  <p>
                    <strong>Manager ID:</strong> {selectedManager?.managerId}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedManager?.mang_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedManager?.mang_email}
                  </p>
                  <p>
                    <strong>Joining Date:</strong> {joiningDate || "N/A"}
                  </p>
                </div>
              ) : (
                <p>No manager selected.</p>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={handleCloseViewModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerList;
