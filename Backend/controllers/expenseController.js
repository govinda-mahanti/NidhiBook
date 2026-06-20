import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
export const addexpenses = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const { amount, category, description, date } = req.body;

    const newExpense = new Expense({
      user: user._id,
      amount,
      category,
      description,
      date,
    });

    await newExpense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding expense",
      error: error.message,
    });
  }
};

export const getAllExpenses = async (req, res) => {
  try {

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const expenses = await Expense.find({ user: user._id });

    res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving expenses",
      error: error.message,
    });
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await Expense.deleteOne({ _id: id });

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting expense",
      error: error.message,
    });
  }
}


export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.description = description || expense.description;
    expense.date = date || expense.date;

    await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating expense",
      error: error.message,
    });
  }
};
