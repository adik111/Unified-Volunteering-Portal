"use client";
import { useName } from "@/context/NameContext";
import { postRequest } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaCog, FaSignOutAlt, FaMedal, FaTasks, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    completedTasks: 0,
    certificatesEarned: 0,
    bio: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { setName } = useName();
  const router = useRouter();

  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return false;
    }
    return true;
  };

  const getProfile = async () => {
     if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    try {
      const response = await postRequest(
        "/volunteer/profile",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

    let data = response.data;

    setName(data.name);
    setUser(data);

     } catch (error) {
      console.error("Error fetching profile:", error);
      router.push("/");
    }
  }

  useEffect(() => {
    const authStatus = verifyToken();
    setIsAuthenticated(authStatus);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaUser className="mr-2" /> },
    { id: "settings", label: "Settings", icon: <FaCog className="mr-2" /> }
  ];

  const handleLogOut =(e)=>{
    localStorage.removeItem("token");
    router.push("/");
  }
  
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    try {
      const token = localStorage.getItem("token");
      const response = await postRequest("/volunteer/profile/edit", data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white border-4 border-white/30">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-400 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          </motion.div>

          {/* User Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start mb-1">
              <FaEnvelope className="mr-2 text-indigo-200" />
              <p className="text-indigo-100 text-lg">{user.email}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <FaMapMarkerAlt className="mr-2 text-indigo-200" />
              <p className="text-indigo-200 text-sm">{user.location}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg flex items-center justify-center"
              onClick={handleLogOut}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-2"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
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
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About Me</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{user.bio}</p>


          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
            <div className="space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    name="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={user.phone}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={user.location}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  defaultValue={user.bio}
                  rows={4}
                  name="bio"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Save Changes
                </button>
                <button type="button" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
