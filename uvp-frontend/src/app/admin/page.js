"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";

// Lightweight UI helpers for attractive, interactive cards without extra deps
const numberFmt = new Intl.NumberFormat("en-US");

function StatCard({ title, value, subtitle, icon, colorFrom = "from-indigo-500", colorTo = "to-purple-500", loading = false }) {
  return (
    <div className="relative group" title={title}>
      <div className={`p-[1px] rounded-2xl bg-gradient-to-r ${colorFrom} ${colorTo} transition-transform duration-300 group-hover:scale-[1.02]`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? (
              <span className="inline-block w-16 h-6 rounded animate-pulse bg-gray-200" />
            ) : (
              value ?? "-"
            )}
          </div>
          {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ percent = 0, size = 120, stroke = 10, label = "Progress", color = "#6366f1" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="mt-3 text-sm text-gray-600">
        {label}: <span className="font-semibold text-gray-900">{percent}%</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getRequest("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res?.data || null);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totals = {
    totalUsers: stats?.totalUsers ?? 0,
    totalOrganizations: stats?.totalOrganizations ?? 0,
    totalTasks: stats?.totalTasks ?? 0,
    completedTasks: stats?.completedTasks ?? 0,
    closedTasks: stats?.closedTasks ?? 0,
  };
  const completionRate = totals.totalTasks ? Math.round((totals.completedTasks / totals.totalTasks) * 100) : 0;
  const closureRate = totals.totalTasks ? Math.round((totals.closedTasks / totals.totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={loading ? null : numberFmt.format(totals.totalUsers)}
          subtitle="All registered users"
          icon={<span>👥</span>}
          colorFrom="from-sky-500"
          colorTo="to-cyan-500"
          loading={loading}
        />
        <StatCard
          title="Organizations"
          value={loading ? null : numberFmt.format(totals.totalOrganizations)}
          subtitle="NGOs on platform"
          icon={<span>🏢</span>}
          colorFrom="from-emerald-500"
          colorTo="to-teal-500"
          loading={loading}
        />
        <StatCard
          title="Total Tasks"
          value={loading ? null : numberFmt.format(totals.totalTasks)}
          subtitle="Tasks created"
          icon={<span>🗂️</span>}
          colorFrom="from-indigo-500"
          colorTo="to-purple-500"
          loading={loading}
        />
        <StatCard
          title="Completed Tasks"
          value={loading ? null : numberFmt.format(totals.completedTasks)}
          subtitle={`${completionRate}% completion`}
          icon={<span>✅</span>}
          colorFrom="from-violet-500"
          colorTo="to-fuchsia-500"
          loading={loading}
        />
        <StatCard
          title="Closed Tasks"
          value={loading ? null : numberFmt.format(totals.closedTasks)}
          subtitle={`${closureRate}% closed`}
          icon={<span>🔒</span>}
          colorFrom="from-rose-500"
          colorTo="to-orange-500"
          loading={loading}
        />
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Task Progress</div>
            <span className="text-xs text-gray-400">Auto-updates</span>
          </div>
          <div className="mt-6 grid grid-cols-2 place-items-center">
            <ProgressRing percent={completionRate} label="Completed" color="#8b5cf6" />
            <ProgressRing percent={closureRate} label="Closed" color="#f43f5e" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Quick Insights</div>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
              <div className="text-sm text-amber-700">Avg. tasks per org</div>
              <div className="font-semibold text-amber-800">
                {totals.totalOrganizations ? (totals.totalTasks / totals.totalOrganizations).toFixed(1) : "-"}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="text-sm text-emerald-700">Completion ratio</div>
              <div className="font-semibold text-emerald-800">
                {totals.totalTasks ? `${totals.completedTasks}/${totals.totalTasks}` : "-"}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-100">
              <div className="text-sm text-rose-700">Closure ratio</div>
              <div className="font-semibold text-rose-800">
                {totals.totalTasks ? `${totals.closedTasks}/${totals.totalTasks}` : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


