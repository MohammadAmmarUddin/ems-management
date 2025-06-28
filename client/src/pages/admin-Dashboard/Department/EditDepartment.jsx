import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import useManagers from "../../../hooks/FetchManagers";

const EditDepartment = () => {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const navigate = useNavigate();

  const [depInput, setDepInput] = useState("");
  const [depDesc, setDepDesc] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [loadingDep, setLoadingDep] = useState(true);
  const [depError, setDepError] = useState("");

  const {
    data: managers = [],
    isLoading: loadingManagers,
    isError: managerError,
  } = useManagers({ baseUrl });

  // Fetch department by ID
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/department/getSingleDep/${id}`);
        const department = res.data.result;
        setDepInput(department.dep_name);
        setDepDesc(department.dep_desc || "");
        setSelectedManagerId(department.manager?._id || "");
        setLoadingDep(false);
      } catch (err) {
        console.error("Department fetch error:", err);
        setDepError("Failed to load department data.");
        setLoadingDep(false);
      }
    };

    fetchDepartment();
  }, [baseUrl, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!depInput || !selectedManagerId) {
      return Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please enter department name and select a manager.",
      });
    }

    try {
      const res = await axios.put(`${baseUrl}/api/department/updateDep/${id}`, {
        dep_name: depInput,
        dep_desc: depDesc,
        manager: selectedManagerId,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Department updated",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/admin-dashboard/departments");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to update department",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  // Loading state
  if (loadingDep || loadingManagers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Error state
  if (depError || managerError) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        {depError || "Failed to load managers."}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="card bg-base-100 max-w-md mx-auto shadow-2xl">
        <h2 className="text-center mt-8 font-bold text-3xl">Edit Department</h2>

        <form onSubmit={handleSubmit} className="card-body space-y-4">
          {/* Department Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Department name"
              value={depInput}
              onChange={(e) => setDepInput(e.target.value)}
              required
            />
          </div>

          {/* Manager Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Assign Manager</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              required
            >
              <option value="">-- Select a Manager --</option>
              {managers.length > 0 ? (
                managers.map((mgr) => (
                  <option key={mgr._id} value={mgr._id}>
                    {mgr.emp_name} ({mgr.emp_email})
                  </option>
                ))
              ) : (
                <option disabled>No managers available</option>
              )}
            </select>
          </div>

          {/* Department Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="dep_desc"
              rows={4}
              className="textarea textarea-bordered"
              placeholder="Department Description"
              value={depDesc}
              onChange={(e) => setDepDesc(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn bg-primary hover:bg-secondary text-white font-semibold"
          >
            Update Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
