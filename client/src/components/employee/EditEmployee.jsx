import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router";
import Swal from "sweetalert2";

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

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/employee/getEmployee/${id}`
      );
      setEmployeeData(res.data.employee || {});
    } catch (error) {
      console.error("Error fetching employee data:", error);
      Swal.fire("Error", "Could not fetch employee data", "error");
    }
  };

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
      Swal.fire({
        title: "Success",
        text: "Employee updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the employee.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Edit Employee
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
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
