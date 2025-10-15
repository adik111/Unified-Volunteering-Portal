"use client";

import { useEffect, useState } from "react";
import { postRequest, putRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

export default function NGOVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const fetchVolunteers = async (tab) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = tab === "pending" ? "/organization/pending/application" : "/organization/applications/get";
      const res = await postRequest(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      setVolunteers(res.data || []);
      console.log(res.data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers(activeTab);
  }, [activeTab]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      if (!applicationId || !status) return;
      if (status === "REJECTED") {
        const confirmReject = window.confirm("Reject this application?");
        if (!confirmReject) return;
      }
      if (status === "APPROVED") {
        const confirmApprove = window.confirm("Approve this application?");
        if (!confirmApprove) return;
      }
      setActionLoadingId(applicationId);
      await putRequest(`/organization/set/${applicationId}/${status}`);
      await fetchVolunteers(activeTab);
    } catch (e) {
      console.error(e);
      alert(`Failed to update status to ${status}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredVolunteers = volunteers || [];

  const closeModal = () => {
    setShowModal(false);
    setSelectedVolunteer(null);
  };

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
          className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
              <FaUsers className="text-indigo-200" />
              Volunteers
            </h1>
            <p className="text-indigo-100 mt-1">Manage applications and review pending requests</p>
            <div className="mt-3 inline-flex items-center gap-2 text-indigo-100 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
              {volunteers.length} {activeTab === 'pending' ? 'pending' : 'total'}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-2"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Volunteers", icon: <FaUsers /> },
            { id: "pending", label: "Pending Requests", icon: <FaExclamationCircle /> },
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
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

      {loading && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-1 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded col-span-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded col-span-1 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded col-span-1 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded col-span-1 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8 rounded-lg bg-red-50 text-red-600 border border-red-200 shadow-md"
        >
          <FaExclamationCircle className="mr-2 text-xl" />
          <span className="font-medium">{error}</span>
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 overflow-hidden"
        >
          <table className="min-w-full text-sm table-auto">
            <thead>
              {activeTab === "pending" ? (
                <tr className="text-left text-gray-600 bg-indigo-50/80">
                  <th className="px-5 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Email</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Task</th>
                  <th className="px-5 py-3 font-semibold text-gray-700 whitespace-nowrap">Applied Date</th>
                  <th className="px-5 py-3 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              ) : (
                <tr className="text-left text-gray-600 bg-indigo-50/80">
                  <th className="px-5 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Email</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Phone</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Task</th>
                  <th className="px-5 py-3 font-semibold text-gray-700 whitespace-nowrap">Applied Date</th>
                  <th className="px-5 py-3 font-semibold text-gray-700">Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredVolunteers.map((v,index) => (
                activeTab === "pending" ? (
                  <motion.tr 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">{v.name}</td>
                    <td className="px-5 py-3 text-gray-800">{v.email}</td>
                    <td className="px-5 py-3 text-gray-700">{v.taskName}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatDate(v.appliedAt)}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(v.applicationId, "APPROVED")}
                          disabled={actionLoadingId === v.applicationId}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaCheckCircle className="mr-1" />
                          {actionLoadingId === v.applicationId ? "Approving..." : "Approve"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(v.applicationId, "REJECTED")}
                          disabled={actionLoadingId === v.applicationId}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaTimesCircle className="mr-1" />
                          {actionLoadingId === v.applicationId ? "Rejecting..." : "Reject"}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  <motion.tr 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">{v.name}</td>
                    <td className="px-5 py-3 text-gray-700">{v.email}</td>
                    <td className="px-5 py-3 text-gray-700">{v.phone}</td>
                    <td className="px-5 py-3 text-gray-800">{v.taskTitle}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatDate(v.appliedDate)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        v.status === "APPROVED"
                          ? "bg-indigo-100 text-indigo-700"
                          : v.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          v.status === "APPROVED" ? "bg-indigo-600" : v.status === "REJECTED" ? "bg-red-600" : "bg-amber-600"
                        }`} />
                        {v.status}
                      </span>
                    </td>
                  </motion.tr>
                )
              ))}
              {filteredVolunteers.length === 0 && (
                <tr>
                  <td colSpan={activeTab === "pending" ? 5 : 6} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center shadow-inner">👥</div>
                      <div className="text-gray-800 font-medium">No {activeTab === 'pending' ? 'pending applications' : 'volunteers'} yet</div>
                      <div className="text-gray-500 text-sm">Check back later once there are updates</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Volunteer Details Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Volunteer Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Volunteer Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-800 font-medium">{selectedVolunteer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-800">{selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-800">{selectedVolunteer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Applied Date</label>
                    <p className="text-gray-800">{new Date(selectedVolunteer.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Task and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Applied Task</label>
                    <p className="text-gray-800">{selectedVolunteer.taskTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      selectedVolunteer.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : selectedVolunteer.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {selectedVolunteer.status}
                    </span>
                  </div>
                </div>

                {/* Experience and Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                    <p className="text-gray-800">{selectedVolunteer.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Motivation</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedVolunteer.motivation}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                {selectedVolunteer.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedVolunteer.applicationId, "APPROVED")}
                      disabled={actionLoadingId === selectedVolunteer.applicationId}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoadingId === selectedVolunteer.applicationId ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedVolunteer.applicationId, "REJECTED")}
                      disabled={actionLoadingId === selectedVolunteer.applicationId}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoadingId === selectedVolunteer.applicationId ? "Rejecting..." : "Reject"}
                    </button>
                  </>
                )}
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}


