import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useDepartments from "../../../hooks/FetchDepartment";

const AddProject = () => {
    const [projectName, setProjectName] = useState("");
    const [selectedDepId, setSelectedDepId] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const baseUrl = import.meta.env.VITE_EMS_Base_URL;
    const navigate = useNavigate();

    const {
        data: departments = [],
        isLoading: loadingDeps,
        refetch,
    } = useDepartments(baseUrl);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !selectedDepId || !issueDate || !endDate) {
            return Swal.fire({
                icon: "warning",
                title: "All fields are required",
                text: "Please fill all the project details.",
            });
        }

        try {
            console.log("datas", projectName, selectedDepId, issueDate, endDate);
            const res = await axios.post(`${baseUrl}/api/projects/create`, {
                title: projectName,
                department: selectedDepId,
                startDate: issueDate,
                endDate,
            });

            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Project added successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });
                e.target.reset();
                setProjectName("");
                setSelectedDepId("");
                setIssueDate("");
                setEndDate("");
                refetch();
                navigate("/admin-dashboard/projects");
            }
        } catch (err) {
            console.error("Error adding project:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to add project",
                text: "Something went wrong!",
            });
        }
    };

    if (loadingDeps) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="card bg-base-100 max-w-md mx-auto shadow-2xl">
                <h2 className="text-center mt-8 font-bold text-3xl">Add Project</h2>

                <form onSubmit={handleSubmit} className="card-body space-y-4">
                    {/* Project Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Project Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Department Dropdown */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Department</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={selectedDepId}
                            onChange={(e) => setSelectedDepId(e.target.value)}
                            required
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map((dep) => (
                                <option key={dep._id} value={dep._id}>
                                    {dep.dep_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Issue Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Issue Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">End Deadline</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn bg-primary hover:bg-secondary text-white font-semibold"
                    >
                        Add Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProject;
