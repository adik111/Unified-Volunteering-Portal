"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, putRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaImage } from "react-icons/fa";

export default function AdminViewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const { submissionId } = params || {};

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`/admin/submission/${submissionId}`);
      const data = res?.data;
      if (data) {
        setSubmission({
          submissionId: data.submissionId ?? submissionId,
          volunteerName: data.volunteerName ?? data.userName ?? "",
          volunteerEmail: data.volunteerEmail ?? data.email ?? "",
          volunteerPhone: data.volunteerPhone ?? "",
          taskTitle: data.taskTitle ?? data.taskName ?? "",
          submittedAt: data.submittedAt ?? data.submittedDate ?? data.createdAt,
          status: data.status,
          proofFileUrl: data.proofFileUrl ?? data.fileUrl ?? "",
        });
      } else {
        setSubmission(null);
        setError("Submission not found");
      }
    } catch (e) {
      console.error(e);
      setSubmission(null);
      setError("Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submissionId) fetchSubmission();
  }, [submissionId]);

  const handleApprove = async () => {
    try {
      const confirmIssue = window.confirm("Approve this submission?");
      if (!confirmIssue) return;
      setApproving(true);
      await putRequest(`/admin/update-submission/${submissionId}`, {});
      alert("Submission approved successfully");
      router.push("/admin/submissions");
    } catch (e) {
      console.error(e);
      alert("Failed to approve submission");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Submission Details</h1>
        <p className="text-gray-600">Review volunteer submission information</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-6"
      >
        <motion.button 
          onClick={() => router.back()} 
          className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaArrowLeft className="text-sm" /> Back to Submissions
        </motion.button>
      </motion.div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 flex flex-col items-center justify-center"
        >
          <FaSpinner className="text-indigo-600 text-3xl animate-spin mb-4" />
          <p className="text-gray-600">Loading submission details...</p>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 flex flex-col items-center justify-center text-red-600"
        >
          <FaExclamationTriangle className="text-3xl mb-4" />
          <p>{error}</p>
        </motion.div>
      )}

      {!loading && !error && submission && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div 
            className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-indigo-50"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center gap-2">
              <FaImage className="text-indigo-600" /> Submitted Image
            </h2>
            {submission.proofFileUrl ? (
              <motion.img 
                src={submission.proofFileUrl} 
                alt="Submission" 
                className="w-full rounded-xl border border-indigo-100 shadow-sm" 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            ) : (
              <div className="text-gray-500 p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <FaImage className="text-gray-400 text-4xl mb-3" />
                <p>No image available</p>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 space-y-5 border border-indigo-50"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <div className="text-sm font-medium text-indigo-600 mb-1">Volunteer</div>
              <div className="text-gray-900 font-medium text-lg">{submission.volunteerName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-indigo-600 mb-1">Task</div>
              <div className="text-gray-900 font-medium text-lg">{submission.taskTitle}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-indigo-600 mb-1">Submitted At</div>
              <div className="text-gray-900 font-medium">{formatDate(submission.submittedAt)}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm font-medium text-indigo-600 mb-1">Email</div>
                <div className="text-gray-900 font-medium break-all">{submission.volunteerEmail}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-indigo-600 mb-1">Phone</div>
                <div className="text-gray-900 font-medium">{submission.volunteerPhone || "Not provided"}</div>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-sm font-medium text-indigo-600 mb-1">Status</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                submission.status === "APPROVED" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {submission.status === "APPROVED" && <FaCheckCircle className="mr-1" />}
                {submission.status}
              </div>
            </div>
            {submission.status !== "APPROVED" && (
              <motion.button
                onClick={handleApprove}
                disabled={approving}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-sm hover:shadow-md disabled:opacity-50 transition-all mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {approving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Approving...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" /> Approve Submission
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}


