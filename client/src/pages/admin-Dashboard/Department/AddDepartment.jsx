import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useDepartments from "../../../hooks/FetchDepartment";
import useManagers from "../../../hooks/FetchManagers";

const AddDepartment = () => {
  const [depInput, setDepInput] = useState("");
  const [filteredDeps, setFilteredDeps] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const navigate = useNavigate();

  const {
    data: departments = [],
    isLoading: loadingDeps,
    refetch,
  } = useDepartments(baseUrl);

  const {
    data: managers = [],
    isLoading: loadingManagers,
  } = useManagers(baseUrl);
  // Handle department input changes
  const handleDepInputChange = (e) => {
    const value = e.target.value;
    setDepInput(value);
    setDropdownVisible(value.length > 0);

    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDeps(filtered);
  };

  // Set selected department name from dropdown
  const handleDepSelect = (depName) => {
    setDepInput(depName);
    setDropdownVisible(false);
  };

  // Submit department form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dep_desc = e.target.dep_desc.value;

    if (!depInput || !selectedManagerId) {
      return Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please enter department name and select a manager.",
      });
    }

    try {
      const res = await axios.post(`${baseUrl}/api/department/add`, {
        dep_name: depInput,
        dep_desc,
        manager: selectedManagerId,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Department added",
          timer: 1500,
          showConfirmButton: false,
        });
        e.target.reset();
        setDepInput("");
        setSelectedManagerId("");
        refetch();
        navigate("/admin-dashboard/departments");
      }
    } catch (err) {
      console.error("Error adding department:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to add department",
        text: "Something went wrong!",
      });
    }
  };

  if (loadingDeps || loadingManagers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="card bg-base-100 max-w-md mx-auto shadow-2xl">
        <h2 className="text-center mt-8 font-bold text-3xl">Add Department</h2>

        <form onSubmit={handleSubmit} className="card-body space-y-4">
          {/* Department Name Input with Suggestions */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Start typing..."
              value={depInput}
              onChange={handleDepInputChange}
              required
            />
            {dropdownVisible && filteredDeps.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredDeps.map((dep) => (
                  <div
                    key={dep._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDepSelect(dep.dep_name)}
                  >
                    {dep.dep_name}
                  </div>
                ))}
              </div>
            )}
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
              {managers.map((mgr) => (
                <option key={mgr._id} value={mgr._id}>
                  {mgr.emp_name}
                </option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              name="dep_desc"
              rows={4}
              className="textarea textarea-bordered"
              placeholder="Department Description"
            />
          </div>

          <button
            type="submit"
            className="btn bg-primary hover:bg-secondary text-white font-semibold"
          >
            Add Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
