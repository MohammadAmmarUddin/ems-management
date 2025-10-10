import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import socket from "../socketClient.js";
import axios from "axios";

const Navbar = () => {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/annoucement/employee/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setNotifications(res.data.announcements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (ids) => {
    try {
      await Promise.all(
        ids.map((id) =>
          axios.put(`${baseUrl}/api/annoucement/read/${id}`, null, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setNotifications((prev) =>
        prev.map((a) =>
          ids.includes(a._id)
            ? { ...a, readBy: [...(a.readBy || []), user._id] }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    if (!user?._id) return;

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
        setNotifications((prev) => [announcement, ...prev]);
      }
    };

    socket.on("new_announcement", handleNewAnnouncement);
    return () => socket.off("new_announcement", handleNewAnnouncement);
  }, [user]);

  const unreadNotifications = notifications.filter(
    (n) => !(n.readBy || []).includes(user._id)
  );

  const handleBellClick = () => {
    setShow((prev) => !prev);
    if (unreadNotifications.length > 0) {
      markAsRead(unreadNotifications.map((n) => n._id));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center h-12 bg-primary px-4 relative">
      <p className="text-white font-bold font-sourceSans">
        Welcome {user?.name || "User"}
      </p>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <div className="relative">
          <FaBell
            className="text-white text-lg cursor-pointer"
            onClick={handleBellClick}
          />
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unreadNotifications.length}
            </span>
          )}

          {show && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg border z-50">
              <ul className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="p-3 text-sm text-gray-500 text-center">
                    No notifications
                  </li>
                ) : (
                  notifications.map((n, index) => {
                    const isUnread = !(n.readBy || []).includes(user._id);
                    return (
                      <li
                        key={n._id || index}
                        className={`p-3 text-sm border-b hover:bg-gray-100 ${
                          isUnread ? "bg-blue-100 font-semibold" : ""
                        }`}
                      >
                        {n.message}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
          <img
            src={`${baseUrl}/uploads/${user?.profileImage || "default.png"}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
