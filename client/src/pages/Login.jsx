import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const Login = () => {

  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );
      if (response.data.success === true) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigation("/admin-dashboard");
        } else if(response.data.user.role==="moderator"){
          navigation("/moderator-dashboard");
        }
      else {
          navigation("/employee-dashboard");
        }
      }
       else {
        setError("Give Correct Information");
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div className=" bg-gradient-to-r from-green-400 to-slate-500 w-full h-full">
      <h2 className="text-center relative top-10 font-bold font-roslindale lg:text-5xl md:text-4xl text-3xl ">
        Employee Management System
      </h2>
      <div className="card  bg-base-100 mx-auto top-[10vh] md:top-[20vh]  w-full max-w-md shrink-0 shadow-2xl">
        <h2 className="text-4xl text-center font-bold animate-pulse">Login</h2>
        {error && <p className="text-red-500 mt-10 ml-10">{error}</p>}
        <form onSubmit={handleSubmit} className="card-body  ">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="email"
              className="input input-bordered cursor   focus:outline-none     border focus:border-green-500  rounded-none"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered focus:outline-none  border focus:border-green-500  rounded-none"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn bg-teal-500 hover:bg-[#4bdb81] text-white font-semibold text-xl">
              Login
            </button>
          </div>
          <div className="flex justify-between">
            <label htmlFor="check" className="flex gap-1 items-center">
              <input type="checkbox" name="remember" id="remember" />
              <span>Remember me</span>
            </label>
            <Link className="text-teal-600">forget password</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
