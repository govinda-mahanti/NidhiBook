import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profession,
      annualIncome,
      monthlyBudget,
      yearlyBudget,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !profession ||
      !annualIncome ||
      !monthlyBudget ||
      !yearlyBudget
    ) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ email });

    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(409).json({
        message: "Email already exists as User or Admin.",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: "user",
      profession,
      annualIncome,
      monthlyBudget,
      yearlyBudget,
    });

    if (newUser) {
      const token = generateToken(newUser._id, newUser.role);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profession: newUser.profession,
        annualIncome: newUser.annualIncome,
        monthlyBudget: newUser.monthlyBudget,
        yearlyBudget: newUser.yearlyBudget,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(admin._id, "admin");

      return res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
        token,
        message: "Admin login successful",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id, "user");

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        token,
        message: "User login successful",
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      annualIncome: user.annualIncome,
      monthlyBudget: user.monthlyBudget,
      yearlyBudget: user.yearlyBudget,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      email,
      profession,
      annualIncome,
      monthlyBudget,
      yearlyBudget,
    } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.profession = profession || user.profession;
    user.annualIncome = annualIncome || user.annualIncome;
    user.monthlyBudget = monthlyBudget || user.monthlyBudget;
    user.yearlyBudget = yearlyBudget || user.yearlyBudget;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        annualIncome: user.annualIncome,
        monthlyBudget: user.monthlyBudget,
        yearlyBudget: user.yearlyBudget,
      },
    });
  } catch (error) {
    console.error("Update User Profile Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please fill all password fields." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    const isPasswordCorrect = await user.matchPassword(currentPassword);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword; // raw password here, pre-save hook hashes it
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Password updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Update Password Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
