import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import useLeaves from "../../../hooks/FetchLeaves";

const AddLeave = () => {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const [leaveData, setLeaveData] = useState({
    userId: user._id,
  });
  const navigation = useNavigate();
  const { refetch } = useLeaves(baseUrl);

  const onchangehandler = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));
  };

  const { id: leaveId } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // leaveId should come from somewhere (like route or state), not from user._id
      const res = await axios.put(
        `${baseUrl}/api/leave/editLeave/${leaveId}`,
        leaveData
      );
      if (res.data.success) {
        Swal.fire({ icon: "success", title: "Leave updated!", timer: 1500 });
        refetch();
        navigation("/employee-dashboard/leave-history");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error updating leave!",
        text: error?.message,
      });
    }
  };

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto max-w-md shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Edit Leave
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* Leave Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Leave Type</span>
            </label>
            <select
              name="leaveType"
              className="hover:border-green-600 border-2 pl-4"
              value={leaveData.leaveType}
              onChange={onchangehandler}
            >
              <option value="" disabled>
                Select Leave Type
              </option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>

          {/* From and To Dates */}
          <div className="flex justify-between">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">From Date</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={leaveData.startDate}
                onChange={onchangehandler}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">To Date</span>
              </label>
              <input
                type="date"
                name="endDate"
                className="hover:border-green-600 border-2 py-2 pl-4"
                value={leaveData.endDate}
                onChange={onchangehandler}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Description</span>
            </label>
            <input
              type="text"
              name="reason"
              className="hover:border-green-600 border-2 py-2 pl-4"
              value={leaveData.reason}
              onChange={onchangehandler}
              placeholder="Enter a reason for your leave"
            />
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="bg-view text-white p-2 rounded-lg hover:bg-green-600"
            >
              update Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeave;
