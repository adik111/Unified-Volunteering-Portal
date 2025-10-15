"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TiltCard from "@/components/TiltCard";
import { postRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaPlus, FaTasks, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function NGOTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("open");

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const tabs = [
    { id: "open", label: "Open Tasks", status: "OPEN", icon: <FaTasks /> },
    { id: "closed", label: "Closed Tasks", status: "CLOSED", icon: <FaCheckCircle /> }
  ];

  const fetchTasks = async (status = "OPEN") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await postRequest(`/organization/tasks/${status}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data || []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      fetchTasks(tab.status);
    }
  };

  const handleCloseTask = async (taskId) => {
    // Confirmation dialog
    if (!confirm("Are you sure you want to close this task?")) {
      return;
    }

    try {
      const res = await postRequest("/organization/task/close/"+taskId );
      
      if (res.status === 200 || res.status === 201) {
        alert("Task closed successfully!");
        const currentTab = tabs.find(t => t.id === activeTab);
        if (currentTab) {
          fetchTasks(currentTab.status);
        }
      } else {
        alert("Failed to close task. Please try again.");
      }
    } catch (err) {
      console.error("Error closing task:", err);
      alert("Failed to close task. Please try again.");
    }
  };

  if (error) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-8 rounded-lg bg-red-50 text-red-600 border border-red-200 shadow-md"
    >
      <FaExclamationCircle className="mr-2 text-xl" />
      <span className="font-medium">{error}</span>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-black/10 rounded-full blur-2xl" />
        <motion.div 
          className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Tasks</h1>
            <p className="text-indigo-100 mt-1">Manage your posted volunteering tasks</p>
            <div className="mt-3 inline-flex items-center gap-2 text-indigo-100 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
              {tasks.length} {activeTab === 'open' ? 'open' : 'closed'}
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/ngo/tasks/create" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors shadow-md backdrop-blur">
              <FaPlus className="mr-2" /> Create New Task
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-2"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Tasks Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="w-full max-w-sm bg-white rounded-2xl p-6 shadow animate-pulse"
            >
              <div className="h-6 w-2/3 bg-indigo-100 rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-4 w-1/2 bg-indigo-50 rounded" />
                <div className="h-4 w-1/3 bg-indigo-50 rounded" />
                <div className="h-4 w-2/5 bg-indigo-50 rounded" />
              </div>
              <div className="h-10 w-full bg-indigo-100 rounded" />
            </motion.div>
          ))
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.taskId || task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="w-full"
            >
              <TiltCard
                image={task.imageUrl || '/placeholder-task.jpg'}
                title={task.title}
                className="w-full max-w-sm h-full flex flex-col"
                threshold={8}
              >
                <div className="space-y-3 flex-grow">
                  {/* Task Details */}
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      task.status === 'OPEN' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'OPEN' ? 'bg-green-600' : 'bg-gray-500'}`} />
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {task.appliedCount || 0} applicants
                    </span>
                  </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>Start: {formatDate(task.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>End: {formatDate(task.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👥</span>
                    <span>Capacity: {task.capacity ?? "-"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 mt-4">
                {task.status === "OPEN" && (
                  <Link 
                    href={`/ngo/tasks/edit/${task.taskId }`}
                    className="block w-full border border-indigo-600 text-indigo-700 py-2.5 px-4 rounded-xl font-semibold text-center hover:bg-indigo-50 transition-all duration-200"
                  >
                    Edit Task
                  </Link>
                )}
                  <Link 
                    href={`/ngo/tasks/${task.taskId }`}
                    className="block w-full bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold text-center hover:bg-indigo-700 transition-all duration-200"
                  >
                    View Public
                  </Link>
                  {task.status === "OPEN" && (
                    <button 
                      onClick={() => handleCloseTask(task.taskId)}
                      className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                    >
                      Close Task
                    </button>
                  )}
                </div>
              </div>
            </TiltCard>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Empty State */}
      {tasks.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-28 h-28 mx-auto mb-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
            <FaTasks size={36} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No tasks found</h2>
          <p className="text-gray-600 mb-8">
            {activeTab === "open" 
              ? "No open tasks yet. Create your first task to get started." 
              : "No closed tasks yet."}
          </p>
          {activeTab === "open" && (
            <Link 
              href="/ngo/tasks/create"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FaPlus className="inline mr-2" /> Create Your First Task
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}


