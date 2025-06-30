import { useState } from "react";
import useEmployees from "../../../hooks/FetchEmployee";
import axios from "axios";
import Swal from "sweetalert2";

const Announcement = () => {
  const [type, setType] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [message, setMessage] = useState("");
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees(baseUrl);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleSubmit = async () => {
    if (!message.trim()) {
      Swal.fire("Error", "Announcement message is required.", "error");
      return;
    }

    if (type === "selected" && !selectedEmployee) {
      Swal.fire("Error", "Please select an employee.", "error");
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/api/annoucement`,
        {
          message,
          type,
          selectedEmployee: type === "selected" ? selectedEmployee : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        Swal.fire("Success", "Announcement sent successfully.", "success");
        setMessage("");
        setSelectedEmployee("");
        setType("all");
      } else {
        Swal.fire("Error", res.data.message || "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send announcement.", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Announcement Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="all">All</option>
          <option value="employees">Employees Only</option>
          <option value="managers">Managers Only</option>
          <option value="selected">Selected Employee</option>
        </select>
      </div>

      {type === "selected" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.emp_name} ({emp.emp_email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Announcement Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded p-2 w-full h-24"
          placeholder="Type your announcement here..."
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send Announcement
      </button>
    </div>
  );
};

export default Announcement;
