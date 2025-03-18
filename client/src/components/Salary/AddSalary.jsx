import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const AddSalary = () => {
  const [departments, setDepartment] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { user, loading } = useAuth();
  const [salaryData, setsalaryData] = useState({
    userId: user._id,
  });

  const fetchDepartment = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/department/getAllDep"
      );
      setDepartment(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/employee/getEmployees"
      );
      setEmployees(res.data.emp);
      console.log(res.data.emp[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    if (user && !loading) {
      fetchEmployees();
    }
  }, []);

  const onchangehandler = (e) => {
    const { name, value } = e.target;
    setsalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(salaryData);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/leave/AddSalary",
        salaryData
      );

      console.log("res of req leae", res);
      if (res.data.success) {
        Swal.fire({
          position: "middle",
          icon: "success",
          title: "Your leave request has been submitted",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error("Failed to submit leave");
      }
    } catch (error) {
      Swal.fire({
        position: "middle",
        icon: "error",
        title: "Error submitting leave request",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  console.log(departments);

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto max-w-lg shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Add Salary
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* Salary Type */}
          <div className="flex justify-between">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Department</span>
              </label>
              <select
                name="leaveType"
                className="hover:border-green-600 p-3 border-2 pl-4"
                value={salaryData.dep}
                onChange={onchangehandler}
              >
                <option value="" disabled selected>
                  Select Department
                </option>
                {departments.map((dep) => (
                  <>
                    <option
                      value={`${dep.dep_name}`}
                    >{`${dep.dep_name}`}</option>
                  </>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Employee</span>
              </label>
              <select
                name="leaveType"
                className="hover:border-green-600 p-3 border-2 pl-4"
                value={salaryData.employee}
                onChange={onchangehandler}
              >
                <option value="" disabled selected>
                  Select Employee
                </option>{" "}
                {employees.map((emp) => (
                  <>
                    <option
                      value={`${emp.emp_name}`}
                    >{`${emp.emp_name}`}</option>
                  </>
                ))}
              </select>
            </div>
          </div>

          {/* From and To Dates */}
          <div className="flex justify-between">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Basic Salary</span>
              </label>
              <input
                type="number"
                name="basicSalary"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={salaryData.basicSalary}
                onChange={onchangehandler}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Allowance</span>
              </label>
              <input
                type="number"
                name="allowancee"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={salaryData.allowance}
                onChange={onchangehandler}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex justify-between ">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Deductions</span>
              </label>
              <input
                type="number"
                name="deduction"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={salaryData.deductions}
                onChange={onchangehandler}
                placeholder="Enter Deductions"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Pay Date</span>
              </label>
              <input
                type="Date"
                name="paydate"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={salaryData.payDate}
                onChange={onchangehandler}
                placeholder="Enter pay date"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-800 font-semibold text-white"
            >
              Submit Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;
