"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequest, putRequest } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("under_review");
  const [hoveredRow, setHoveredRow] = useState(null);

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
      const endpoint = tab === "approved" ? "/admin/submissions/approved" : "/admin/submissions/pending";
      const res = await getRequest(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = Array.isArray(res?.data) ? res.data : [];
      setSubmissions(data.map((s) => ({
        submissionId: s.submissionId ?? s.id,
        userName: s.userName ?? s.volunteerName ?? s.volunteer ?? "",
        taskName: s.taskName ?? s.taskTitle ?? s.task ?? "",
        submittedAt: s.submittedAt ?? s.submittedDate ?? s.createdAt,
        status: s.status ?? (tab === "approved" ? "APPROVED" : "UNDER_REVIEW"),
      })));
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

  const handleApprove = async (submissionId) => {
    try {
      const confirmIssue = window.confirm("Approve this submission?");
      if (!confirmIssue) return;
      const token = localStorage.getItem("token");
      await putRequest(`/organization/update-submission/${submissionId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchSubmissions(activeTab);
    } catch (e) {
      console.error(e);
      alert("Failed to approve submission");
    }
  };

  const tabs = [
    { id: "under_review", label: "Under Review", status: "UNDER_REVIEW", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) },
    { id: "approved", label: "Approved", status: "APPROVED", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ) },
  ];

  const filteredSubmissions = submissions || [];

  const getStatusColor = (status) => {
    switch(status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusDot = (status) => {
    switch(status) {
      case "APPROVED":
        return "bg-emerald-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Submission Management</h1>
        <p className="text-gray-600">Review volunteer submissions and issue certificates</p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-indigo-100"
      >
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab,index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
              }`}
            >
              <span className="flex items-center justify-center w-5 h-5">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              <span className="ml-1 flex items-center justify-center bg-white text-indigo-600 bg-opacity-20 text-xs rounded-full w-5 h-5">
                {activeTab === tab.id ? filteredSubmissions.length : ""}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden"
      >
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50 text-indigo-900">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-6 py-4 font-semibold">Task</th>
                  <th className="text-left px-6 py-4 font-semibold">Submitted</th>
                  <th className="text-left px-6 py-4 font-semibold">Status</th>
                  <th className="text-center px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s, idx) => (
                  <motion.tr 
                    key={idx} 
                    className={`border-t border-indigo-50 transition-all duration-200 ${hoveredRow === idx ? 'bg-indigo-50' : idx % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * idx }}
                  >
                    <td className="px-6 py-4 font-medium text-indigo-900">{s.userName}</td>
                    <td className="px-6 py-4 text-gray-700">{s.taskName}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(s.submittedAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(s.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(s.status)}`} />
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            href={`/admin/submissions/${s.submissionId}`} 
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner text-3xl">
                          {activeTab === 'approved' ? '✓' : '📋'}
                        </div>
                        <div className="text-xl font-medium text-indigo-900">No {activeTab === 'approved' ? 'approved' : 'under review'} submissions</div>
                        <div className="text-gray-500 max-w-sm text-center">
                          {activeTab === 'approved' 
                            ? 'Approved submissions will appear here once you review and approve them' 
                            : 'You will see user proofs here once they are submitted for review'}
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}


