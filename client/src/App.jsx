import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Auth
import Login from "../src/auth/Login";
import Signup from "../src/auth/Signup";

// Route protection
import PrivateRoutes from "../src/utils/PrivateRoutes.jsx";
import RoleBasedRoute from "../src/utils/RoleBasedRoute.jsx";

// Admin Layout & Pages
import AdminDashboardLayout from "../src/layouts/AdminDashboard.jsx";
import AdminSummary from "../src/pages/admin-Dashboard/Dashboard/AdminSummary.jsx";
import DepartmentList from "../src/pages/admin-Dashboard/Department/DepartmentList.jsx";
import AddDepartment from "../src/pages/admin-Dashboard/Department/AddDepartment.jsx";
import EditDepartment from "../src/pages/admin-Dashboard/Department/EditDepartment.jsx";
import EmployeeList from "../src/pages/admin-Dashboard/employee/EmployeeList.jsx";
import AddEmployee from "../src/pages/admin-Dashboard/employee/EmployeeAdd.jsx";
import ViewEmployee from "../src/pages/admin-Dashboard/employee/ViewEmployee.jsx";
import EditEmployee from "../src/pages/admin-Dashboard/employee/EditEmployee.jsx";
import Managers from "../src/pages/admin-Dashboard/managers/Managers.jsx";
import Projects from "../src/pages/admin-Dashboard/projects/Projects.jsx";
import AddManager from "../src/pages/admin-Dashboard/managers/AddManager.jsx";
import EditManager from "../src/pages/admin-Dashboard/managers/EditManager.jsx";
import Attendance from "../src/pages/admin-Dashboard/attendence/Attendance.jsx";
import AttendanceReport from "../src/pages/admin-Dashboard/attendence/AttendanceReport.jsx";
import LeaveList from "../src/pages/admin-Dashboard/leaves/LeaveList.jsx";
import LeaveAdd from "../src/pages/admin-Dashboard/leaves/LeaveAdd.jsx";
import Salary from "../src/pages/admin-Dashboard/Salary/Salary.jsx";
import AddSalary from "../src/pages/admin-Dashboard/Salary/AddSalary.jsx";
import Annoucement from "../src/pages/admin-Dashboard/annoucement/Annoucement.jsx";

// Employee & Manager Shared Layout & Pages
import EmployeeDashboard from "../src/layouts/EmployeeDashboard.jsx";
import Summary from "../src/pages/employee-Dashboard/Summary.jsx";
import Profile from "../src/pages/employee-Dashboard/Profile.jsx";
import LeaveHistory from "../src/pages/employee-Dashboard/Leave/LeaveHistory.jsx";
import AddLeave from "../src/pages/employee-Dashboard/Leave/AddLeave.jsx";
import EditLeave from "../src/pages/employee-Dashboard/Leave/EditLeave.jsx";
import SalaryHistory from "../src/pages/employee-Dashboard/Salary/SalaryHistory.jsx";
import AnnoucementEmployee from "../src/pages/employee-Dashboard/AnnoucementEmployee.jsx";
import MyTasks from "../src/pages/employee-Dashboard/Tasks/MyTasks.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["admin"]}>
                <AdminDashboardLayout />
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
          <Route path="managers" element={<Managers />} />
          <Route path="projects" element={<Projects />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendanceReport" element={<AttendanceReport />} />
          <Route path="leave" element={<LeaveList />} />
          <Route path="addLeave" element={<LeaveAdd />} />
          <Route path="salary" element={<Salary />} />
          <Route path="salary/addSalary/:id" element={<AddSalary />} />
          <Route path="annoucement" element={<Annoucement />} />
        </Route>

        {/* Employee Dashboard Routes */}
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
          <Route path="tasks" element={<MyTasks />} />
        </Route>

        {/* Manager Dashboard Routes - uses same layout and pages as Employee */}
        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["manager"]}>
                <EmployeeDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<Summary />} />
          <Route path="summary" element={<Summary />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<LeaveHistory />} />
          <Route path="managers" element={<Managers />} />
          <Route path="annoucementEmployee" element={<AnnoucementEmployee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
