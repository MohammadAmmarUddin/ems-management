import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import useDepartments from "../../hooks/FetchDepartment";
import { useNavigate } from "react-router-dom";
const Add = () => {
  // State to hold form data with empty default values
  const [formData, setFormData] = useState({
    employeeId: "",
    emp_name: "",
    department: "",
    emp_email: "",
    emp_phone: "",
    marital_status: "",
    dob: "",
    gender: "",
    salary: "",
    role: "",
    designation: "",
    profileImage: "",
    password: "",
  });

  // State to hold all employees data (for dropdowns)
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  // const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  // const cloud_preset_key = import.meta.env.VITE_CLOUDINARY_PRESET_KEY;

  const { data: departments, refetch, isLoading } = useDepartments(baseUrl);

  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // const handleFileChange = (e) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     profileImage: e.target.files[0],
  //   }));
  // };
  console.log("image", formData.profileImage);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    if (!formData.emp_phone || formData.emp_phone.trim() === "") {
      Swal.fire({
        title: "Phone number is required!",
        text: "Please enter a valid phone number.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post(
        `${baseUrl}/api/employee/addEmployee`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success === true || res.status === 201) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Employee Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset the form
        setFormData({
          employeeId: "",
          emp_name: "",
          department: "",
          emp_email: "",
          emp_phone: "",
          marital_status: "",
          gender: "",
          dob: "",
          salary: "",
          role: "",
          designation: "",
          profileImage: "",
          password: "",
        });

        refetch();
        navigate("/admin-dashboard/employee");
      } else {
        throw new Error("Failed to add employee");
      }
    } catch (error) {
      console.error(error);

      let message = "There was an issue adding the employee. Please try again.";
      if (
        error.response?.data?.code === 11000 ||
        error.message.includes("E11000") ||
        error?.message?.includes("duplicate key")
      ) {
        message = "This phone number is already used by another employee.";
      }

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
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
                name="employeeId"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.employeeId}
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
          {/* row 1 extended */}
          <div className="flex gap-x-3">
            {/* Employee ID Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee Email</span>
              </label>
              <input
                type="email"
                name="emp_email"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_email}
                onChange={handleChange}
                required
                placeholder="Enter Employee Email"
              />
            </div>
            {/* Employee Name Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee Phone</span>
              </label>
              <input
                type="text"
                name="emp_phone"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.emp_phone}
                onChange={handleChange}
                required
                placeholder="Enter Employee Phone Number"
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
                name="department"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments?.length > 0 &&
                  departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.dep_name}
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
                <option value="Software Engineer">Software Engineer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="System Administrator">
                  System Administrator
                </option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Network Engineer">Network Engineer</option>
                <option value="Database Administrator">
                  Database Administrator
                </option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Front-end Developer">Front-end Developer</option>
                <option value="Back-end Developer">Back-end Developer</option>
                <option value="Full-stack Developer">
                  Full-stack Developer
                </option>
                <option value="Technical Support">Technical Support</option>
                <option value="Content Writer">Content Writer</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Specialist">
                  Marketing Specialist
                </option>
                <option value="Customer Service Representative">
                  Customer Service Representative
                </option>
                <option value="Research Scientist">Research Scientist</option>
              </select>
            </div>
          </div>
          {/* row 6 */}
          <div className="flex gap-x-3">
            {/* Role Dropdown */}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                name="gender"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Designation Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Marital Status</span>
              </label>
              <select
                name="marital_status"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.marital_status}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                <option value="single">single</option>
                <option value="married">married</option>
                <option value="divorced">divorced</option>
                <option value="widowed">widowed</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dob"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.dob}
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
                type="file"
                name="profileImage"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: e.target.files[0],
                  }))
                }
                required
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
