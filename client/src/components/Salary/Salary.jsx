import { Link } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";
import useSalaries from "../../hooks/FetchSalary";

const Salary = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const {
    data: salaries = [],

    isLoading,
  } = useSalaries({ baseUrl, user, loading });
  console.log("salaries", salaries);

  const handleShowViewModal = (salary) => {
    setSelectedSalary(salary);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedSalary(null);
  };
  const columns = [
    {
      name: "S No",
      selector: (row, ind) => ind + 1,
      sortable: true,
    },
    {
      name: "Employee",
      selector: (row) => row?.employee.emp_name || "N/A",
      sortable: true,
    },
    {
      name: "Basic",
      selector: (row) => `₹${row.basicSalary}`,
    },
    {
      name: "Allowance",
      selector: (row) => `₹${row.allowance || 0}`,
    },
    {
      name: "Deductions",
      selector: (row) => `₹${row.deductions || 0}`,
    },
    {
      name: "Net Salary",
      selector: (row) => `₹${row.netSalary}`,
    },
    {
      name: "Pay Date",
      selector: (row) =>
        new Date(row.payDate).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        }),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleShowViewModal(row)}
          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
        >
          View
        </button>
      ),
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Salaries</h3>
      </div>
      <div className="flex justify-between mb-4 px-5">
        <input
          type="text"
          className="px-4 py-1 border rounded"
          placeholder="Search by name"
        />
        <Link
          to={`/admin-dashboard/salary/addSalary/${user._id}`}
          className="px-6 py-1 text-white rounded bg-primary hover:bg-secondary font-semibold"
        >
          Add Salary
        </Link>
      </div>

      <DataTable
        highlightOnHover
        pagination
        columns={columns}
        data={salaries}
        progressPending={isLoading}
      />

      {showViewModal && selectedSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Salary Details</h2>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-2">
              <p>
                <strong>Name:</strong>{" "}
                {selectedSalary.employeeId?.name || "N/A"}
              </p>
              <p>
                <strong>Basic Salary:</strong> ₹{selectedSalary.basicSalary}
              </p>
              <p>
                <strong>Allowance:</strong> ₹{selectedSalary.allowance || 0}
              </p>
              <p>
                <strong>Deductions:</strong> ₹{selectedSalary.deductions || 0}
              </p>
              <p>
                <strong>Net Salary:</strong> ₹{selectedSalary.netSalary}
              </p>
              <p>
                <strong>Pay Date:</strong>{" "}
                {new Date(selectedSalary.payDate).toLocaleDateString()}
              </p>
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

export default Salary;
