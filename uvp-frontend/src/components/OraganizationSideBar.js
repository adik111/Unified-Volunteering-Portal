"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CgProfile } from 'react-icons/cg';
import { FaTasks } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { FaCertificate } from 'react-icons/fa';
import { useName } from '@/context/NameContext';

export default function OraganizationSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const SideBarContent = [
    { name: "Profile", path: "/ngo", icon: <CgProfile /> },
    { name: "Tasks", path: "/ngo/tasks", icon: <FaTasks /> },
    { name: "Volunteers", path: "/ngo/volunteers", icon: <FaFileAlt /> },
    { name: "Submissions", path: "/ngo/submissions", icon: <FaFileAlt /> },
    { name: "Reports", path: "/ngo/reports", icon: <FaCertificate /> },
  ]

  const { name } =useName();

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex ml-2 md:ml-14 lg:ml-14 items-center">
                <img src="/images/logo.jpg" className="h-8 mr-3" alt="UVP Logo" />
                
              </Link>
            </div>

            {/* User name */}
            <div className="flex items-center">
              <Link href="/" className="text-gray-700 font-medium">Logout</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {SideBarContent.map((content, index) => (
              <li key={index}>
                <Link 
                  href={content.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    pathname === content.path 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 text-lg transition-colors duration-200 ${
                    pathname === content.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {content.icon}
                  </span>
                  <span className="font-medium">{content.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
