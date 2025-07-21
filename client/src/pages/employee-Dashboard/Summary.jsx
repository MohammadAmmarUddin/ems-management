import { useEffect, useState } from "react";
import { FaUser, FaTasks, FaCalendarCheck, FaUserTie } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Summary = () => {
  const { user } = useAuth();
  const [taskCount, setTaskCount] = useState(0);
  const [managerName, setManagerName] = useState("Loading...");

  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (user?._id) {
      fetchSummaryData();
    }
  }, [user]);

  const fetchSummaryData = async () => {
    try {
      const [taskRes] = await Promise.all([
        axios.get(`${baseUrl}/api/projects/getTaskCountByEmployee`, {
          headers: { Authorization: `Bearer ${token}` },
        }),

      ]);
      console.log(taskRes);
      setTaskCount(taskRes.data?.count || 0);
    } catch (error) {
      console.error("Summary Fetch Error:", error);
      setManagerName("N/A");
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
          <p>{user?.name || "User"}</p>
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
