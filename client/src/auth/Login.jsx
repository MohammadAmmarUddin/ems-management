import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaLock } from "react-icons/fa";
import { useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success === true) {
        login(response.data.user);


        if (remember) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged in successfully",
          showConfirmButton: false,
          timer: 1500,
          backdrop: "rgba(0, 0, 0, 0.2)",
          color: "#065F46",
          iconColor: "#10B981",
        }).then(() => {
          const role = response.data.user.role;
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "manager") navigate("/manager-dashboard");
          else navigate("/employee-dashboard");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Invalid credentials. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while logging in. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-white flex items-center justify-center px-4 font-sourceSans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl">
            <FaLock size={26} />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-exo font-bold text-center mt-10 text-gray-800 tracking-wide leading-tight">
          Welcome Back
        </h2>
        <p className="text-center text-lg text-gray-600 font-semibold mt-1 mb-6">
          To the{" "}
          <span className="text-primary font-semibold italic">
            Employee Management System
          </span>
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-primary cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-primary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="#" className="hover:text-primary font-semibold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary transition-colors text-white font-semibold py-2 rounded-lg text-lg tracking-wide shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
