import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router";

const EditEmployee = () => {
  const { id } = useParams();

  const [employeeData, setEmployeeData] = useState({
    emp_id: "",
    emp_name: "",
    dep_name: "",
    salary: "",
    role: "",
    designation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch employee data
  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/employee/getEmployee/${id}`
      );
      setEmployeeData(res.data.employee || {});
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5001/api/employee/edit/${id}`,
        employeeData
      );
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("An error occurred while updating the employee.");
    }
  };

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Edit Employee
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* ID */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Employee ID</span>
            </label>
            <input
              type="text"
              name="emp_id"
              value={employeeData.emp_id}
              onChange={handleChange}
              placeholder="Enter Employee ID"
              className="input input-bordered focus:outline-none hover:border-green-600"
              required
            />
          </div>
          {/* Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Employee Name</span>
            </label>
            <input
              type="text"
              name="emp_name"
              value={employeeData.emp_name}
              onChange={handleChange}
              placeholder="Enter Employee Name"
              className="input input-bordered focus:outline-none hover:border-green-600"
            />
          </div>
          {/* Department */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <input
              type="text"
              name="dep_name"
              value={employeeData.dep_name}
              onChange={handleChange}
              placeholder="Enter Department Name"
              className="input input-bordered focus:outline-none hover:border-green-600"
            />
          </div>
          {/* Salary */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Salary</span>
            </label>
            <input
              type="number"
              name="salary"
              value={employeeData.salary}
              onChange={handleChange}
              placeholder="Enter Salary"
              className="input input-bordered focus:outline-none hover:border-green-600"
            />
          </div>
          {/* Role */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <input
              type="text"
              name="role"
              value={employeeData.role}
              onChange={handleChange}
              placeholder="Enter Role"
              className="input input-bordered focus:outline-none hover:border-green-600"
            />
          </div>
          {/* Designation */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Designation</span>
            </label>
            <input
              type="text"
              name="designation"
              value={employeeData.designation}
              onChange={handleChange}
              placeholder="Enter Designation"
              className="input input-bordered focus:outline-none hover:border-green-600"
            />
          </div>
          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-primary hover:bg-secondary font-semibold text-white"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
