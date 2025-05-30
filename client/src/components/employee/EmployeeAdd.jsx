import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Add = () => {
  // State to hold form data with empty default values
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    dep_name: "",
    salary: "",
    role: "",
    designation: "",
    image: "",
    password: "",
  });

  // State to hold all employees data (for dropdowns)
  const [employees, setEmployees] = useState([]);
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/employee/getEmployees`
      );
      setEmployees(res.data.emp); // Store all employees for dropdown
    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      const res = await axios.post(
        `${baseUrl}/api/employee/addEmployee`,
        formData
      );

      // Check the response success
      if (res.data.success === true || res.status === 201) {
        Swal.fire({
          title: "Employee Added Successfully!",
          text: "The employee has been added to the system.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        // Reset form data after submission
        setFormData({
          emp_id: "",
          emp_name: "",
          dep_name: "",
          salary: "",
          role: "",
          designation: "",
          image: "",
          password: "",
        });
      } else {
        throw new Error("Failed to add employee");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue adding the employee. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  // Fetch employee data when component mounts
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Add Employee
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* row 1 */}
          <div className="flex gap-x-3">
            {/* Employee ID Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee Id</span>
              </label>
              <input
                type="text"
                name="emp_id"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_id}
                onChange={handleChange}
                required
                placeholder="Enter Employee ID"
              />
            </div>
            {/* Employee Name Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee Name</span>
              </label>
              <input
                type="text"
                name="emp_name"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_name}
                onChange={handleChange}
                required
                placeholder="Enter Employee Name"
              />
            </div>
          </div>
          {/* row 2 */}
          <div className="flex gap-x-3">
            {/* Department Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Department Name</span>
              </label>
              <select
                name="dep_name"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.dep_name}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.dep_name}>
                    {employee.dep_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Salary Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Salary</span>
              </label>
              <input
                type="number"
                name="salary"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="Enter Salary"
              />
            </div>
          </div>
          {/* row 3 */}
          <div className="flex gap-x-3">
            {/* Role Dropdown */}
           {/* Role Dropdown */}
<div className="form-control w-full">
  <label className="label">
    <span className="label-text">Role</span>
  </label>
  <select
    name="role"
    className="input input-bordered focus:outline-none hover:border-green-600"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">Select Role</option>
    <option value="admin">Admin</option>
    <option value="employee">Employee</option>
    <option value="moderator">Moderator</option>
  </select>
</div>
            {/* Designation Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Designation</span>
              </label>
              <select
                name="designation"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.designation}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.designation}>
                    {employee.designation}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* row 4 */}
          <div className="flex gap-x-3">
            {/* Image Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Profile Image URL</span>
              </label>
              <input
                type="text"
                name="image"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Enter Image URL"
              />
            </div>
            {/* Password Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter Password"
                autoComplete="off"
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-primary hover:bg-secondary font-semibold text-white"
            >
              Add New Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
