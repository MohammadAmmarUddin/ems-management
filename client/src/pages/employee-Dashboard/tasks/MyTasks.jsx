import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const MyTasks = () => {
  const { loading: authLoading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // local loading state
  console.log(tasks);
  const fetchEmployeeTasks = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/projects/getTasksForEmployee`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setTasks(res.data.result || []);
      } else {
        Swal.fire("Error!", "Failed to fetch tasks", "error");
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
      Swal.fire("Error!", "Failed to load your tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/projects/updateTaskStatus/${taskId}`, // ✅ fixed route
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task status updated",
          showConfirmButton: false,
          timer: 1200,
        });
        fetchEmployeeTasks();
      }
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire("Error!", "Failed to update status", "error");
    }
  };

  const columns = [
    { name: "S/N", selector: (row, i) => i + 1, width: "70px" },
    { name: "Title", selector: (row) => row?.taskTitle, sortable: true },
    {
      name: "Project",
      selector: (row) => row?.project?.title || "N/A",
      sortable: true,
    },
    { name: "Description", selector: (row) => row?.taskDescription || "N/A" },
    {
      name: "Deadline",
      selector: (row) =>
        row.deadline ? format(new Date(row.deadline), "PPP") : "Not set",
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          value={row.status || "pending"}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="px-2 py-1 rounded border text-xs"
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      ),
    },
  ];

  return (
    <div className="p-2 sm:p-3 md:p-5">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700">
          My Task List
        </h3>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {loading || authLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            No tasks assigned yet.
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task._id || index}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {task.taskTitle || "Untitled Task"}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {task.project?.title || "No Project"}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                {task.taskDescription || "No description"}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Deadline:</span>{" "}
                {task.deadline
                  ? format(new Date(task.deadline), "PPP")
                  : "Not set"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {task.status || "pending"}
                </div>
                <select
                  value={task.status || "pending"}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="px-2 py-1 rounded border text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white py-4 px-2 rounded shadow">
        <DataTable
          columns={columns}
          data={tasks}
          highlightOnHover
          pagination
          progressPending={loading || authLoading}
          persistTableHead
          noDataComponent={
            <div className="py-6 text-gray-500">No tasks assigned yet.</div>
          }
        />
      </div>
    </div>
  );
};

export default MyTasks;
