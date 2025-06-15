import { useAuth } from "../../context/AuthContext";
import useEmployeeById from "../../hooks/FetchEmployeeById";

const Profile = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const id = user?.id || user?._id;
  const { data: singleUser, isLoading: EmployeeIdLoading } = useEmployeeById(
    baseUrl,
    id
  );

  const sliceDob = singleUser?.dob
    ? new Date(singleUser?.dob).toISOString().split("T")[0]
    : "Not Available";

  if (loading || EmployeeIdLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-10 mt-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 mb-10">
        {/* Profile Picture */}
        <img
          src={`http://localhost:5001/uploads/${singleUser?.profileImage}`}
          alt="Profile"
          className="w-40 h-40 rounded-full shadow-2xl transform transition-transform hover:scale-105"
        />

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-semibold mb-2 uppercase Font-bold ">
            {singleUser?.emp_name || "Unknown User"}
          </h1>
          <p className="text-gray-500 font-semibold mb-4">
            {singleUser?.role?.toUpperCase()}
          </p>

          <div className="flex gap-6">
            <div>
              <p>
                <span className="font-semibold mr-2 text-gray-600">Email:</span>
                {singleUser?.emp_email || "Not Available"}
              </p>
              <p>
                <span className="font-semibold mr-2 text-gray-600">Phone:</span>
                {singleUser?.emp_phone || "Not Available"}
              </p>
              <p>
                <span className="font-semibold mr-2 text-gray-600">
                  Gender:
                </span>
                {singleUser?.gender || "Not Available"}
              </p>
            </div>

            <div>
              <p>
                <span className="font-semibold mr-2 text-gray-600">
                  Department:
                </span>
                {singleUser?.department?.dep_name || "Not Available"}
              </p>
              <p>
                <span className="font-semibold mr-2 text-gray-600">
                  Salary:
                </span>
                {singleUser?.salary || "Not Available"}
              </p>
              <p>
                <span className="font-semibold mr-2 text-gray-600">
                  Date of Birth:
                </span>
                {sliceDob}
              </p>
            </div>
          </div>

          {singleUser?.role === "employee" && (
            <p className="mt-4">
              <span className="font-semibold mr-2 text-gray-600">
                Employee ID:
              </span>
              {singleUser?.employeeId || "Not Available"}
            </p>
          )}
        </div>
      </div>

      {/* Meta Information Section */}
      {singleUser?.meta && (
        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Last Login Information
          </h2>
          <div className="flex gap-6">
            <div>
              <p>
                <span className="font-semibold mr-2 text-gray-600">IP:</span>
                {user?.meta?.lastLoginIp || "Not Available"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold mr-2 text-gray-600">
                  Device:
                </span>
                {user?.meta?.lastLoginDevice || "Not Available"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
