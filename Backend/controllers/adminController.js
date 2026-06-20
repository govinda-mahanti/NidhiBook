import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingAdmin = await Admin.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingAdmin || existingUser) {
      return res.status(409).json({
        message: "Email already exists as User or Admin",
      });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: "admin",
    });

    const token = generateToken(newAdmin._id, newAdmin.role);

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      token,
    });
  } catch (error) {
    console.error("Create Admin Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users (Admin Panel)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User (Admin Panel)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};