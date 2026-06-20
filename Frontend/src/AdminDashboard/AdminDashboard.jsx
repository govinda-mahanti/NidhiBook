import { useState, useEffect } from "react";
import {BASE_URL} from '../config/urlconfig'

const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const avatarBgs = [
  "bg-violet-800 text-violet-300",
  "bg-sky-800 text-sky-300",
  "bg-emerald-800 text-emerald-300",
  "bg-rose-800 text-rose-300",
  "bg-amber-800 text-amber-300",
  "bg-indigo-800 text-indigo-300",
];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // Read token from localStorage — adjust the key to match your auth setup
  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // GET /api/users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching users with token:", token);
        const res = await fetch(`${BASE_URL}/api/users`, {
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // DELETE /api/user/:id
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeleteModal(null);
      showToast("User removed successfully.");
    } catch (err) {
      setDeleteModal(null);
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white tracking-tight">User Management</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {loading ? "Loading..." : `${users.length} total users`}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
          className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition disabled:opacity-40"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="px-5 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {/* Loading skeleton */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
                      <div className="h-3 w-28 bg-zinc-800 rounded" />
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="h-3 w-40 bg-zinc-800 rounded" />
                  </td>
                  <td className="px-5 py-4" />
                </tr>
              ))}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-sm text-red-400">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-sm text-zinc-600">
                  No users found.
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading &&
              !error &&
              filtered.map((user, i) => (
                <tr key={user._id} className="hover:bg-zinc-900/40 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarBgs[i % avatarBgs.length]}`}>
                        {getInitials(user.name || "?")}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">{user.name}</p>
                        <p className="text-xs text-zinc-500 sm:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setDeleteModal(user)}
                      className="text-xs text-zinc-600 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-medium opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Delete user?</h3>
            <p className="text-sm text-zinc-400 mb-5">
              <span className="text-zinc-200 font-medium">{deleteModal.name}</span> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm border border-zinc-700 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors font-medium disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal._id)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Deleting…
                  </>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-3 rounded-xl">
          <span className={`text-base ${toast.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
            {toast.type === "error" ? "✕" : "✓"}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}