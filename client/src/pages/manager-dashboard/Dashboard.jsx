import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaProjectDiagram,
    FaUsers,
    FaTasks,
    FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SummaryCard from "../admin-Dashboard/Dashboard/SummaryCard";

const Dashboard = () => {
    const { user, loading } = useAuth();
    const baseUrl = import.meta.env.VITE_EMS_Base_URL;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const [projects, setProjects] = useState({
        running: [],
        projectscount: 0
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (!loading && user) {
            fetchRunningProjects();
            fetchActiveEmployees();
        }
    }, [loading, user]);

    const fetchRunningProjects = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/projects/runningProjectsByManager`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setProjects({
                    running: res.data.projects.running || [],
                    projectscount: res.data.projects.projectsCount || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    const fetchActiveEmployees = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/employee/manager/active-employees`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                const active = res.data.result.filter((emp) => emp.user.isActive);
                setEmployees(active);
            }
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 font-sourceSans bg-gray-50 min-h-screen">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 tracking-wide">
                Manager Dashboard Overview
            </h3>

            {/* 🔹 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={<FaProjectDiagram className="text-white text-3xl" />}
                    text="Running Projects"
                    number={projects.projectscount}
                    color="bg-blue-600"
                />
                <SummaryCard
                    icon={<FaUsers className="text-white text-3xl" />}
                    text="Active Employees"
                    number={employees.length}
                    color="bg-green-500"
                />
                <SummaryCard
                    icon={<FaTasks className="text-white text-3xl" />}
                    text="Total Tasks"
                    number={projects.running.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)}
                    color="bg-indigo-500"
                />
                <SummaryCard
                    icon={<FaCheckCircle className="text-white text-3xl" />}
                    text="Department"
                    number={user?.department?.dep_name || "N/A"}
                    color="bg-yellow-500"
                />
            </div>

            {/* 🔹 Project List */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Running Projects</h3>
                {projects.running.length > 0 ? (
                    <ul className="space-y-3">
                        {projects.running.map((proj) => (
                            <li
                                key={proj._id}
                                className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{proj.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Start: {new Date(proj.startDate).toLocaleDateString()} | End:{" "}
                                        {new Date(proj.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="text-green-600 text-sm font-semibold">
                                    {proj.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No running projects found.</p>
                )}
            </div>

            {/* 🔹 Active Employees */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Active Employees in Department
                </h3>
                {employees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="text-left py-2 px-4 border-b">Name</th>
                                    <th className="text-left py-2 px-4 border-b">Email</th>
                                    <th className="text-left py-2 px-4 border-b">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b flex items-center gap-2">
                                            <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                            {emp.emp_name}
                                        </td>
                                        <td className="py-2 px-4 border-b">{emp.emp_email}</td>
                                        <td className="py-2 px-4 border-b">{emp.emp_phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No active employees found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
