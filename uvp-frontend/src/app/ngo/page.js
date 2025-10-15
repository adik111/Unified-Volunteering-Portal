"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { postRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaPhone, FaEdit, FaFileAlt } from "react-icons/fa";

export default function NGOProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    type: "",
    address: "",
    contact: "",
    description: "",
    image: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await postRequest("/organization/get",{},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setProfile(res.data);
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="border-b border-gray-200 pb-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Organization Profile</h1>
        <p className="text-gray-600">Manage your organization information</p>
      </motion.div>

      {/* Profile Information */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Organization Image */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center shadow-md border-2 border-indigo-100">
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt={profile.name}
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <FaBuilding className="text-4xl text-indigo-400" />
              )}
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                {loading ? "Loading..." : profile.name}
                {!loading && <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                  {profile.type?.toLowerCase().replace('_', ' ')}
                </span>}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaEnvelope className="text-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-800 font-medium">{loading ? "..." : profile.email}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaPhone className="text-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Contact</label>
                    <p className="text-gray-800 font-medium">{loading ? "..." : profile.contact}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="md:col-span-2 bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-800 font-medium">{loading ? "..." : profile.address}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="md:col-span-2 bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaFileAlt className="text-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-gray-800">{loading ? "..." : profile.description}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-3 justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/ngo/profile/edit" 
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md" 
                disabled={loading}
              >
                <FaEdit />
                <span>Edit Profile</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


