import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import { BASE_URL } from "../config/urlconfig";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, formData);

      const { token, ...user } = res.data;

      dispatch(setCredentials({ user, token }));

      console.log("Login successful:", res.data);

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl 
                   p-10 rounded-3xl shadow-2xl border border-slate-700/50 
                   w-full max-w-md space-y-6 z-10"
      >
        <h2 className="text-4xl font-bold text-center text-white">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 mb-4">
          Log in to continue your financial journey
        </p>

        {/* Email */}
        <div>
          <label className="text-gray-300 text-sm">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                       border border-slate-700 focus:border-blue-400 
                       outline-none transition-all duration-300"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                       border border-slate-700 focus:border-cyan-400 
                       outline-none transition-all duration-300"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white 
                     py-3 rounded-xl text-lg font-semibold 
                     hover:shadow-2xl hover:shadow-cyan-500/30 
                     transform hover:scale-105 transition-all duration-300"
        >
          Log In
        </button>

        {/* Optional Signup Link */}
        <p className="text-center text-gray-400 text-sm pt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
