"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { postRequest } from "@/lib/api";
import { Building, Mail, Lock, MapPin, Phone, FileText, Users } from "lucide-react";

export default function NGOSignupPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await postRequest("/auth/orgregister", data);
      if (res.status === 200) router.push("/ngoauth/login");
    } catch (err) { alert("Registration failed"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-indigo-100">
            <Building className="h-7 w-7 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">NGO Registration</h2>
          <p className="mt-1 text-sm text-gray-600">Create your organization account</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Organization Name"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              id="type"
              name="type"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white"
            >
              <option value="">Select Organization Type</option>
              <option value="OLDAGE">Old Age Care</option>
              <option value="CHILDREN">Children Care</option>
              <option value="DISABLED">Disabled Care</option>
              <option value="EDUCATION">Education</option>
              <option value="ORPHANAGE">Orphanage</option>
              <option value="ORPHANAGE">NGO</option>
              <option value="HEALTH">Health</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="contact"
              name="contact"
              type="tel"
              required
              placeholder="Contact Number"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              id="description"
              name="description"
              placeholder="Description (Optional)"
              rows="3"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow transition">
            Create Account
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already registered? {" "}
            <Link href="/ngoauth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


