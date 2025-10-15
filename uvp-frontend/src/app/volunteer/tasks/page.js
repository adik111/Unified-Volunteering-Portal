"use client";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { useState, useEffect } from "react";
import { postRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaTasks, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function TasksPage() {
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("open");

  const fetchTasks = async (status = "OPEN") => {
    try {
      setLoading(true);
      const response = await postRequest(
        `/volunteer/tasks/${status}`,
        {}
      );
      setTasks(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "open", label: "Open Tasks", status: "OPEN", icon: <FaTasks className="mr-1" /> },
    // { id: "applied", label: "Applied", status: "APPLIED" },
    { id: "closed", label: "Closed", status: "CLOSED", icon: <FaCheckCircle className="mr-1" /> }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if(tabId!="applied"){
      const tab = tabs.find(t => t.id === tabId);
      if (tab) {
        fetchTasks(tab.status);
      }
    }
  };

  useEffect(() => {
    fetchTasks("OPEN");
  }, []);

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
            <p className="text-indigo-100 mt-1">Manage your volunteer opportunities and applications.</p>
            <div className="mt-3 inline-flex items-center gap-2 text-indigo-100 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
              {loading ? 'Loading…' : `${tasks.length} ${activeTab === 'open' ? 'open' : 'closed'}`}
            </div>
          </div>
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
              key={task.taskId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="w-full"
            >
              <TiltCard
                image={task.imageUrl}
                title={task.title}
                className="w-full max-w-sm"
                threshold={8}
              >
                <div className="space-y-3">
                  {/* Task Details */}
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'OPEN' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500"> Posted{" "}
                      {Math.floor((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60))} h ago</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">📅</span>
                      <span>{new Date(task.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">👥</span>
                      <span>{task.capacity} volunteers needed</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href={`/volunteer/tasks/${task.taskId}`}
                      className="block w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold text-center hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </Link>
                  </motion.div>
                </div>
              </TiltCard>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Empty State */}
      {tasks.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 mx-auto mb-6 bg-indigo-50 rounded-full flex items-center justify-center"
          >
            <FaTasks className="text-indigo-500 text-6xl" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No tasks found</h2>
          <p className="text-gray-600 mb-8">
            {activeTab === "open" 
              ? "No open tasks available at the moment." 
              : `No ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} tasks.`}
          </p>
          {activeTab === "open" && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Contact Us
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Call to Action - only show for open tasks */}
      {activeTab === "open" && tasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-6">Contact us to suggest new volunteer opportunities or get personalized recommendations.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
