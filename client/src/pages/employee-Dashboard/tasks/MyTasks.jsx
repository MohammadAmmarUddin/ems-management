import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const MyTasks = () => {
  const { loading: authLoading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // local loading state
  console.log(tasks);
  const fetchEmployeeTasks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/projects/getTasksForEmployee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    { name: "Project", selector: (row) => row?.project?.title || "N/A", sortable: true },
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
    <div className="py-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-700">My Task List</h3>
      </div>

      <div className="bg-white py-4 px-2 rounded shadow">
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
