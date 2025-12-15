import { Link } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useAuth } from "../../../context/AuthContext";
import useSalaries from "../../../hooks/FetchSalary";

const Salary = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const {
    data: salaries = [],

    isLoading,
  } = useSalaries({ baseUrl, user, loading });

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
      selector: (row) => row.employee.emp_name || "N/A",
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
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold">Manage Salaries</h3>
      </div>
      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 px-0 sm:px-1">
        <input
          type="text"
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search by name"
        />
        <Link
          to={`/admin-dashboard/salary/addSalary/${user._id}`}
          className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded bg-primary hover:bg-secondary font-semibold transition-colors"
        >
          Add Salary
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {salaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No salaries found</div>
        ) : (
          salaries.map((salary, index) => (
            <div
              key={salary._id || index}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  {salary.employee?.emp_name?.charAt(0)?.toUpperCase() || "E"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {salary.employee?.emp_name || "N/A"}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Basic:</span> ₹
                    {salary.basicSalary}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Allowance:</span> ₹
                    {salary.allowance || 0}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Deductions:</span> ₹
                    {salary.deductions || 0}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Net:</span> ₹
                    {salary.netSalary}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Pay Date:</span>{" "}
                    {salary.payDate
                      ? new Date(salary.payDate).toLocaleDateString("en-GB", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      onClick={() => handleShowViewModal(salary)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <DataTable
          highlightOnHover
          pagination
          columns={columns}
          data={salaries}
          progressPending={isLoading}
        />
      </div>

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
                {selectedSalary.employee.emp_name || "N/A"}
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
