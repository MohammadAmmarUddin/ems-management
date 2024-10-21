import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import AdminSummary from "./components/Dashboard/AdminSummary";
import DepartmentList from "./components/Department/DepartmentList";
import AddDepartment from "./components/Department/AddDepartment";
import EditDepartment from "./components/Department/EditDepartment";

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
          <Route index element={<AdminSummary/>}></Route>
          <Route path="/admin-dashboard/departments" element={<DepartmentList/>}></Route>
          <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
          <Route path="/admin-dashboard/edit-department/:id" element={<EditDepartment/>}></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requiredRole={["employee"]}>
                {" "}
                <EmployeeDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
