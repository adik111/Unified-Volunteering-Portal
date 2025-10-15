"use client";

import React from "react";
import { Users, Heart, Award, Building, Clock, Globe } from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
            {/* Navigation */}
            <div className="container mx-auto pt-6 px-4">
                <Link 
                    href="/" 
                    className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors font-medium"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-90"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            About Unified <span className="text-yellow-300">Volunteering</span> Portal
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl">
                            Connecting passionate volunteers with organizations to create meaningful impact in communities worldwide.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="max-w-3xl text-center">
                            <h2 className="text-3xl font-bold text-green-800 mb-6">Our Mission</h2>
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                The Unified Volunteering Portal bridges the gap between <span className="font-semibold text-green-700">volunteers</span> and <span className="font-semibold text-green-700">organizations</span>, creating a seamless ecosystem where meaningful contributions thrive.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                We believe in the power of community service to transform lives, build skills, and create lasting positive change in society.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-green-800">
                        What Makes Us <span className="text-green-600">Different</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 hover:transform hover:-translate-y-2 transition-all duration-300">
                            <Users className="w-12 h-12 text-green-600 mb-6" />
                            <h3 className="font-bold text-xl mb-4 text-gray-800">Volunteer Profiles</h3>
                            <p className="text-gray-600">Comprehensive profiles to track activities, completed tasks, and earned certificates all in one place.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 hover:transform hover:-translate-y-2 transition-all duration-300">
                            <Building className="w-12 h-12 text-green-600 mb-6" />
                            <h3 className="font-bold text-xl mb-4 text-gray-800">NGO Dashboard</h3>
                            <p className="text-gray-600">Powerful tools for organizations to post opportunities, manage volunteers, and verify contributions.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 hover:transform hover:-translate-y-2 transition-all duration-300">
                            <Heart className="w-12 h-12 text-green-600 mb-6" />
                            <h3 className="font-bold text-xl mb-4 text-gray-800">Impact Tracking</h3>
                            <p className="text-gray-600">Measure and visualize the real-world impact of volunteer efforts across communities.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 hover:transform hover:-translate-y-2 transition-all duration-300">
                            <Award className="w-12 h-12 text-green-600 mb-6" />
                            <h3 className="font-bold text-xl mb-4 text-gray-800">Digital Certificates</h3>
                            <p className="text-gray-600">Secure, verifiable digital certificates that recognize volunteer contributions and achievements.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Ready to Make a Difference?</h2>
                    <p className="text-xl mb-10 max-w-2xl mx-auto">
                        Join our community of changemakers and start your volunteering journey today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/register"
                            className="px-8 py-4 bg-white text-green-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            Sign Up as Volunteer
                        </Link>
                        <Link
                            href="/ngoauth/register"
                            className="px-8 py-4 bg-green-700 text-white font-bold rounded-lg shadow-lg hover:bg-green-800 transition-colors border border-white"
                        >
                            Register Organization
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 px-4">
                <div className="container mx-auto text-center">
                    <p>© {new Date().getFullYear()} Unified Volunteering Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
