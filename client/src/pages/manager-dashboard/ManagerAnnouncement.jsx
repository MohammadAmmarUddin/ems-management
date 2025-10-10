import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import useEmployees from "../../hooks/FetchEmployee";
import socket from "../../socketClient.js";
import { useAuth } from "../../context/AuthContext";

const ManagerAnnouncement = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("employees");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const { data: employees = [] } = useEmployees(baseUrl);

  useEffect(() => {
    socket.connect();
    socket.emit("join_room", user._id);

    const handleNewAnnouncement = (announcement) => {
      if (
        announcement.type === "all" ||
        announcement.type === "employees" ||
        (announcement.type === "selected" &&
          String(
            announcement.selectedEmployee?._id || announcement.selectedEmployee
          ) === user._id)
      ) {
        setAnnouncements((prev) => [announcement, ...prev]);
        Swal.fire({
          title: "📢 New Announcement",
          text: announcement.message,
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    };

    socket.on("new_announcement", handleNewAnnouncement);

    return () => {
      socket.off("new_announcement", handleNewAnnouncement);
      socket.disconnect();
    };
  }, [user]);

  const fetchAnnouncements = async (newSkip = 0, append = false) => {
    try {
      const res = await axios.get(`${baseUrl}/api/annoucement/manager`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { skip: newSkip, limit },
      });

      if (res.data.success) {
        if (append) {
          setAnnouncements((prev) => [...prev, ...res.data.announcements]);
        } else {
          setAnnouncements(res.data.announcements);
        }
        setSkip(newSkip + limit);
        setHasMore(res.data.announcements.length === limit);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements(0);
  }, []);

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
        const res = await axios.delete(
          `${baseUrl}/api/annoucement/manager/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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

  const handleSubmit = async () => {
    if (!message.trim()) {
      return Swal.fire("Error", "Message is required.", "error");
    }

    if (type === "selected" && !selectedEmployee) {
      return Swal.fire("Error", "Please select an employee.", "error");
    }

    try {
      const res = await axios.post(
        `${baseUrl}/api/annoucement/manager`,
        {
          message,
          type,
          selectedEmployee: type === "selected" ? selectedEmployee : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        Swal.fire("Success", "Announcement sent!", "success");
        setMessage("");
        setType("employees");
        setSelectedEmployee("");
        fetchAnnouncements(0);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to send announcement", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Send Announcement</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Announcement Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="employees">All Employees</option>
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
              <option value="">Choose Employee</option>
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
            placeholder="Write your announcement..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

      <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-6 h-[500px] flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Your Announcements</h2>

        <div className="flex-1 overflow-y-auto space-y-4">
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements found.</p>
          ) : (
            announcements.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded shadow relative"
              >
                <div className="text-gray-700 mb-2">{item.message}</div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">From:</span>{" "}
                  {item.senderType === "admin"
                    ? "Admin"
                    : item.sender?.emp_name || "Manager"}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">To:</span>{" "}
                  {item.type === "selected"
                    ? `${item.selectedEmployee?.emp_name} (${item.selectedEmployee?.emp_email})`
                    : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(item.createdAt), "PPP p")}
                </div>

                {item.senderType === "manager" && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
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

export default ManagerAnnouncement;
