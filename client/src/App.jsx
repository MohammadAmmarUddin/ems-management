import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import AdminSummary from "./components/Dashboard/AdminSummary";
import DepartmentList from "./components/Department/DepartmentList";
import AddDepartment from "./components/Department/AddDepartment";
import EditDepartment from "./components/Department/EditDepartment";
import EmployeeList from "./components/employee/EmployeeList";
import AddEmployee from "./components/employee/EmployeeAdd";
import ViewEmployee from "./components/employee/ViewEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import LeaveList from "./components/leaves/LeaveList";
import LeaveAdd from "./components/leaves/LeaveAdd";
import EmployeeDashboard from "./components/EmployeeDashboard/EmployeeDashboard";
import Summary from "./components/EmployeeDashboard/Summary";
import Profile from "./components/EmployeeDashboard/Profile";
import AddLeave from "./components/EmployeeDashboard/leave/AddLeave";
import LeaveHistory from "./components/EmployeeDashboard/leave/LeaveHistory";
import Salary from "./components/Salary/Salary";
import AddSalary from "./components/Salary/AddSalary";
import Attendance from "./components/attendence/Attendance";
import AttendanceReport from "./components/attendence/AttendanceReport";
import Annoucement from "./components/Annoucement";
import AnnoucementEmployee from "./components/AnnoucementEmployee";
import SalaryHistory from "./components/EmployeeDashboard/salary/SalaryHistory";
import EditLeave from "./components/EmployeeDashboard/leave/EditLeave";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="edit-department/:id" element={<EditDepartment />} />
          <Route path="employee" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="view-employee/:id" element={<ViewEmployee />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendanceReport" element={<AttendanceReport />} />
          <Route path="leave" element={<LeaveList />} />
          <Route path="addLeave" element={<LeaveAdd />} />
          <Route path="salary" element={<Salary />} />
          <Route path="annoucement" element={<Annoucement />} />
          <Route path="salary/addSalary/:id" element={<AddSalary />} />
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<Summary />} />
          <Route path="summary" element={<Summary />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leave-history" element={<LeaveHistory />} />
          <Route path="add-leave" element={<AddLeave />} />
          <Route path="edit-employee-leave/:id" element={<EditLeave />} />
          <Route path="salary-history" element={<SalaryHistory />} />
          <Route path="annoucementEmployee" element={<AnnoucementEmployee />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
