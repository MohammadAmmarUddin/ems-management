import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { formatPhoneNumber } from "../../../utils/phoneNumberMod";
import useDepartments from "../../../hooks/FetchDepartment";
import useEmployeeById from "../../../hooks/FetchEmployeeById";

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
    imageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ fetch departments with pagination defaults
  const {
    data: departmentsData,
    isLoading: isDeptLoading,
    error: deptError,
  } = useDepartments(baseUrl, "", 1, 1000); // fetch all departments

  const {
    data: employeeById,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useEmployeeById(baseUrl, id);

  // Validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) =>
    password === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isValidDOB = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 65;
  };

  // ✅ Populate form safely
  useEffect(() => {
    if (employeeById) {
      setFormData((prev) => ({
        ...prev,
        employeeId: employeeById.employeeId || "",
        emp_name: employeeById.emp_name || "",
        emp_email: employeeById.emp_email || "",
        department: employeeById.department?._id || "",
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
      }));
    }
  }, [employeeById]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "emp_phone") {
      setFormData((prev) => ({ ...prev, emp_phone: formatPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0]),
      }));
    }
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

      for (const key in formData) {
        if (key === "imageUrl") continue;
        if (formData[key] !== null && formData[key] !== "") {
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

        const storedUser = JSON.parse(
          localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
        );
        const role = storedUser?.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "manager") navigate("/manager-dashboard");
        else if (role === "employee") navigate("/employee-dashboard");
        else navigate("/");
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

  // ✅ Loading & error states
  if (isDeptLoading || isEmployeeLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (deptError || employeeError) {
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to load required data. Please try again later.
      </div>
    );
  }

  // ✅ Extract department list safely
  const departments = departmentsData?.result || [];

  return (
    <div className="">
      <div className="card bg-white w-full mx-auto shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit} className="card-body" autoComplete="off">
          {/* Row 1 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">Employee Id</label>
              <input
                type="text"
                name="employeeId"
                className="input input-bordered"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Employee Name</label>
              <input
                type="text"
                name="emp_name"
                className="input input-bordered"
                value={formData.emp_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">Department</label>
              <select
                name="department"
                className="select select-bordered"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">Salary</label>
              <input
                type="number"
                name="salary"
                className="input input-bordered"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">Role</label>
              <select
                name="role"
                className="select select-bordered"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">Designation</label>
              <input
                type="text"
                name="designation"
                className="input input-bordered"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex gap-x-3">
            <div className="form-control w-full">
              <label className="label">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
              {(formData.imageUrl || formData.profileImage) && (
                <img
                  src={
                    formData.profileImage
                      ? formData.imageUrl
                      : `${baseUrl}/uploads/${formData.imageUrl}`
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover mt-2 rounded border"
                />
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (leave blank if unchanged)"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="form-control mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn text-white ${
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
