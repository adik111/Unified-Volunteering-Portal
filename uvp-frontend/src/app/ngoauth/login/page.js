"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { postRequest } from "@/lib/api";
import { Lock, Mail } from "lucide-react";

export default function NGOLoginPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    // Mocked auth; API call commented out for now
    try {
      const res = await postRequest("/auth/orglogin", data);
      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem("token", token);
        router.push("/ngo");
      }
    } catch (err) { alert("Invalid email or password"); }

      // localStorage.setItem("token", "mock-token");
      // router.push("/ngo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-indigo-100">
            <Lock className="h-7 w-7 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">NGO Login</h2>
          <p className="mt-1 text-sm text-gray-600">Sign in to your organization account</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
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

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow transition">
            Sign In
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            New organization? {" "}
            <Link href="/ngoauth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Create an account
            </Link>
          </p>
        </div>
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}


