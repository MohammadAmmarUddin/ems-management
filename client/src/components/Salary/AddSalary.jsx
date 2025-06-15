import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useEmployees from "../../hooks/FetchEmployee";
import { useNavigate } from "react-router-dom";
import useSalaries from "../../hooks/FetchSalary";
import { useAuth } from "../../context/AuthContext";

const AddSalary = () => {
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const { user, loading } = useAuth();
  const { data: employees = [], isLoading } = useEmployees({
    baseUrl,
    user,
    loading,
  });
  const { data: salaries = [], refetch } = useSalaries({
    baseUrl,
    user,
    loading,
  });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    basicSalary: "",
    allowance: "",
    deductions: "",
    netSalary: "",
    payDate: "",
  });

  // Auto-calculate net salary
  useEffect(() => {
    const basic = Number(formData.basicSalary) || 0;
    const allowance = Number(formData.allowance) || 0;
    const deductions = Number(formData.deductions) || 0;
    const net = basic + allowance - deductions;
    setFormData((prev) => ({ ...prev, netSalary: net }));
  }, [formData.basicSalary, formData.allowance, formData.deductions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting salary data:", formData);
      const res = await axios.post(`${baseUrl}/api/salary/addSalary`, formData);
      if (res.status === 201 || res.data.success) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Salary added successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin-dashboard/salary");
        refetch();
        setFormData({
          employeeId: "",
          basicSalary: "",
          allowance: "",
          deductions: "",
          netSalary: "",
          payDate: "",
        });
      } else {
        throw new Error("Failed to add salary");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit salary data", "error");
    }
  };
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <div className="card bg-base-100 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl">Add Salary</h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* Employee Dropdown */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Employee</span>
            </label>
            <select
              name="employeeId"
              className="input input-bordered"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.userId}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Salary */}
          <div className="form-control mb-4">
            <label className="label">Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              className="input input-bordered"
              placeholder="Enter Basic Salary"
            />
          </div>

          {/* Allowance and Deductions */}
          <div className="flex gap-x-4 mb-4">
            <div className="form-control w-full">
              <label className="label">Allowance</label>
              <input
                type="number"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter Allowance"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter Deductions"
              />
            </div>
          </div>

          {/* Net Salary */}
          <div className="form-control mb-4">
            <label className="label">Net Salary</label>
            <input
              type="number"
              name="netSalary"
              value={formData.netSalary}
              readOnly
              className="input input-bordered bg-gray-100"
            />
          </div>

          {/* Pay Date */}
          <input
            type="date"
            name="payDate"
            value={
              formData.payDate
                ? new Date(Number(formData.payDate)).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const timestamp = new Date(e.target.value).getTime();
              setFormData((prev) => ({ ...prev, payDate: timestamp }));
            }}
            required
            className="input input-bordered"
          />

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-primary text-white font-semibold"
            >
              Submit Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;
