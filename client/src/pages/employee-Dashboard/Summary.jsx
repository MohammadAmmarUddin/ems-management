import { useEffect, useState } from "react";
import { FaUser, FaTasks, FaUserTie, FaClock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";

const Summary = () => {
  const { user } = useAuth();
  const [taskCount, setTaskCount] = useState(0);
  const [managerName, setManagerName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (user?._id) {
      fetchSummaryData();
    }
  }, [user]);

  const fetchSummaryData = async () => {
    try {
      const taskRes = await axios.get(
        `${baseUrl}/api/projects/getTaskCountByEmployee`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTaskCount(taskRes.data?.count || 0);
    } catch (error) {
      console.error("Summary Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastLogin = user?.lastLogin || new Date().toISOString(); // optionally set this from backend

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
      {/* Welcome */}
      <Card
        icon={<FaUser />}
        title="Welcome Back"
        content={user?.name || "Employee"}
        bg="bg-gradient-to-r from-teal-500 to-teal-700"
        loading={loading}
      />

      {/* Tasks */}
      <Card
        icon={<FaTasks />}
        title="Working Tasks"
        content={taskCount}
        bg="bg-gradient-to-r from-blue-500 to-blue-700"
        loading={loading}
      />

      {/* Manager */}
      <Card
        icon={<FaUserTie />}
        title="My Manager"
        content={managerName || "N/A"}
        bg="bg-gradient-to-r from-purple-500 to-purple-700"
        loading={loading}
        badge="Active" // you can conditionally show availability here
      />

      {/* Last Login */}
      <Card
        icon={<FaClock />}
        title="Last Login"
        content={format(new Date(lastLogin), "PPP p")}
        bg="bg-gradient-to-r from-gray-600 to-gray-800"
        loading={loading}
      />
    </div>
  );
};

const Card = ({ icon, title, content, bg, loading, badge }) => (
  <div
    className={`flex items-center rounded-lg shadow-lg text-white p-4 ${bg}`}
  >
    <div className="text-3xl mr-4 animate-pulse">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium opacity-80">{title}</p>
      {loading ? (
        <div className="h-5 bg-white/30 rounded w-2/3 mt-1 animate-pulse"></div>
      ) : (
        <p className="text-xl font-bold">{content}</p>
      )}
      {badge && (
        <span className="text-xs bg-green-300 text-green-900 rounded px-2 py-0.5 mt-1 inline-block">
          {badge}
        </span>
      )}
    </div>
  </div>
);

export default Summary;
