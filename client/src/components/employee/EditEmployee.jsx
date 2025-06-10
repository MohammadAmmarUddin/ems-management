import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useDepartments from "../../hooks/FetchDepartment";
import useEmployeeById from "../../hooks/FetchEmployeeById";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

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
    profileImage: null,
    password: "",
    imageUrl: "", // For displaying existing image
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: departments, isLoading: isDeptLoading } =
    useDepartments(baseUrl);
  const { data: employeeById } = useEmployeeById(baseUrl, id);

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{10,15}$/.test(phone);
  const isStrongPassword = (password) =>
    password === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isValidDOB = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 65;
  };

  // Set form data when employee data is fetched
  useEffect(() => {
    if (employeeById) {
      setFormData({
        employeeId: employeeById.employeeId || "",
        emp_name: employeeById.emp_name || "",
        emp_email: employeeById.emp_email || "",
        department: employeeById.department.dep_name || "",
        emp_phone: employeeById.emp_phone || "",
        marital_status: employeeById.marital_status || "",
        dob: employeeById.dob
          ? new Date(employeeById.dob).toISOString().split("T")[0]
          : "",
        gender: employeeById.gender || "",
        salary: employeeById.salary || "",
        role: employeeById.role || "",
        designation: employeeById.designation || "",
        profileImage: null,
        password: "",
        imageUrl: employeeById.profileImage || "",
      });
    }
  }, [employeeById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
      imageUrl: URL.createObjectURL(e.target.files[0]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.employeeId || !formData.emp_name) {
      return Swal.fire(
        "Error",
        "Employee ID and Name are required.",
        "warning"
      );
    }

    if (!isValidEmail(formData.emp_email)) {
      return Swal.fire(
        "Invalid Email",
        "Enter a valid email address.",
        "warning"
      );
    }

    if (!isValidPhone(formData.emp_phone)) {
      return Swal.fire(
        "Invalid Phone",
        "Enter a valid phone number (10-15 digits).",
        "warning"
      );
    }

    if (formData.password && !isStrongPassword(formData.password)) {
      return Swal.fire(
        "Weak Password",
        "Password must be at least 8 characters with upper/lowercase and numbers.",
        "warning"
      );
    }

    if (formData.dob && !isValidDOB(formData.dob)) {
      return Swal.fire(
        "Invalid DOB",
        "Employee must be between 18 and 65 years old.",
        "warning"
      );
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();

      // Append all form data
      for (const key in formData) {
        if (key !== "imageUrl") {
          data.append(key, formData[key]);
        }
      }

      const res = await axios.put(
        `${baseUrl}/api/employee/updateEmployee/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Employee Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => navigate("/admin-dashboard/employee"), 1600);
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error(error);
      let message =
        "There was an issue updating the employee. Please try again.";

      if (
        error.response?.data?.code === 11000 ||
        error.message.includes("E11000") ||
        error?.message?.includes("duplicate key")
      ) {
        if (error.response?.data?.keyValue?.emp_phone) {
          message = "This phone number is already used by another employee.";
        } else if (error.response?.data?.keyValue?.emp_email) {
          message = "This email is already used by another employee.";
        }
      }

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDeptLoading || !employeeById) {
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
          Edit Employee
        </h2>
        <form onSubmit={handleSubmit} className="card-body" autoComplete="off">
          {/* row 1 */}
          <div className="flex gap-x-3">
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Department Name</span>
              </label>
              <select
                name="department"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.department._id}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments?.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.dep_name}
                  </option>
                ))}
              </select>
            </div>
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
                <option value="HR">HR</option>
              </select>
            </div>
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
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
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
                onChange={handleFileChange}
              />
              {(formData.imageUrl || formData.profileImage) && (
                <img
                  src={`${baseUrl}/uploads/${
                    formData.imageUrl || formData.profileImage
                  }`}
                  alt="Preview"
                  className="w-24 h-24 object-cover mt-2 rounded border"
                />
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                title="Min 8 characters, with uppercase, lowercase, and numbers"
                className="input input-bordered focus:outline-none hover:border-green-600"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter New Password (leave blank if unchanged)"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn font-semibold text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
