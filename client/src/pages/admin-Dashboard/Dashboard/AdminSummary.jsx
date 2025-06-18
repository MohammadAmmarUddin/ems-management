import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import SummaryCard from "./SummaryCard";
import {
  useDepartmentCount,
  useDepartmentDistribution,
  useEmployeesCount,
  useLeaveStats,
  useMonthlySalaryData,
  useSalaryAggregation,
} from "../../../hooks/UseAdminDashboard";
import useActiveUsers from "../../../hooks/FetchActiveUsers";

const COLORS = [
  "#4F46E5", "#F59E0B", "#EF4444", "#10B981", "#3B82F6",
  "#A855F7", "#EC4899", "#22D3EE", "#84CC16", "#F97316",
];

const AdminSummary = () => {
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  const { data: countDep, isLoading: isDepLoading } = useDepartmentCount(baseUrl);
  const { data: totalSalary, isLoading: isSalaryLoading } = useSalaryAggregation(baseUrl);
  const { data: usersCount, isLoading: isUserCountLoading } = useEmployeesCount(baseUrl);
  const { data: departmentData = [], isLoading: isDeptChartLoading } = useDepartmentDistribution(baseUrl);
  const { data: leaveStats, isLoading: isLeaveStatsLoading } = useLeaveStats(baseUrl);
  const { data: monthlySalaryData, isLoading: isMonthlySalaryLoading } = useMonthlySalaryData(baseUrl);
  const { data: activeUsers = [], isLoading: isActiveUsersLoading } = useActiveUsers(baseUrl);

  const isLoading = [
    isDepLoading,
    isSalaryLoading,
    isUserCountLoading,
    isDeptChartLoading,
    isLeaveStatsLoading,
    isMonthlySalaryLoading,
    isActiveUsersLoading,
  ].some(Boolean);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sourceSans bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 tracking-wide">
        Admin Dashboard Overview
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<FaUsers className="text-white text-3xl" />}
          text="Total Users"
          number={usersCount}
          color="bg-[#4F46E5]"
        />
        <SummaryCard
          icon={<FaBuilding className="text-white text-3xl" />}
          text="Total Departments"
          number={countDep}
          color="bg-[#F59E0B]"
        />
        <SummaryCard
          icon={<MdOutlineAttachMoney className="text-white text-3xl" />}
          text="Total Salary Amount"
          number={totalSalary[0]?.totalAmount}
          color="bg-[#EF4444]"
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-white text-3xl" />}
          text="Total Salary Count"
          number={totalSalary[0]?.totalCount}
          color="bg-[#10B981]"
        />
      </div>

      {/* Active Users Table */}
      <div className="bg-white rounded-xl shadow-md mt-16 p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Active Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left py-2 px-4 border-b">Email</th>
                <th className="text-left py-2 px-4 border-b">Role</th>
                <th className="text-left py-2 px-4 border-b">Phone</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No active users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">
            Department Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">
            Monthly Salary
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill="#4F46E5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leave Management Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Leave Management Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={<FaUsers className="text-white text-2xl" />}
            text="Leaves Applied"
            number={leaveStats.totalLeaves || 0}
            color="bg-blue-500"
          />
          <SummaryCard
            icon={<FaClock className="text-white text-2xl" />}
            text="Leaves Pending"
            number={
              leaveStats?.statusBreakdown.find((s) => s.name === "Pending")?.value || 0
            }
            color="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaTimesCircle className="text-white text-2xl" />}
            text="Leaves Rejected"
            number={
              leaveStats?.statusBreakdown.find((s) => s.name === "Rejected")?.value || 0
            }
            color="bg-red-500"
          />
          <SummaryCard
            icon={<FaCheckCircle className="text-white text-2xl" />}
            text="Leaves Approved"
            number={
              leaveStats?.statusBreakdown.find((s) => s.name === "Approved")?.value || 0
            }
            color="bg-green-500"
          />
        </div>

        {/* Leave Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-10">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">
            Leave Status Overview
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveStats?.statusBreakdown || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {leaveStats?.statusBreakdown?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
