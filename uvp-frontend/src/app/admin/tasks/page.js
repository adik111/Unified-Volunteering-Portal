"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminTasksPage() {
  const [orgTypes, setOrgTypes] = useState([
    "OLDAGE",
    "CHILDREN",
    "NGO",
    "DISABLED",
    "EDUCATION",
    "ORPHANAGE",
    "HEALTH",
    "ENVIRONMENT",
    "OTHER",
  ]);
  const [selectedType, setSelectedType] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchOrganizationsByType = async () => {
      if (!selectedType) {
        setOrganizations([]);
        setSelectedOrgId("");
        setTasks([]);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getRequest(`/admin/organizations?type=${encodeURIComponent(selectedType)}` );
        const data = Array.isArray(res?.data) ? res.data : [];
        setOrganizations(data.map((o) => ({ id: o.orgId ?? o.id, name: o.name ?? o.organizationName ?? `Org ${o.orgId ?? o.id}` })));
        setSelectedOrgId("");
        setTasks([]);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationsByType();
  }, [selectedType]);

  useEffect(() => {
    const fetchTasksForOrg = async () => {
      if (!selectedOrgId) {
        setTasks([]);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const tRes = await getRequest(`/admin/tasks/${selectedOrgId}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = Array.isArray(tRes?.data) ? tRes.data : [];
        const orgName = organizations.find((o) => String(o.id) === String(selectedOrgId))?.name || "";
        setTasks(
          data.map((t) => ({
            id: t.taskId ?? t.id,
            title: t.title,
            ngo: orgName,
            status: t.status,
            capacity: t.capacity,
            startDate: t.startDate,
            endDate: t.endDate,
            description: t.description || "No description available"
          }))
        );
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasksForOrg();
  }, [selectedOrgId, organizations]);

  const getStatusColor = (status) => {
    switch(status) {
      case "OPEN":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CLOSED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Task Management</h1>
        <p className="text-gray-600">Browse and manage volunteer tasks across organizations</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 mb-6"
      >
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">Filter Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Organization Type</label>
            <div className="relative">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)} 
                className="w-full border border-indigo-200 rounded-lg px-4 py-3 bg-indigo-50 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
              >
                <option value="">Select type</option>
                {orgTypes.map((t) => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <div className="relative">
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                disabled={!selectedType || organizations.length === 0}
                className="w-full border border-indigo-200 rounded-lg px-4 py-3 bg-indigo-50 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200"
              >
                <option value="">{!selectedType ? 'Select type first' : (organizations.length ? 'Select organization' : 'No organizations found')}</option>
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
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
                  <th className="text-left px-6 py-4 font-semibold">Task</th> 
                  <th className="text-left px-6 py-4 font-semibold">Organization</th>
                  <th className="text-left px-6 py-4 font-semibold">Capacity</th>
                  <th className="text-left px-6 py-4 font-semibold">Start Date</th>
                  <th className="text-left px-6 py-4 font-semibold">End Date</th>
                  <th className="text-left px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, index) => (
                  <motion.tr 
                    key={t.id} 
                    className={`border-t border-indigo-50 transition-all duration-200 ${hoveredRow === t.id ? 'bg-indigo-50' : index % 2 === 0 ? 'bg-white' : 'bg-indigo-25'}`}
                    onMouseEnter={() => setHoveredRow(t.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-indigo-900">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{t.description}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{t.ngo}</td>
                    <td className="px-6 py-4 text-gray-700">{t.capacity ?? '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{t.startDate ? new Date(t.startDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{t.endDate ? new Date(t.endDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {tasks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="text-xl font-medium text-indigo-900">No tasks to display</p>
                        <p className="text-gray-500 mt-1">Select an organization to view its tasks</p>
                      </div>
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
