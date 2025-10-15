"use client";

import { useState } from "react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({ name: "Admin", email: "admin@example.com", password: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved (dummy)");
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
      </form>
    </div>
  );
}



