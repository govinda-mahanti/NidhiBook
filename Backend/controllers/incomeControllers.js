import User from "../models/userModel.js";
import Income from "../models/incomeModel.js";

export const addIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // validate source enum
    const allowedSources = [
      "Salary",
      "Business",
      "Freelance",
      "Investment",
      "Other",
    ];
    if (!allowedSources.includes(source)) {
      return res.status(400).json({
        success: false,
        message: `Invalid source. Allowed values: ${allowedSources.join(", ")}`,
      });
    }

    const newIncome = new Income({
      user: user._id,
      source,
      amount,
      date,
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income: newIncome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const incomes = await Income.find({ user: user._id }).sort({ date: -1 }); // 👈 sorted latest first

    res.status(200).json({
      success: true,
      count: incomes.length,
      incomes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const income = await Income.findById(req.params.id);

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    if (income.user.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await income.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, amount, date } = req.body;

    const income = await Income.findById(id);

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    const allowedSources = [
      "Salary",
      "Business",
      "Freelance",
      "Investment",
      "Other",
    ];
    if (source && !allowedSources.includes(source)) {
      return res.status(400).json({
        success: false,
        message: `Invalid source. Allowed values: ${allowedSources.join(", ")}`,
      });
    }

    if (source) income.source = source;
    if (amount) income.amount = amount;
    if (date) income.date = date;

    await income.save();

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      income,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
