"use client";

import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { useEffect, useState } from "react";
import { deleteRequest, postRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaHourglassHalf, FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

export default function VolunteerAppliedTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplied = async (status) => {
    try {
      setLoading(true);
      console.log(status);
      const token = localStorage.getItem("token");
      const res = await postRequest(`/volunteer/get/applications/${status}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res);
      const data = res?.data || [];
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      // On failure, fall back to empty state instead of showing an error banner
      setTasks([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplied(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: "pending", label: "Pending", status: "PENDING", icon: <FaHourglassHalf className="mr-2" /> },
    { id: "approved", label: "Approved", status: "APPROVED", icon: <FaCheck className="mr-2" /> },
    { id: "rejected", label: "Rejected", status: "REJECTED", icon: <FaTimes className="mr-2" /> }
  ];

  const filteredTasks = tasks.filter((t) => {
    const tab = tabs.find((x) => x.id === activeTab);
    if (!tab) return true;
    return t.status === tab.status;
  });

  const handleWithdraw = async (applicationId) => {
    try {
      if (!applicationId) {
        alert('Unable to withdraw: missing application id');
        return;
      }
      const confirmWithdraw = window.confirm('Are you sure you want to withdraw this application?');
      if (!confirmWithdraw) return;
      setWithdrawingId(applicationId);
      const token = localStorage.getItem('token');
      await deleteRequest('/volunteer/application/withdraw/'+applicationId);
      await fetchApplied(activeTab);
    } catch (e) {
      console.error(e);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-black/10 rounded-full blur-2xl" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Applications</h1>
          <p className="text-indigo-50 mt-2">Tasks you have applied to.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-indigo-100 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
            {loading ? 'Loading…' : `${filteredTasks.length} item${filteredTasks.length === 1 ? '' : 's'}`}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-2"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(tab.id)}
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

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex items-center justify-center py-16"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading applications...</span>
            </div>
          </motion.div>
        ) : (
          filteredTasks.map((task,index) => (
            <TiltCard
              key={index}
              image={task.image || task.imageUrl}
              title={task.title}
              className="w-full max-w-sm"
              threshold={8}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    task.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500">Applied</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>Start: {task.startDate ? new Date(task.startDate).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>End: {task.endDate ? new Date(task.endDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>

                <Link 
                  href={`/volunteer/tasks/${task.taskId}`}
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Details
                </Link>

                {(task.status === 'PENDING') && (
                  <button
                    onClick={() => handleWithdraw(task.applicationId)}
                    disabled={withdrawingId === task.applicationId}
                    className={`block w-full mt-2 border border-red-600 text-red-600 py-3 px-4 rounded-lg font-semibold text-center hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {withdrawingId === task.applicationId ? 'Withdrawing...' : 'Withdraw Application'}
                  </button>
                )}
              </div>
            </TiltCard>
          ))
        )}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">📋</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No applications found</h2>
          <p className="text-gray-600 mb-8">
            {activeTab === 'pending' && 'You have no pending applications right now.'}
            {activeTab === 'approved' && 'No approved applications yet.'}
            {activeTab === 'rejected' && 'No rejected applications.'}
          </p>
          <Link 
            href="/volunteer/tasks"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            Browse Tasks
          </Link>
        </div>
      )}
    </motion.div>
    </>
  );
}


