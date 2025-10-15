"use client";
import { useState, useEffect } from "react";
import { postRequest } from "@/lib/api";
import TiltCard from "@/components/TiltCard";
import { motion } from "framer-motion";
import { FaUpload, FaHistory, FaFileUpload, FaCheck, FaHourglass, FaTimes } from "react-icons/fa";

export default function SubmissionsPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [tasks, setTasks] = useState([
    {
    title : "",
    applicationId : "",
    }
  ]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
    const response = await postRequest("/volunteer/applications", {}, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchSubmissions = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await postRequest("/volunteer/submissions", {}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setSubmissions(response.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "upload", label: "Upload Proof" },
    { id: "history", label: "Submission History" }
  ];

  useEffect(() => {
    fetchTasks();
    fetchSubmissions();
  }, []);


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedTask) {
      alert("Please select a task and upload a file before submitting.");
      return;
    }

    try {
    setIsSubmitting(true);
    console.log(selectedTask, selectedFile);
    const formData = new FormData();
    formData.append("applicationId", selectedTask);
    formData.append("file", selectedFile);

    const response = await postRequest("/volunteer/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setIsSubmitting(false);
    alert("Submission successful");
    setSelectedFile(null);
    setSelectedTask("");
    fetchSubmissions();
    fetchTasks();

    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      alert("Submission failed");
      setSelectedFile(null);
      setSelectedTask("");
      fetchSubmissions();
      fetchTasks();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-8 shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-black/10 rounded-full blur-2xl" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Proof Submissions</h1>
          <p className="text-indigo-50 mt-2">Upload evidence of your volunteer work and track your submissions.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-indigo-100 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
            {loading ? 'Loading…' : `${submissions.length} submission${submissions.length === 1 ? '' : 's'}`}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-2"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.id === "upload" ? <FaUpload className="text-sm" /> : <FaHistory className="text-sm" />}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === "upload" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
        {/* Submission Form */}
        <div className="lg:col-span-2">
          <TiltCard
            title="Submit New Proof"
            className="max-w-none"
            threshold={4}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Completed Task
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="" disabled>
                    -- Choose Task --
                  </option>
                  {tasks.map((task) => (
                    <option key={task.applicationId} value={task.applicationId}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Proof (Image/PDF)
                </label>
                <motion.div 
                  whileHover={{ borderColor: "#6366f1" }}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors"
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center"
                    >
                      <FaFileUpload className="text-indigo-600 text-2xl" />
                    </motion.div>
                    <p className="text-gray-600 mb-2">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </label>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !selectedFile || !selectedTask}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaUpload />
                    Submit Proof
                  </span>
                )}
              </motion.button>
            </form>
          </TiltCard>
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >

          {/* Guidelines */}
          <TiltCard
            title="Submission Guidelines"
            className="max-w-none"
            threshold={4}
          >
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p>Upload clear photos or documents showing your volunteer work</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p>Include timestamps or location details when possible</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p>Ensure files are under 10MB and in supported formats</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p>Review will be completed within 2-3 business days</p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
        </motion.div>
      )}

      {/* Submission History Tab */}
      {activeTab === "history" && (
        <div className="max-w-7xl mx-auto">
          <TiltCard
            title="Your Submission History"
            className="max-w-none"
            threshold={4}
          >
            {loading ? (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex items-center justify-center py-16"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-gray-600">Loading submissions...</span>
                 </div>
               </motion.div>
             ) : submissions.length === 0 ? (
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
                   <FaFileUpload className="text-indigo-500 text-6xl" />
                 </motion.div>
                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">No submissions yet</h2>
                 <p className="text-gray-600 mb-8">Upload your first proof of completion to get started!</p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setActiveTab("upload")}
                   className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                 >
                   <span className="flex items-center gap-2">
                     <FaUpload />
                     Upload Proof
                   </span>
                 </motion.button>
               </motion.div>
            ) : (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="space-y-4"
               >
                 {submissions.map((submission, index) => (
                   <motion.div 
                     key={submission.id} 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                   >
                     <div className="flex items-center justify-between">
                       <div className="flex-1">
                         <h3 className="text-lg font-semibold text-gray-800">{submission.taskTitle}</h3>
                         <p className="text-sm text-gray-600 mt-1">
                           Submitted on {new Date(submission.submittedDate).toLocaleDateString()}
                         </p>
                         <p className="text-sm text-gray-500 mt-1">
                           File: {submission.fileName}
                         </p>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                           submission.status === "Approved" 
                             ? "bg-indigo-100 text-indigo-700"
                             : submission.status === "Under Review"
                             ? "bg-amber-100 text-amber-700"
                             : "bg-red-100 text-red-700"
                         }`}>
                           {submission.status === "Approved" ? <FaCheck size={12} /> : 
                            submission.status === "Under Review" ? <FaHourglass size={12} /> : 
                            <FaTimes size={12} />}
                           {submission.status}
                         </span>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
            )}
          </TiltCard>
        </div>
      )}
    </motion.div>
  );
}
