import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { BASE_URL } from "../config/urlconfig";
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const InputField = ({
  label,
  type,
  value,
  name,
  onChange,
  iconPath,
  placeholder,
}) => (
  <div className="relative mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon path={iconPath} className="w-5 h-5 text-gray-400" />
      </span>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-[#1a202c] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  </div>
);

const Button = ({
  onClick,
  children,
  type = "button",
  variant = "primary",
}) => {
  const baseClasses =
    "w-full flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

// --- Main Profile Component ---
const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${BASE_URL}/auth/getprofile`, { headers: { Authorization: token } })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setProfileMsg("Error loading profile.");
        setLoading(false);
      });
  }, [token]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await axios.put(`${BASE_URL}/auth/updateprofile`, formData, {
        headers: { Authorization: token },
      });
      setUser(res.data.user ? res.data.user : res.data);
      setIsEditing(false);
      setProfileMsg("Profile updated!");
    } catch {
      setProfileMsg("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
    setProfileMsg("");
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await axios.put(`${BASE_URL}/auth/updatepassword`, passwordData, {
        headers: { Authorization: token },
      });
      // After password change success:
      dispatch(logOut()); // Clear tokens and user info
      alert("Password updated successfully. Please log in again.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      alert(error.response?.data?.message || "Error updating password.");
    }
  };
  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center font-sans text-white">
        Loading profile...
      </div>
    );

  return (
    <div className="bg-black h-full flex p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
              src={`https://placehold.co/100x100/1a202c/ffffff?text=${user?.name?.charAt(
                0
              )}`}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/100x100/1a202c/ffffff?text=U";
              }}
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-blue-400">{user.profession}</p>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>
            {!isEditing && (
              <div className="sm:ml-auto pt-4 sm:pt-0">
                <Button onClick={() => setIsEditing(true)}>
                  <Icon
                    path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    className="w-5 h-5 mr-2"
                  />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <>
            <form
              onSubmit={handleSave}
              className="p-6 sm:p-8 border-t border-gray-800"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Edit Your Details
              </h2>
              {profileMsg && (
                <div className="mb-4 text-blue-400">{profileMsg}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  iconPath="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  placeholder="Your full name"
                />
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  iconPath="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  placeholder="your.email@example.com"
                />
                <InputField
                  label="Profession"
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleFormChange}
                  iconPath="M20.25 14.15v4.05a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h15.5a2.25 2.25 0 012.25 2.25v.05"
                  placeholder="Your profession"
                />
                <InputField
                  label="Annual Income"
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleFormChange}
                  iconPath="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.768 11 12 11c-.768 0-1.536.21-2.121.659l-.879.659z"
                  placeholder="e.g., 95000"
                />
                <InputField
                  label="Monthly Budget"
                  type="number"
                  name="monthlyBudget"
                  value={formData.monthlyBudget}
                  onChange={handleFormChange}
                  iconPath="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0H3.75m0 0A.75.75 0 013 6h.75m6.375 0h.75a.75.75 0 01.75.75v.75m0 0h-.75a.75.75 0 01-.75-.75V6h.75z"
                  placeholder="e.g., 3000"
                />
                <InputField
                  label="Yearly Budget"
                  type="number"
                  name="yearlyBudget"
                  value={formData.yearlyBudget}
                  onChange={handleFormChange}
                  iconPath="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18"
                  placeholder="e.g., 36000"
                />
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button type="submit" variant="primary">
                  <Icon path="M4.5 12.75l6 6 9-13.5" className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="secondary">
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>

            <div className="p-6 sm:p-8 border-t border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Reset Password
              </h2>
              {passwordMsg && (
                <div className="mb-4 text-blue-400">{passwordMsg}</div>
              )}
              <form onSubmit={handlePasswordReset}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    iconPath="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    placeholder="••••••••"
                  />
                  <InputField
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    iconPath="M15.75 5.25a3 3 0 013 3v3a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-3a3 3 0 013-3h7.5z"
                    placeholder="••••••••"
                  />
                  <InputField
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    iconPath="M15.75 5.25a3 3 0 013 3v3a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-3a3 3 0 013-3h7.5z"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mt-6 md:w-1/3">
                  <Button type="submit" variant="primary">
                    <Icon
                      path="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v-2.121a3.375 3.375 0 00-3.375-3.375H8.25a3.375 3.375 0 00-3.375 3.375v2.121m0 0h4.992"
                      className="w-5 h-5 mr-2"
                    />
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="p-6 sm:p-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-white">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Annual Income</span>
                <span className="text-lg font-semibold">
                  ₹{new Intl.NumberFormat().format(user.annualIncome)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Monthly Budget</span>
                <span className="text-lg font-semibold">
                  ₹{new Intl.NumberFormat().format(user.monthlyBudget)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Yearly Budget</span>
                <span className="text-lg font-semibold">
                  ₹{new Intl.NumberFormat().format(user.yearlyBudget)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
