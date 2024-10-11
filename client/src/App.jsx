import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"/admin-dashboard"}/>} ></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
      <Route path="/employee-dashboard" element={<EmployeeDashboard/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>

    </Routes>
    
    </BrowserRouter>
  )
}

export default App
