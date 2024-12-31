import axios from "axios";
import { useState } from "react";

const Add = () => {
  // State to hold form data
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
    // Perform API call or data processing here

    const res = await axios.post(
      "http://localhost:5001/api/employee/addEmployee",
      formData
    );
  };

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Add Employee
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* row 1 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee Id</span>
              </label>
              <input
                type="text"
                name="emp_id"
                placeholder="Employee Id"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_id}
                onChange={handleChange}
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
                placeholder="Employee Name"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* row 2 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Department Name</span>
              </label>
              <input
                type="text"
                name="dep_name"
                placeholder="Department Name"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.dep_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Salary</span>
              </label>
              <input
                type="text"
                name="salary"
                placeholder="$"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* row 3 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <input
                type="text"
                name="role"
                placeholder="Role"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Designation</span>
              </label>
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* row 4 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Profile Image</span>
              </label>
              <input
                type="text"
                name="image"
                placeholder="Image"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="text"
                name="password"
                placeholder="*******"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* button submit */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-800 font-semibold text-white"
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
