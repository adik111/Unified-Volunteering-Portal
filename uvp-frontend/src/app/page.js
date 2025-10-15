"use client"
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaHandsHelping, FaUsers, FaBuilding } from 'react-icons/fa'

export default function UVSHomePage() {
  return (
    <>
      <Head>
        <title>UVS - Unified Volunteering System</title>
        <meta
          name="description"
          content="Connect volunteers with opportunities to make a difference"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center sm:justify-start"
            >
              <img
                className="w-36 md:w-48 lg:w-52 h-auto object-contain"
                src="images/logo.png"
                alt="UVS Logo"
              />
            </motion.div>
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-3 sm:gap-6 mt-4 sm:mt-0"
            >
              <Link href={"/auth/login"}>
                <motion.span 
                  className="text-gray-700 font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Volunteer Login
                </motion.span>
              </Link>
              <Link href={"/ngoauth/login"}>
                <motion.span 
                  className="bg-indigo-600 text-white font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Organization Login
                </motion.span>
              </Link>
            </motion.nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Section - Text */}
            <motion.div 
              className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="flex justify-center lg:justify-start"
              >
                <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full">Make a difference today</span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                Unified <span className="text-indigo-600">Volunteering</span> Portal
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                Connect with meaningful volunteer opportunities and make a positive impact in your community. Join our network of passionate volunteers and organizations.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
              >
                <Link href={"/auth/register"}>
                  <motion.button 
                    className="px-5 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started <FaArrowRight />
                  </motion.button>
                </Link>
                <Link href={"/about"}>
                  <motion.button 
                    className="px-5 sm:px-6 py-3 rounded-lg border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Section - Image */}
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -z-10 w-60 sm:w-72 h-60 sm:h-72 bg-indigo-100 rounded-full blur-3xl opacity-70 -top-10 -right-10"></div>
                <img
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain relative z-10"
                  src="images/person.png"
                  alt="Volunteer Illustration"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto px-2">Our platform connects volunteers with organizations to create meaningful impact</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <motion.div 
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-indigo-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <FaUsers className="text-xl sm:text-2xl text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">For Volunteers</h3>
                <p className="text-sm sm:text-base text-gray-600">Discover opportunities that match your skills and interests. Make a difference in your community.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-indigo-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <FaBuilding className="text-xl sm:text-2xl text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">For Organizations</h3>
                <p className="text-sm sm:text-base text-gray-600">Post volunteer opportunities and connect with passionate individuals ready to support your cause.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md mx-auto sm:mx-0 sm:col-span-2 md:col-span-1 max-w-sm sm:max-w-none"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-indigo-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <FaHandsHelping className="text-xl sm:text-2xl text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Community Impact</h3>
                <p className="text-sm sm:text-base text-gray-600">Together, we create positive change through coordinated volunteer efforts and community engagement.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
