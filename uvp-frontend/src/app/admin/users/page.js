"use client";

import { useEffect, useMemo, useState } from "react";
import { getRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaSearch, FaUserSlash, FaUserCheck, FaTrash, FaUser } from "react-icons/fa";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const pageTitle = "User Management";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getRequest("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res?.data) ? res.data : []);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.phone, u.location].some((x) => String(x || "").toLowerCase().includes(q))
    );
  }, [users, query]);

  const toggleBlock = (id) => {
    // Placeholder UI toggle. Replace with PUT/POST when backend supports.
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" } : u)));
  };

  const removeUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const resetPassword = (id) => {
    alert(`Password reset initiated for user #${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, location"
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 text-red-600 flex items-center justify-center"
          >
            <FaUserSlash className="mr-2" /> {error}
          </motion.div>
        )}
        
        {loading && (
          <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {!loading && !error && filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 text-center text-gray-500"
          >
            <FaUser className="mx-auto text-4xl mb-3 text-indigo-300" />
            <p className="text-lg">No users found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </motion.div>
        )}
        
        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50 text-indigo-700">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Name</th>
                  <th className="text-left px-6 py-4 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 font-semibold">Phone</th>
                  <th className="text-left px-6 py-4 font-semibold">Location</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                {filtered.map((u, index) => (
                  <motion.tr 
                    key={index} 
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredRow(u.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${hoveredRow === u.id ? 'bg-indigo-50' : ''} transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 font-medium text-indigo-700">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.phone || '-'}</td>
                    <td className="px-6 py-4">{u.location || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-end">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeUser(u.id)} 
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 flex items-center transition-all hover:bg-red-200"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}


