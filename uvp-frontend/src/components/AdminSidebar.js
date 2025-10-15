"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CgProfile } from 'react-icons/cg';
import { FaTasks } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { FaCertificate } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useName } from '@/context/NameContext';

export default function AdminSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const SideBarContent = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Tasks", path: "/admin/tasks", icon: <FaTasks /> },
    { name: "Submissions", path: "/admin/submissions", icon: <FaFileAlt /> },
    { name: "Certificates", path: "/admin/certificates", icon: <FaCertificate /> },
    { name: "Profile", path: "/admin/profile", icon: <CgProfile /> },
  ]

  const { name } = useName();

  return (
    <div>
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm"
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
                className="inline-flex items-center p-2 text-sm text-indigo-600 rounded-lg sm:hidden hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                  className="h-10 w-auto mr-3" 
                  alt="UVP Logo" 
                />
              </Link>
            </div>

            {/* User name */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center gap-2 text-indigo-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all">
                <span>Logout</span>
                <FaSignOutAlt />
              </Link>
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
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {SideBarContent.map((content, index) => (
              <motion.li 
                key={index}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link 
                  href={content.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    pathname === content.path 
                      ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <span className={`mr-3 text-lg transition-colors duration-200 ${
                    pathname === content.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-400'
                  }`}>
                    {content.icon}
                  </span>
                  <span className="font-medium">{content.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </div>
  )
}
