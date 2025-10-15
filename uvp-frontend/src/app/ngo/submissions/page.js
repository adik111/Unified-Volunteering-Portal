"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFileAlt, FaCheckCircle, FaHourglassHalf, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { getRequest } from "@/lib/api";

export default function NGOAllSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("under_review");

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const fetchSubmissions = async (tab) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = tab === "approved" ? "/organization/submission/approved" : "/organization/submission/in-process";
      const res = await getRequest(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = res?.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setSubmissions(data);
      }
      setError(null);
    } catch (e) {
      console.error(e);
      setSubmissions([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: "under_review", label: "Under Review", status: "UNDER_REVIEW", icon: <FaHourglassHalf /> },
    { id: "approved", label: "Approved", status: "APPROVED", icon: <FaCheckCircle /> },
  ];

  const filteredSubmissions = submissions || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-black/10 rounded-full blur-2xl" />
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
            <FaFileAlt className="text-indigo-200" />
            Submissions
          </h1>
          <p className="text-indigo-100 mt-1">Review user proofs and issue certificates</p>
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-indigo-600 font-medium">Loading submissions...</span>
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 text-red-600 flex items-center gap-2"
        >
          <FaExclamationTriangle />
          {error}
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 overflow-x-auto"
        >
          <table className="min-w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-50/80">
                <th className="px-5 py-3 font-semibold text-gray-700">User</th>
                <th className="px-5 py-3 font-semibold text-gray-700">Task</th>
                <th className="px-5 py-3 font-semibold text-gray-700">Submitted</th>
                <th className="px-5 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-5 py-3 font-semibold text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((s, idx) => (
                <motion.tr 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/60 transition-colors"
                >
                  <td className="px-5 py-3 text-gray-900 font-medium">{s.userName}</td>
                  <td className="px-5 py-3 text-gray-800">{s.taskName}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatDate(s.submittedAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      s.status === "APPROVED"
                        ? "bg-indigo-100 text-indigo-700"
                        : s.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.status === "APPROVED" ? "bg-indigo-600" : s.status === "REJECTED" ? "bg-red-600" : "bg-amber-600"
                      }`} />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Link 
                      href={`/ngo/submissions/${s.submissionId ?? s.id}`} 
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                    >
                      <FaSearch className="mr-1.5" size={12} />
                      View
                    </Link>
                  </td>
                </motion.tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                        {activeTab === 'approved' ? <FaCheckCircle size={24} /> : <FaHourglassHalf size={24} />}
                      </div>
                      <div className="text-gray-800 font-medium">No {activeTab === 'approved' ? 'approved' : 'under review'} submissions</div>
                      <div className="text-gray-500 text-sm">You will see user proofs here once they are submitted</div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}



