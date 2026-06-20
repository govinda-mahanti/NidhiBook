import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../config/urlconfig";
import { Pencil, Trash2, Loader } from "lucide-react";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [error, setError] = useState(null);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const [editingExpense, setEditingExpense] = useState(null);

  const categories = [
    "Food",
    "Transport",
    "Health",
    "Bills",
    "Shopping",
    "Other",
  ];

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/api/expenses`, {
        headers: { Authorization: `${token}` },
      });

      console.log("Fetch Expenses Response:", response.data);

      if (response.data.expenses) {
        setExpenses(response.data.expenses);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "add") {
      setNewExpense({ ...newExpense, [name]: value });
    } else {
      setEditingExpense({ ...editingExpense, [name]: value });
    }
  };

 const handleAddExpense = async () => {
  const { description, amount, category, date } = newExpense;

  if (!description || !amount || !date) {
    alert("Please fill in all fields");
    return;
  }

  try {
    setAddLoading(true);

    const data = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
    };

    const response = await axios.post(`${BASE_URL}/api/add-expenses`, data, {
      headers: { Authorization: `${token}` },
    });

    console.log("Add Response:", response.data);

    // 🔥 FIX: Your backend doesn't return success:true
    if (response.data.expense || response.data.message) {
      alert("Expense added successfully!");

      await fetchExpenses();   // refresh table

      // Reset form
      setNewExpense({
        description: "",
        amount: "",
        category: "Food",
        date: "",
      });

      setAddModalOpen(false);  // close modal
    } else {
      alert("Failed to add expense");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add expense");
  } finally {
    setAddLoading(false);
  }
};


  const openEditModal = (expense) => {
    setEditingExpense({
      ...expense,
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setEditModalOpen(true);
  };

  const handleUpdateExpense = async () => {
    if (
      !editingExpense.description ||
      !editingExpense.amount ||
      !editingExpense.date
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setEditLoading(true);

      const updatedData = {
        description: editingExpense.description,
        amount: parseFloat(editingExpense.amount),
        category: editingExpense.category,
        date: new Date(editingExpense.date),
      };

      const response = await axios.put(
        `${BASE_URL}/api/update-expenses/${editingExpense._id}`,
        updatedData,
        {
          headers: { Authorization: `${token}` },
        }
      );

      console.log("Update Expense Response:", response.data);

      if (response.data.message || response.data.updatedExpense) {
        alert("Expense updated successfully!");

        await fetchExpenses();
        setEditModalOpen(false);
        setEditingExpense(null);
      } else {
        alert("Failed to update expense");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update expense");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      const response = await axios.delete(`${BASE_URL}/api/expenses/${id}`, {
        headers: { Authorization: `${token}` },
      });

      console.log("Delete Response:", response.data);

      if (
        response.data.message ||
        response.data.deletedExpense ||
        response.data.status
      ) {
        alert("Expense deleted successfully!");
        await fetchExpenses();
      } else {
        alert("Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
       <div className="md:max-w-5xl max-w-sm mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Expenses
          </h1>
          <button
            onClick={() => {
              setNewExpense({
                description: "",
                amount: "",
                category: "Food",
                date: new Date().toISOString().split("T")[0],
              });
              setAddModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            + Add Expense
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Expense Table */}
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-4">{expense.description}</td>
                  <td className="p-4 text-gray-300">{expense.category}</td>
                  <td className="p-4 text-red-400 font-medium">
                    ₹{expense.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-400">
                    {formatDate(expense.date)}
                  </td>
                  <td className="p-4 flex justify-center items-center space-x-3">
                    <button
                      onClick={() => openEditModal(expense)}
                      className="text-blue-400 hover:text-blue-300 flex items-center p-2"
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-500 hover:text-red-400 flex items-center p-2"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expenses.length === 0 && (
            <p className="text-center text-gray-400 p-6">
              No expenses found. Add one to get started!
            </p>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>

            <div className="space-y-4">
              <input
                name="description"
                value={newExpense.description}
                onChange={(e) => handleInputChange(e, "add")}
                placeholder="Description"
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
              <input
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={(e) => handleInputChange(e, "add")}
                placeholder="Amount"
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
              <select
                name="category"
                value={newExpense.category}
                onChange={(e) => handleInputChange(e, "add")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={(e) => handleInputChange(e, "add")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setAddModalOpen(false)}
                className="py-2 px-4 bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={addLoading}
                className="py-2 px-4 bg-indigo-600 rounded flex items-center"
              >
                {addLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingExpense && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit Expense</h2>

            <div className="space-y-4">
              <input
                name="description"
                value={editingExpense.description}
                onChange={(e) => handleInputChange(e, "edit")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
              <input
                name="amount"
                type="number"
                value={editingExpense.amount}
                onChange={(e) => handleInputChange(e, "edit")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
              <select
                name="category"
                value={editingExpense.category}
                onChange={(e) => handleInputChange(e, "edit")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={editingExpense.date}
                onChange={(e) => handleInputChange(e, "edit")}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="py-2 px-4 bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExpense}
                disabled={editLoading}
                className="py-2 px-4 bg-indigo-600 rounded flex items-center"
              >
                {editLoading && (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                )}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
