import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/urlconfig";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    annualIncome: "",
    monthlyBudget: "",
    yearlyBudget: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, formData);

      const { token, ...user } = res.data;
      dispatch(setCredentials({ user, token }));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        setErrorMsg("User already exists with this email.");
      } else {
        setErrorMsg("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"></div>

      {/* Signup Form Card */}
     <form
  onSubmit={handleSubmit}
  className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 
             backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-700/50 
             w-full max-w-3xl space-y-6 z-10"
>
  <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
  <p className="text-center text-gray-400 mb-2">
    Get started with NidhiBook
  </p>

  {errorMsg && (
    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl text-center text-sm">
      {errorMsg}
    </div>
  )}

  {/* GRID LAYOUT */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Name */}
    <div>
      <label className="text-gray-300 text-sm">Full Name</label>
      <input
        type="text"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-purple-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Email */}
    <div>
      <label className="text-gray-300 text-sm">Email Address</label>
      <input
        type="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-blue-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Password */}
    <div>
      <label className="text-gray-300 text-sm">Password</label>
      <input
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-cyan-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Profession */}
    <div>
      <label className="text-gray-300 text-sm">Profession</label>
      <input
        type="text"
        placeholder="Software Engineer"
        value={formData.profession}
        onChange={(e) =>
          setFormData({ ...formData, profession: e.target.value })
        }
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-pink-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Annual Income */}
    <div>
      <label className="text-gray-300 text-sm">Annual Income</label>
      <input
        type="number"
        placeholder="500000"
        value={formData.annualIncome}
        onChange={(e) =>
          setFormData({ ...formData, annualIncome: e.target.value })
        }
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-green-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Monthly Budget */}
    <div>
      <label className="text-gray-300 text-sm">Monthly Budget</label>
      <input
        type="number"
        placeholder="25000"
        value={formData.monthlyBudget}
        onChange={(e) =>
          setFormData({ ...formData, monthlyBudget: e.target.value })
        }
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-orange-400 outline-none 
                   transition-all duration-300"
      />
    </div>

    {/* Yearly Budget */}
    <div>
      <label className="text-gray-300 text-sm">Yearly Budget</label>
      <input
        type="number"
        placeholder="300000"
        value={formData.yearlyBudget}
        onChange={(e) =>
          setFormData({ ...formData, yearlyBudget: e.target.value })
        }
        required
        className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 text-white 
                   border border-slate-700 focus:border-purple-300 outline-none 
                   transition-all duration-300"
      />
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white 
               py-3 rounded-xl text-lg font-semibold 
               hover:shadow-2xl hover:shadow-cyan-500/30 
               transform hover:scale-105 transition-all duration-300"
  >
    Sign Up
  </button>

  <p className="text-center text-gray-400 text-sm pt-2">
    Already have an account?{" "}
    <span
      className="text-cyan-400 cursor-pointer hover:underline"
      onClick={() => navigate("/login")}
    >
      Log In
    </span>
  </p>
</form>

    </div>
  );
};

export default Signup;
