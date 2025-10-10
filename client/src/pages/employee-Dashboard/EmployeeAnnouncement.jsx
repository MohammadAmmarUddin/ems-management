import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext.jsx";
import socket from "../../socketClient.js";

const EmployeeAnnouncement = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fetch announcements from server
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/annoucement/employee/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  // Mark announcement as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${baseUrl}/api/annoucement/read/${id}`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnnouncements((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, readBy: [...(a.readBy || []), user._id] } : a
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Socket setup for real-time announcements
  useEffect(() => {
    fetchAnnouncements();
    socket.emit("join_room", user._id);

    const handleNewAnnouncement = (announcement) => {
      // Filter announcements for this user
      if (
        announcement.type === "all" ||
        announcement.type === "employees" ||
        (announcement.type === "selected" &&
          String(
            announcement.selectedEmployee?._id || announcement.selectedEmployee
          ) === user._id)
      ) {
        // Show toast only for unread
        if (!(announcement.readBy || []).includes(user._id)) {
          Swal.fire({
            title: "📢 New Announcement",
            text: announcement.message,
            icon: "info",
            timer: 3000,
            showConfirmButton: false,
          });
        }

        setAnnouncements((prev) => [announcement, ...prev]);
      }
    };

    socket.on("new_announcement", handleNewAnnouncement);

    return () => {
      socket.off("new_announcement", handleNewAnnouncement);
      socket.disconnect();
    };
  }, [user]);

  // Filter unread announcements for Navbar badge or any count
  const unreadAnnouncements = announcements.filter(
    (a) => !(a.readBy || []).includes(user._id)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements found.</p>
        ) : (
          announcements.map((item) => {
            const isUnread = !(item.readBy || []).includes(user._id);
            return (
              <div
                key={item._id}
                className={`p-4 rounded shadow cursor-pointer ${
                  isUnread ? "bg-blue-100 font-semibold" : "bg-white"
                }`}
                onClick={() => markAsRead(item._id)}
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmployeeAnnouncement;
