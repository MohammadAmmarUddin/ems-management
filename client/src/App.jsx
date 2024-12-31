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
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import LeaveList from "./components/leaves/LeaveList";
import LeaveAdd from "./components/leaves/LeaveAdd";
import ViewEmployee from "./components/employee/ViewEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import EmployeeDashboard from "./components/EmployeeDashboard/EmployeeDashboard";
import Summary from "./components/EmployeeDashboard/Summary";
import Profile from "./components/EmployeeDashboard/Profile";
import AddLeave from "./components/EmployeeDashboard/leave/AddLeave"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/admin-dashboard"} />}></Route>
        <Route path="/login" element={<Login />}></Route>
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
          <Route index element={<AdminSummary />}></Route>
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route path="/admin-dashboard/leave" element={<LeaveList />}></Route>
          <Route
            path="/admin-dashboard/leaves/:id"
            element={<LeaveList />}
          ></Route>
          <Route
            path="/admin-dashboard/addLeave"
            element={<LeaveAdd />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/edit-department/:id"
            element={<EditDepartment />}
          ></Route>
          <Route path="/admin-dashboard/employee" element={<List />}></Route>

          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route
            path="/admin-dashboard/view-employee/:id"
            element={<ViewEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/edit-employee/:id"
            element={<EditEmployee />}
          ></Route>
        </Route>
        {/* Employee Dashboard  */}

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
          <Route index element={<Summary />}></Route>
          <Route
            path="/employee-dashboard/summary"
            element={<Summary />}
          ></Route>
          <Route
            path="/employee-dashboard/profile"
            element={<Profile />}
          ></Route>
    
          <Route
            path="/employee-dashboard/add-leave"
            element={<AddLeave/>}
          ></Route>
        </Route>

        {/* moderator  */}
        {/* <Route
          path="/moderator-dashboard"  
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["moderator"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          <Route
            path="/moderator-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route path="/moderator-dashboard/leave" element={<LeaveList />}></Route>
         
          <Route path="/moderator-dashboard/employee" element={<List />}></Route>
          <Route path="/moderator-dashboard/add-employee" element={<Add />}></Route>
      
        </Route> */}
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
