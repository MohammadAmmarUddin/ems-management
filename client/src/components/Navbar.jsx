import { useEffect, useRef, useState } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import socket from "../socketClient.js";
import axios from "axios";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
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

    // Ensure socket is connected before joining room
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_room", user._id);

    const handleNewAnnouncement = (announcement) => {
      setNotifications((prev) => [announcement, ...prev]);
    };

    socket.on("new_announcement", handleNewAnnouncement);
    return () => {
      socket.off("new_announcement", handleNewAnnouncement);
    };
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
    <div className="bg-primary px-2 sm:px-3 md:px-4 py-2 flex items-center justify-between min-h-[56px]">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Hamburger (Mobile only) */}
        <FaBars
          className="text-white text-lg sm:text-xl cursor-pointer md:hidden flex-shrink-0"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        />

        {/* Welcome text (Desktop only) */}
        <p className="hidden md:block text-white font-bold font-sourceSans text-sm lg:text-base">
          Welcome {user?.name || "User"}
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="flex items-center gap-2 sm:gap-3 md:gap-4 relative flex-shrink-0"
        ref={dropdownRef}
      >
        {/* Notification */}
        <div className="relative flex-shrink-0">
          <FaBell
            className="text-white text-base sm:text-lg cursor-pointer"
            onClick={handleBellClick}
          />
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] text-center">
              {unreadNotifications.length}
            </span>
          )}

          {show && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-[320px] bg-white rounded shadow-lg border z-50">
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

        {/* Profile */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0 shadow-sm">
          <img
            src={`${baseUrl}/uploads/${user?.profileImage || "default.png"}`}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `${baseUrl}/uploads/default.png`;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
