import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Contact from "./Pages/Contact";
import About from "./Pages/About";

import DashLayout from "./Dashboard/DashLayout";
import Dashboard from "./Dashboard/Dashboard";
import Expense from "./Dashboard/Expense";
import Profile from "./Dashboard/Profile";
import Income from "./Dashboard/Income";
import Advisor from "./Dashboard/Advisor";


import AdminDashLayout from "./AdminDashboard/AdminDashLayout";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

import ProtectedRoute from "./redux/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/dashboard" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="expense" element={<Expense />} />
            <Route path="profile" element={<Profile />} />
            <Route path="income" element={<Income />} />
            <Route path="advisor" element={<Advisor />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
