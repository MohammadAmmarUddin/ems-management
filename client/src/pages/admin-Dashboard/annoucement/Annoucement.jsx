import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import useEmployees from "../../../hooks/FetchEmployee";

const Announcement = () => {
  const [type, setType] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const { data: employees = [] } = useEmployees(baseUrl);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchAnnouncements = async (newSkip = 0, append = false) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/annoucement/admin?skip=${newSkip}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        const fetched = res.data.announcements;
        setAnnouncements((prev) => (append ? [...prev, ...fetched] : fetched));
        setSkip(newSkip + limit);
        setHasMore(fetched.length === limit);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    fetchAnnouncements(0);
  }, []);

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
          senderType: "admin", // Indicate this was sent by admin
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        Swal.fire("Success", "Announcement sent!", "success");
        setMessage("");
        setSelectedEmployee("");
        setType("all");
        fetchAnnouncements(0);
      } else {
        Swal.fire("Error", res.data.message || "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send announcement.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This announcement will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(`${baseUrl}/api/annoucement/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          Swal.fire("Deleted", "Announcement deleted successfully.", "success");
          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
        } else {
          Swal.fire("Error", res.data.message || "Failed to delete.", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete announcement.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left Section - Post Announcement */}
      <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Announcement Type:</label>
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
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.emp_name} ({emp.emp_email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded p-2 w-full h-24"
            placeholder="Type your announcement..."
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send Announcement
        </button>
      </div>

      {/* Right Section - Announcements List */}
      <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-6 h-[500px] flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Announcements List</h2>

        <div className="flex-1 overflow-y-auto space-y-4">
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements available.</p>
          ) : (
            announcements.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow relative">
                <div className="text-gray-700 mb-2">{item.message}</div>
                <div className="text-sm text-gray-500 mb-1">
                  <strong>Type:</strong> {item.type}
                  {item.type === "selected" && item.selectedEmployee && (
                    <>
                      {" "} - {item.selectedEmployee?.emp_name} (
                      {item.selectedEmployee?.emp_email})
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <strong>From:</strong> {item.senderType === "admin" ? "Admin" : item.sender?.emp_name}
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(item.createdAt), "PPP p")}
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {hasMore && (
          <button
            onClick={() => fetchAnnouncements(skip, true)}
            className="mt-4 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Announcement;
