"use client";

import { useEffect, useState } from "react";
// import { postRequest } from "@/lib/api";

export default function NGOReportsPage() {
  const [report, setReport] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalVolunteers: 0,
    totalHours: 0,
    recent: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      // Mocked data; API call commented out for now
      // try {
      //   setLoading(true);
      //   const token = localStorage.getItem("token");
      //   const res = await postRequest("/ngo/reports", {}, { headers: { Authorization: `Bearer ${token}` } });
      //   setReport(res.data);
      //   setError(null);
      // } finally { setLoading(false); }

      setLoading(true);
      setTimeout(() => {
        setReport({
          totalTasks: 14,
          completedTasks: 9,
          totalVolunteers: 73,
          totalHours: 428,
          recent: [
            { id: 1, title: "Community Cleanup", date: "2025-09-01", volunteers: 12, hours: 48 },
            { id: 2, title: "Food Drive", date: "2025-08-24", volunteers: 20, hours: 80 },
          ],
        });
        setLoading(false);
      }, 400);
    };
    fetchReport();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="text-gray-600 text-sm">Your impact summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Tasks", value: report.totalTasks, color: "border-green-500" },
          { label: "Completed Tasks", value: report.completedTasks, color: "border-blue-500" },
          { label: "Volunteers", value: report.totalVolunteers, color: "border-purple-500" },
          { label: "Total Hours", value: report.totalHours, color: "border-amber-500" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-6 shadow border-l-4 ${s.color}`}>
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{loading ? "…" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Volunteers</th>
                <th className="px-4 py-3">Hours</th>
              </tr>
            </thead>
            <tbody>
              {report.recent.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{r.volunteers}</td>
                  <td className="px-4 py-3">{r.hours}</td>
                </tr>
              ))}
              {report.recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-600">No recent data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


