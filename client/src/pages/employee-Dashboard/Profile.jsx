import { useAuth } from "../../context/AuthContext";
import useEmployeeById from "../../hooks/FetchEmployeeById";
import { Link, useLocation } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const location = useLocation();

  const rolePrefix = location.pathname.split("/")[1]; // e.g., "manager-dashboard"
  const role = rolePrefix?.split("-")[0]; // e.g., "manager"

  const userId = user?.id || user?._id;
  const { data: userData, isLoading } = useEmployeeById(baseUrl, userId);

  const formattedDob = userData?.dob
    ? new Date(userData.dob).toLocaleDateString()
    : "Not Available";

  const formattedJoinDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString()
    : "Not Available";

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <img
            src={`${baseUrl}/uploads/${userData?.profileImage}`}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-lg object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 uppercase">{userData?.emp_name}</h1>
            <p className="text-lg text-blue-600 font-medium mt-1">
              {userData?.department?.dep_name || "No Department"} Department
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Role: <span className="font-semibold capitalize">{userData?.role}</span>
            </p>
            <p className="text-sm text-gray-600">
              Designation: <span className="font-semibold">{userData?.designation || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileField label="Employee ID" value={userData?.employeeId} />
          <ProfileField label="Email" value={userData?.emp_email} />
          <ProfileField label="Phone" value={userData?.emp_phone} />
          <ProfileField label="Date of Birth" value={formattedDob} />
          <ProfileField label="Joined On" value={formattedJoinDate} />
          <ProfileField label="Gender" value={userData?.gender} />
          <ProfileField label="Marital Status" value={userData?.marital_status} />
          <ProfileField label="Salary" value={`৳ ${userData?.salary || "0"}`} />
        </div>

        {/* Edit Profile Button */}
        <div className="mt-10 text-center">
          <Link
            to={`/${role}-dashboard/edit-profile/${userData?.userId}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Edit Profile
          </Link>
        </div>

        {/* Meta Info (Last Login IP, Device) */}
        {userData?.meta && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-md border max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Last Login Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Last Login IP" value={userData.meta.lastLoginIp} />
              <ProfileField label="Last Login Device" value={userData.meta.lastLoginDevice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="bg-white shadow-sm rounded-md p-5 border">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || "Not Available"}</p>
  </div>
);

export default Profile;
