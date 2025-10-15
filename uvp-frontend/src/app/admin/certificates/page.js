"use client";

import { useEffect, useMemo, useState } from "react";
import { getRequest, putRequest } from "@/lib/api";

export default function AdminCertificatesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getRequest("/admin/certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res?.data) ? res.data : [];
        // Normalize to table structure using provided shape
        setItems(
          data.map((c) => ({
            id: c.certificateId ?? c.id,
            user: c.userName ?? c.user ?? "",
            task: c.taskName ?? c.task ?? "",
            date: c.issueDate ?? c.date ?? "",
            userId: c.userId,
            taskId: c.taskId,
            blocked: c.blocked ?? false,
          }))
        );
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) =>
      [i.user, i.task, i.date].some((x) => String(x).toLowerCase().includes(q))
    );
  }, [items, query]);


  const toggleBlockStatus = async (item) => {
    try {
      await putRequest(`/admin/update-block-status/${item.id}`);
      
      // Update local state to reflect the change
      setItems((prev) => 
        prev.map((c) => 
          c.id === item.id ? { ...c, blocked: !c.blocked } : c
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update certificate block status");
    }
  };

  const download = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getRequest(`/volunteer/certificates/download/${item.userId}/${item.taskId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate-${item.task}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert("Failed to download certificate");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by user, task, or date"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-auto">
        {error && <div className="p-4 text-red-600">{error}</div>}
        {loading && <div className="p-4 text-gray-500">Loading…</div>}
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Certificate #</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Task</th>
              <th className="text-left px-4 py-3">Issued Date</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-top">
                <td className="px-4 py-3 font-medium">{c.id}</td>
                <td className="px-4 py-3">{c.user}</td>
                <td className="px-4 py-3">{c.task}</td>
                <td className="px-4 py-3">{c.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => download(c)} className="px-3 py-1 rounded bg-green-100 text-green-800">Download</button>
                    <button 
                      onClick={() => toggleBlockStatus(c)} 
                      className={`px-3 py-1 rounded ${c.blocked ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {c.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


