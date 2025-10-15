"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CgProfile } from 'react-icons/cg';
import { FaTasks, FaFileAlt, FaCertificate, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useName } from '@/context/NameContext';

export default function UserSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const SideBarContent = [
    { name: "Profile", path: "/volunteer/profile", icon: <CgProfile /> },
    { name: "Tasks", path: "/volunteer/tasks", icon: <FaTasks /> },
    { name: "My Applications", path: "/volunteer/applied", icon: <FaClipboardList /> },
    { name: "Submissions", path: "/volunteer/submissions", icon: <FaFileAlt /> },
    { name: "Certificates", path: "/volunteer/certificates", icon: <FaCertificate /> },
  ]

  const { name } = useName();

  return (
    <div>
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 z-50 w-full bg-white border-b border-indigo-100 shadow-lg backdrop-blur-sm"
      >
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile sidebar toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-indigo-600 rounded-lg sm:hidden hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </motion.button>

              {/* Logo */}
              <Link href="/" className="flex ml-2 md:ml-14 lg:ml-14 items-center">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src="/images/logo.png" 
                  className="h-10 w-auto md:h-12 mr-3" 
                  alt="UVP Logo" 
                />
              </Link>
            </div>

            {/* User name */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <span className="text-indigo-700 font-medium px-4 py-2 bg-indigo-50 rounded-full shadow-sm">
                Welcome, {name}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-indigo-900 bg-opacity-30 backdrop-blur-sm sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-indigo-100 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {SideBarContent.map((content, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link 
                  href={content.path} 
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                      pathname === content.path 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-500 shadow-sm' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'
                    }`}
                  >
                    <span className={`mr-3 text-lg transition-colors duration-200 ${
                      pathname === content.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                    }`}>
                      {content.icon}
                    </span>
                    <span className="font-medium">{content.name}</span>
                  </motion.div>
                </Link>
              </motion.li>
            ))}
            
           
          </ul>
        </div>
      </motion.aside>

      {/* Main content wrapper */}
      <div className="p-4 sm:ml-64 pt-20">
        {/* Page content will be rendered here */}
      </div>
    </div>
  )
}
