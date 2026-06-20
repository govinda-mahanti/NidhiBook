import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  Home,
  Wallet,
  ArrowUpCircle,
  UserCircle,
  Users,
  Menu,
  Settings,
  User,
  LogOut,
  Bot
} from "lucide-react";

import { useSelector } from "react-redux";

const DashLayout = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setCurrentTime(date);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { label: "Expense", path: "/dashboard/expense", icon: <Wallet size={20} /> },
    { label: "Income", path: "/dashboard/income", icon: <ArrowUpCircle size={20} /> },
    { label: "Profile", path: "/dashboard/profile", icon: <UserCircle size={20} /> },
    { label: "Advisor", path: "/dashboard/advisor", icon: <Bot size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117]">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#161b22] text-gray-300 flex-col justify-between p-4 hidden md:flex">
        <div>
          <h1 className="text-2xl font-bold text-center text-white mb-12 ml-6">
            <a href="/" className="text-2xl font-bold text-white flex items-center">
                      <img src={logo} alt="NidhiBook" className="h-12" />
                    </a>
          </h1>

          <ul className="space-y-2">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#161b22] text-gray-300 p-4 
        transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 z-50 md:hidden`}
      >
        <h1 className="text-2xl font-bold text-center text-white mb-12">Nidhibook</h1>

        <ul className="space-y-2">
          {navItems.map((item, idx) => (
            <li key={idx} onClick={() => setMobileOpen(false)}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700/50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-[#161b22] border-b border-gray-700 px-4 py-4 flex justify-between items-center">

          {/* Mobile Logo */}
          <div className="text-white font-semibold text-lg md:hidden">Nidhibook</div>

          {/* Desktop Date */}
          <div className="hidden md:block text-sm text-gray-400">{currentTime}</div>

          {/* Icons Right */}
          <div className="flex items-center gap-5 relative">

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-gray-400 hover:text-white"
            >
              <User size={20} />
            </button>

            {/* Mobile Menu Button (☰) */}
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={24} />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute top-10 right-12 bg-[#161b22] border border-gray-700 shadow-lg rounded-md p-2 w-48 z-20">
                <ul className="text-sm text-gray-300">
                  <li
                    onClick={() => {
                      setShowSettings(false);
                      navigate("/dashboard/profile");
                    }}
                    className="px-3 py-2 rounded cursor-pointer hover:bg-gray-700/50"
                  >
                    Reset Password
                  </li>
                  <li className="px-3 py-2 rounded cursor-pointer hover:bg-gray-700/50">
                    Terms
                  </li>
                  <li className="px-3 py-2 rounded cursor-pointer hover:bg-gray-700/50">
                    Privacy
                  </li>
                  <li
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-red-500 hover:bg-gray-700/50"
                  >
                    <LogOut size={16} /> Logout
                  </li>
                </ul>
              </div>
            )}

            {/* Profile Dropdown */}
            {showProfile && user && (
              <div className="absolute top-10 right-0 bg-[#161b22] border border-gray-700 shadow-lg rounded-md p-4 w-64 z-20 text-gray-300">
                <h2 className="font-semibold mb-2 text-white">Your Profile</h2>

                <div className="text-sm space-y-1">
                  <p>{user.name}</p>
                  <p>Email: {user.email}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
