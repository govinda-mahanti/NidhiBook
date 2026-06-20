import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../config/urlconfig';

const Income = () => {
  const token = useSelector(state => state.auth.token);

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', date: '' });
  const [addLoading, setAddLoading] = useState(false);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const allowedSources = ["Salary", "Business", "Freelance", "Investment", "Other"];

  
  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/income`, 
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      );
      
      if (response.data.success) {
        setIncomes(response.data.incomes);
      } else {
        setError(response.data.message || 'Failed to fetch incomes');
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setError(error.response?.data?.message || 'Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewIncome({ ...newIncome, [name]: value });
    } else if (formType === 'edit' && editingIncome) {
      setEditingIncome({ ...editingIncome, [name]: value });
    }
  };

  const handleAddIncome = async () => {
    if (!newIncome.source || !newIncome.amount || !newIncome.date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setAddLoading(true);
      const incomeData = {
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        date: newIncome.date
      };
      
      const response = await axios.post(`${BASE_URL}/api/add-income`, incomeData, 
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      );

      if (response.data.success) {
        await fetchIncomes();
        setNewIncome({ source: '', amount: '', date: '' });
        setAddModalOpen(false);
      } else {
        alert(response.data.message || 'Failed to add income');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      alert(error.response?.data?.message || 'Failed to add income');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/api/income/${id}`, 
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      );
      
      if (response.data.success) {
        await fetchIncomes();
      } else {
        alert(response.data.message || 'Failed to delete income');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
      alert(error.response?.data?.message || 'Failed to delete income');
    }
  };
  
  const openEditModal = (income) => {
    setEditingIncome({
      ...income,
      date: new Date(income.date).toISOString().split('T')[0] // Format date for input
    });
    setEditModalOpen(true);
  };

  const handleUpdateIncome = async () => {
    if (!editingIncome || !editingIncome.source || !editingIncome.amount || !editingIncome.date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setEditLoading(true);
      const updatedData = {
        source: editingIncome.source,
        amount: parseFloat(editingIncome.amount),
        date: editingIncome.date
      };
      
      const response = await axios.put(`${BASE_URL}/api/income/${editingIncome._id}`, updatedData, 
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      );

      if (response.data.success) {
        await fetchIncomes();
        setEditModalOpen(false);
        setEditingIncome(null);
      } else {
        alert(response.data.message || 'Failed to update income');
      }
    } catch (error) {
      console.error('Error updating income:', error);
      alert(error.response?.data?.message || 'Failed to update income');
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
     return (
       <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
         <div className="text-center">
           <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
           <p>Loading incomes...</p>
         </div>
       </div>
     );
   }

   if (error && incomes.length === 0) {
     return (
       <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
         <div className="text-center">
           <p className="text-red-400 mb-4">{error}</p>
           <button 
             onClick={fetchIncomes}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
           >
             Try Again
           </button>
         </div>
       </div>
     );
   }

   return (
     <div className="bg-black text-white h-full p-4 sm:p-6 lg:p-8 font-sans">
       <div className="md:max-w-5xl max-w-sm mx-auto">
         {/* Header */}
         <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold tracking-tight">Incomes</h1>
           <button
             onClick={() => {
               setNewIncome({ source: '', amount: '', date: new Date().toISOString().split('T')[0] });
               setAddModalOpen(true);
             }}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
           >
             + Add Income
           </button>
         </div>

         {/* Error message */}
         {error && incomes.length > 0 && (
           <div className="bg-red-900/50 text-red-200 p-3 rounded-md mb-4">
             {error}
           </div>
         )}

         {/* Income List/Table */}
         <div className="bg-gray-900 shadow-xl rounded-lg overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-800">
                 <tr>
                   <th className="p-4 font-semibold">Source</th>
                   <th className="p-4 font-semibold">Amount</th>
                   <th className="p-4 font-semibold">Date</th>
                   <th className="p-4 font-semibold text-center">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {incomes.map((income) => (
                   <tr key={income._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                     <td className="p-4">{income.source}</td>
                     <td className="p-4 text-green-400 font-medium">₹{income.amount.toFixed(2)}</td>
                     <td className="p-4 text-gray-400">{formatDate(income.date)}</td>
                     <td className="p-4 flex justify-center items-center space-x-2">
                       <button 
                         onClick={() => openEditModal(income)} 
                         className="flex items-center text-blue-400 hover:text-blue-300 p-2 rounded-md transition-colors"
                       >
                         <Pencil className="h-4 w-4 mr-1" /> Edit
                       </button>
                       <button 
                         onClick={() => handleDeleteIncome(income._id)} 
                         className="flex items-center text-red-500 hover:text-red-400 p-2 rounded-md transition-colors"
                       >
                         <Trash2 className="h-4 w-4 mr-1" /> Delete
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
              {incomes.length === 0 && (
                 <p className="text-center text-gray-400 p-8">No income records found. Add one to get started!</p>
             )}
           </div>
         </div>
       </div>

       {/* Add Income Modal */}
       {isAddModalOpen && (
         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
           <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md">
             <h2 className="text-2xl font-bold mb-6">Add New Income</h2>
             <div className="space-y-4">
               <select
                 name="source"
                 value={newIncome.source}
                 onChange={(e) => handleInputChange(e, 'add')}
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 <option value="">Select Income Source</option>
                 {allowedSources.map(source => (
                   <option key={source} value={source}>{source}</option>
                 ))}
               </select>
               <input
                 type="number"
                 name="amount"
                 value={newIncome.amount}
                 onChange={(e) => handleInputChange(e, 'add')}
                 placeholder="Amount"
                 step="0.01"
                 min="0"
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
               <input
                 type="date"
                 name="date"
                 value={newIncome.date}
                 onChange={(e) => handleInputChange(e, 'add')}
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
             </div>
             <div className="flex justify-end mt-6 space-x-4">
               <button 
                 onClick={() => setAddModalOpen(false)} 
                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold"
                 disabled={addLoading}
               >
                 Cancel
               </button>
               <button 
                 onClick={handleAddIncome} 
                 className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold flex items-center"
                 disabled={addLoading}
               >
                 {addLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
                 Save
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Edit Income Modal */}
       {isEditModalOpen && editingIncome && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
           <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md">
             <h2 className="text-2xl font-bold mb-6">Edit Income</h2>
             <div className="space-y-4">
               <select
                 name="source"
                 value={editingIncome.source}
                 onChange={(e) => handleInputChange(e, 'edit')}
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 <option value="">Select Income Source</option>
                 {allowedSources.map(source => (
                   <option key={source} value={source}>{source}</option>
                 ))}
               </select>
               <input
                 type="number"
                 name="amount"
                 value={editingIncome.amount}
                 onChange={(e) => handleInputChange(e, 'edit')}
                 placeholder="Amount"
                 step="0.01"
                 min="0"
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
               <input
                 type="date"
                 name="date"
                 value={editingIncome.date}
                 onChange={(e) => handleInputChange(e, 'edit')}
                 className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
             </div>
             <div className="flex justify-end mt-6 space-x-4">
               <button 
                 onClick={() => setEditModalOpen(false)} 
                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold"
                 disabled={editLoading}
               >
                 Cancel
               </button>
               <button 
                 onClick={handleUpdateIncome} 
                 className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold flex items-center"
                 disabled={editLoading}
               >
                 {editLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
                 Update
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
};

export default Income;