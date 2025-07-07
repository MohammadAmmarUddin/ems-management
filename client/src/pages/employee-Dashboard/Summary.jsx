import { useEffect, useState } from "react";
import { FaUser, FaTasks, FaCalendarCheck, FaUserTie } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Summary = () => {
  const { user } = useAuth();
  const [taskCount, setTaskCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [managerName, setManagerName] = useState("");

  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (user?._id) {
      fetchTaskCount();
      fetchAttendanceCount();
      fetchManagerName();
    }
  }, [user]);

  const fetchTaskCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/tasks/employee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchAttendanceCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/attendance/employee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const fetchManagerName = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/employee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagerName(res.data.employee.manager?.mang_name || "N/A");
    } catch (err) {
      console.error("Failed to fetch manager:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Welcome Card */}
      <div className="flex items-center rounded bg-white shadow">
        <div className="flex items-center text-3xl bg-teal-600 text-white justify-center px-4 h-full">
          <FaUser />
        </div>
        <div className="pl-4 py-2">
          <p className="font-bold text-xl">Welcome Back</p>
          <p>{user?.name}</p>
        </div>
      </div>

      {/* Task Card */}
      <div className="flex items-center rounded bg-white shadow">
        <div className="flex items-center text-3xl bg-blue-600 text-white justify-center px-4 h-full">
          <FaTasks />
        </div>
        <div className="pl-4 py-2">
          <p className="font-bold text-xl">{taskCount}</p>
          <p>Working Tasks</p>
        </div>
      </div>

      {/* Attendance Card */}
      <div className="flex items-center rounded bg-white shadow">
        <div className="flex items-center text-3xl bg-green-600 text-white justify-center px-4 h-full">
          <FaCalendarCheck />
        </div>
        <div className="pl-4 py-2">
          <p className="font-bold text-xl">{attendanceCount}</p>
          <p>Attendances</p>
        </div>
      </div>

      {/* Manager Card */}
      <div className="flex items-center rounded bg-white shadow">
        <div className="flex items-center text-3xl bg-purple-600 text-white justify-center px-4 h-full">
          <FaUserTie />
        </div>
        <div className="pl-4 py-2">
          <p className="font-bold text-xl">{managerName}</p>
          <p>My Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
