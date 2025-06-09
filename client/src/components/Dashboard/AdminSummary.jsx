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
} from "../../hooks/UseAdminDashboard";

// Chart colors
const COLORS = [
  "#4F46E5", // Indigo
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#22D3EE", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
];

const AdminSummary = () => {
  // State to hold all employees data (for dropdowns)
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;

  // const { data: departments, isLoading: isDepartmentsLoading } =
  //   useDepartments(baseUrl);

  const {
    data: countDep,

    isLoading: isDepLoading,
  } = useDepartmentCount(baseUrl);

  const { data: totalSalary, isLoading: isSalaryLoading } =
    useSalaryAggregation(baseUrl);
  const { data: usersCount, isLoading: isUserCountLoading } =
    useEmployeesCount(baseUrl);
  const { data: departmentData = [], isLoading: isDeptChartLoading } =
    useDepartmentDistribution(baseUrl);

  const { data: leaveStats, isLoading: isLeaveStatsLoading } =
    useLeaveStats(baseUrl);
  console.log("Leave Stats:", leaveStats);
  const { data: monthlySalaryData, isLoading: isMonthlySalaryLoading } =
    useMonthlySalaryData(baseUrl);

  const isLoading =
    isDepLoading ||
    isSalaryLoading ||
    isUserCountLoading ||
    isDeptChartLoading ||
    isLeaveStatsLoading ||
    isMonthlySalaryLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin  rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sourceSans">
      <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-wide">
        Admin Dashboard Overview
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          number={totalSalary[0].totalAmount}
          color="bg-[#EF4444]"
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-white text-3xl" />}
          text="Total Salary Count"
          number={totalSalary[0].totalCount}
          color="bg-[#10B981]"
        />
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

      {/* Leave Summary Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-center text-gray-700 mb-4 tracking-wide">
          Leave Management Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
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
              leaveStats?.statusBreakdown.find(
                (status) => status.name === "Pending"
              )?.value || 0
            }
            color="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaTimesCircle className="text-white text-2xl" />}
            text="Leaves Rejected"
            number={
              leaveStats?.statusBreakdown.find(
                (status) => status.name === "Rejected"
              )?.value || 0
            }
            color="bg-red-500"
          />
          <SummaryCard
            icon={<FaCheckCircle className="text-white text-2xl" />}
            text="Leaves Approved"
            number={
              leaveStats?.statusBreakdown.find(
                (status) => status.name === "Approved"
              )?.value || 0
            }
            color="bg-green-500"
          />
        </div>

        {/* Leave Status Pie Chart */}
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
                {Array.isArray(leaveStats?.statusBreakdown) &&
                  leaveStats.statusBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
