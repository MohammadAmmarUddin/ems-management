import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import useProjectsByDepartment from "../../hooks/FetchProjectsByDepartment";

const ProjectList = () => {
    const { user, loading } = useAuth();
    const baseUrl = import.meta.env.VITE_EMS_Base_URL;

    const { data: projects, refetch } = useProjectsByDepartment(baseUrl);

    const [selectedProject, setSelectedProject] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [taskForm, setTaskForm] = useState({
        project: "",
        employee: "",
        taskTitle: "",
        taskDescription: "",
        deadline: "",
    });

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const fetchTasks = async (projectId) => {
        try {
            const res = await axios.get(`${baseUrl}/api/projects/getAllTasksByDepartment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("tasks", res.data);
            if (res.data.success) {
                const projectTasks = res.data.result.filter(task => task.project === projectId);
                setTasks(projectTasks);
                setShowTaskModal(true);
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to fetch tasks", "error");
        }
    };

    const fetchEmployeesByDepartment = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/employee/getEmployeesByDepartment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setEmployees(res.data.result);
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to fetch employees", "error");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const { project, employee, taskTitle, taskDescription, deadline } = taskForm;
            const res = await axios.post(
                `${baseUrl}/api/projects/${selectedProject}/assign-task`,
                { project, employee, taskTitle, taskDescription, deadline },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Task created successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowAddTaskModal(false);
                setTaskForm({ employee: "", taskTitle: "", taskDescription: "", deadline: "" });
                fetchTasks(selectedProject);
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to create task", "error");
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const res = await axios.delete(`${baseUrl}/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                Swal.fire("Deleted!", "Project deleted successfully", "success");
                refetch();
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to delete project", "error");
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            const res = await axios.put(
                `${baseUrl}/api/projects/${projectId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your status has been changed",
                    showConfirmButton: false,
                    timer: 1500
                });
                refetch();
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to update status", "error");
        }
    };

    const buttonStyle = {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        padding: "4px 8px",
        marginRight: "6px",
        cursor: "pointer",
        borderRadius: "4px",
    };

    const columns = [
        { name: "S/N", selector: (row, i) => i + 1, width: "70px" },
        { name: "Project Name", selector: (row) => row.title, sortable: true },
        { name: "Department", selector: (row) => row.department?.dep_name, sortable: true },
        { name: "Issue Date", selector: (row) => new Date(row.startDate).toLocaleDateString() },
        { name: "Expected Date", selector: (row) => new Date(row.endDate).toLocaleDateString() },
        {
            name: "Status",
            cell: (row) => (
                <select
                    value={row.status || "Pending"}
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
                    className="px-2 py-1 rounded border text-xs"
                >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button
                        onClick={() => {
                            setSelectedProject(row._id);
                            setTaskForm({ ...taskForm, project: row._id });
                            fetchEmployeesByDepartment();
                            setShowAddTaskModal(true);
                        }}
                        style={{ ...buttonStyle, backgroundColor: "#28a745" }}
                    >
                        Add Task
                    </button>
                    <button
                        onClick={() => {
                            setSelectedProject(row._id);
                            fetchTasks(row._id);
                        }}
                        style={{ ...buttonStyle, backgroundColor: "#17a2b8" }}
                    >
                        View Tasks
                    </button>
                </>
            ),
        },
    ];

    if (user && loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-700">My Department Projects</h3>
            </div>

            <div className="bg-white py-4 rounded shadow">
                <DataTable highlightOnHover pagination progressPending={loading} columns={columns} data={projects || []} />
            </div>

            {/* View Tasks Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded w-96">
                        <h2 className="text-lg font-bold mb-4">Tasks for Project</h2>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task._id} className="border p-2 mb-2 rounded">
                                    <p className="font-semibold">Employee: {task.employee.emp_name}</p>
                                    <p className="font-semibold">Title: {task.taskTitle}</p>
                                    <p>Description: {task.taskDescription || "N/A"}</p>
                                    <p>Status: {task.status}</p>
                                </div>
                            ))
                        ) : (
                            <p>No tasks found.</p>
                        )}
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded w-96">
                        <h2 className="text-lg font-bold mb-4">Assign Task</h2>
                        <form onSubmit={handleAddTask} className="space-y-3">
                            <select
                                value={taskForm.employee}
                                onChange={(e) => setTaskForm({ ...taskForm, employee: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.emp_name} ({emp.emp_email})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={taskForm.taskTitle}
                                onChange={(e) => setTaskForm({ ...taskForm, taskTitle: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                                required
                            />
                            <textarea
                                placeholder="Task Description"
                                value={taskForm.taskDescription}
                                onChange={(e) => setTaskForm({ ...taskForm, taskDescription: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <input
                                type="date"
                                value={taskForm.deadline}
                                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowAddTaskModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
