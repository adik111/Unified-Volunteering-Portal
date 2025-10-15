"use client";
import { postRequest } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaPhone, FaClock, FaArrowLeft, FaClipboardList, FaClipboardCheck, FaExclamationCircle } from 'react-icons/fa';
import { MdHomeWork } from 'react-icons/md';
import { motion } from 'framer-motion';


export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const router = useRouter();

  const [showContact, setShowContact] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await postRequest(`/volunteer/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to load task details");
      if (error.response?.status === 401) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-indigo-600 font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center bg-red-50 p-8 rounded-xl shadow-md border border-red-100 max-w-md">
          <FaExclamationCircle className="mx-auto text-4xl mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!task) return null;


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Back Button */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <motion.button
          onClick={() => router.back()}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </motion.button>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-80 rounded-2xl overflow-hidden shadow-xl"
      >
        <img
          src={task.images}
          alt={task.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-6"
        >
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{task.title}</h1>
            <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
              {task.status}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Organization Info Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <MdHomeWork className="text-2xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{task.organizationHome.name}</h2>
              <p className="text-gray-600">{task.organizationHome.type}</p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowContact(!showContact)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            Contact Info
          </motion.button>
        </div>
        
        {showContact && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-indigo-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <FaPhone className="text-indigo-600" />
              <span>{task.organizationHome.contact}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-indigo-600" />
              <span>{task.organizationHome.address}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Task Details Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaClipboardList className="text-indigo-600" />
            Description
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-700 leading-relaxed"
          >
            {task.description}
          </motion.p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaClipboardCheck className="text-indigo-600" />
            Task Details
          </h2>
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaCalendarAlt className="text-indigo-600" />
              </div>
              <span>
                {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaUsers className="text-indigo-600" />
              </div>
              <span>{task.capacity} volunteers needed</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaClock className="text-indigo-600" />
              </div>
              <span>Posted on {new Date(task.createdAt).toLocaleDateString()}</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Location Map Link */}
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        href={task.locationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:bg-indigo-50 transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <FaMapMarkerAlt className="text-indigo-600 text-xl" />
            </div>
            <span className="font-medium">View Location on Map</span>
          </div>
          <span className="text-indigo-600 font-bold">→</span>
        </div>
      </motion.a>
    </motion.div>
  );
}