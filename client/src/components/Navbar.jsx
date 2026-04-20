import { useCallback, useEffect, useRef, useState } from "react";
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
  const [viewerReadId, setViewerReadId] = useState(null);
  const [locallyReadIds, setLocallyReadIds] = useState([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef();
  const storageKey = user?._id ? `ems_read_notifications_${user._id}` : null;

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${baseUrl}/api/annoucement/employee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.announcements);
        setViewerReadId(user._id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [baseUrl, token, user?._id]);

  const markAsRead = async (ids) => {
    try {
      await Promise.all(
        ids.map((id) =>
          axios.put(`${baseUrl}/api/annoucement/read/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setNotifications((prev) =>
        prev.map((a) =>
          ids.includes(a._id)
            ? { ...a, readBy: [...(a.readBy || []), viewerReadId || user._id] }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchNotifications();

    if (storageKey) {
      try {
        const cached = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setLocallyReadIds(Array.isArray(cached) ? cached : []);
      } catch {
        setLocallyReadIds([]);
      }
    }

    // Ensure socket is connected before joining room
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_room", user._id);

    const handleNewAnnouncement = (announcement) => {
      setNotifications((prev) => {
        if (prev.some((item) => item._id === announcement._id)) {
          return prev;
        }
        return [announcement, ...prev];
      });
    };

    socket.on("new_announcement", handleNewAnnouncement);
    return () => {
      socket.off("new_announcement", handleNewAnnouncement);
    };
  }, [fetchNotifications, user?._id, user?.role, storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(locallyReadIds));
  }, [locallyReadIds, storageKey]);

  const unreadNotifications = notifications.filter(
    (n) => {
      const isReadOnServer =
        viewerReadId &&
        (n.readBy || []).some((id) => String(id) === String(viewerReadId));
      const isReadLocally = locallyReadIds.includes(String(n._id));
      return !isReadOnServer && !isReadLocally;
    }
  );

  const handleBellClick = () => {
    setShow((prev) => !prev);
    if (!show && unreadNotifications.length > 0) {
      const unreadIds = unreadNotifications.map((n) => String(n._id));
      setLocallyReadIds((prev) => [...new Set([...prev, ...unreadIds])]);
      markAsRead(unreadIds);
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
                    const isUnread = !(
                      ((viewerReadId &&
                        (n.readBy || []).some(
                          (id) => String(id) === String(viewerReadId)
                        )) ||
                        locallyReadIds.includes(String(n._id)))
                    );
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
