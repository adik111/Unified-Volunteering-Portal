"use client";

import { useEffect, useState } from "react";
import {  postRequest, putRequest } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function NGOEditTaskDynamicPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId || "";

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    capacity: "",
    locationLink: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (evt) => setImagePreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };
 
  const handleDragOver = (e) => {
    e.preventDefault();
  };
 
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type?.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (evt) => setImagePreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const fetchTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await postRequest(`/volunteer/task/${taskId}`);
      const t = res?.data || {};
      setForm({
        title: t.title || "",
        description: t.description || "",
        startDate: t.startDate ? new Date(t.startDate).toISOString().slice(0, 10) : "",
        endDate: t.endDate ? new Date(t.endDate).toISOString().slice(0, 10) : "",
        capacity: (t.capacity ?? "").toString(),
        locationLink: t.locationLink || ""
      });
      setImagePreview(t.imageUrl || null);
    } catch (e) {
      setError("Failed to load task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskPayload = {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      capacity: parseInt(form.capacity || "0"),
      locationLink: form.locationLink || null
    };

    const requestFormData = new FormData();
    requestFormData.append(
      "task",
      new Blob([JSON.stringify(taskPayload)], { type: "application/json" })
    );
    if (selectedImage) {
      requestFormData.append("image", selectedImage);
    }

    try {
      setSubmitting(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await putRequest(`/organization/task/update/${taskId}`, requestFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const ok = res?.status === 200 || res?.status === 201 || res?.data?.success === true || res?.data?.status === "success";
      if (ok) {
        alert("Task updated successfully!");
        router.push("/ngo/tasks");
      } else {
        alert("Update failed. Please try again.");
      }
    } catch (err) {
      alert("Failed to update task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Task</h1>
        <p className="text-gray-600 text-sm">Update task #{taskId}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white rounded-xl p-6 shadow space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location Link</label>
            <input
              type="url"
              value={form.locationLink}
              onChange={(e) => setForm({ ...form, locationLink: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Task Image</label>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Task preview" 
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      const input = document.getElementById('image-upload');
                      if (input) input.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            {!selectedImage && (
              <p className="text-xs text-gray-500">Leave empty to keep the current image.</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
}


