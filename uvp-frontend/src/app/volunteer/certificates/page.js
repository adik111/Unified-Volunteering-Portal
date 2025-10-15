"use client";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaMedal, FaDownload } from "react-icons/fa";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getRequest("/volunteer/certification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res && res.data) {
          setCertificates(res.data);
        } else {
          console.error("Failed to fetch certificates");
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const downloadPDF = async (cert) => {
    try {
      console.log("Downloading cert:", cert);
  
      const response = await getRequest(
        `/volunteer/certificates/download/${cert.userId}/${cert.taskId}`,
        {
          responseType: "blob",
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate-${cert.taskName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err.response?.data || err.message);
    }
  };
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  return (
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
          <h1 className="text-3xl md:text-4xl font-bold text-white">Certificates</h1>
          <p className="text-indigo-50 mt-2">View and download your earned certificates.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-indigo-100 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
            {certificates.length} total certificates
          </div>
        </div>
      </motion.div>

      <div className="p-2">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow animate-pulse"
              >
                <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />
                <div className="w-28 h-28 bg-gray-200 rounded mb-6" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </motion.div>
            ))}
          </motion.div>
        ) : certificates.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-28 h-28 mx-auto mb-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner"
            >
              <FaMedal className="text-5xl" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No certificates yet</h2>
            <p className="text-gray-600 mb-6">Complete tasks and submit proofs to earn certificates.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.certificateId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-2xl p-6 shadow border border-gray-100 hover:shadow-xl transition duration-200"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-indigo-50 opacity-0 group-hover:opacity-100 transition" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Certificate
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{cert.taskName}</h2>
                  <p className="text-sm text-gray-500 mb-4">Issued on {formatDate(cert.issueDate)}</p>

                  {cert.qrCode && (
                    <div className="mb-5">
                      <img
                        src={`data:image/png;base64,${cert.qrCode}`}
                        alt="QR Code"
                        className="w-28 h-28 border p-1 rounded-md shadow-sm transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadPDF(cert)}
                    className="relative inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-md transition"
                  >
                    <FaDownload size={16} />
                    Download PDF
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Certificates;
