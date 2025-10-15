"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postRequest } from "@/lib/api";
import { Building, Mail, MapPin, Phone, FileText, Users, Upload } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    type: "",
    address: "",
    contact: "",
    description: "",
    image: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      // Mocked data; API call commented out for now
      // try {
      //   const token = localStorage.getItem("token");
      //   const res = await postRequest("/organization/profile", {}, { headers: { Authorization: `Bearer ${token}` } });
      //   setProfile(res.data);
      // } catch (e) {
      //   console.error("Failed to fetch profile:", e);
      // }

      // Mock data
      setProfile({
        name: "Elder Care Home",
        email: "contact@eldercare.com",
        type: "OLDAGE",
        address: "456 Oak Street, NY",
        contact: "+1-555-2020",
        description: "We provide comprehensive care and support for elderly individuals, ensuring their comfort, dignity, and well-being in a warm, family-like environment.",
        image: null
      });
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Create the profile object
    const profileData = {
      name: data.name,
      email: data.email,
      type: data.type,
      address: data.address,
      contact: data.contact,
      description: data.description
    };

    // Create new FormData for the API request
    const requestFormData = new FormData();
    requestFormData.append('profile', JSON.stringify(profileData));
    
    if (selectedImage) {
      requestFormData.append('image', selectedImage);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const res = await postRequest("/organization/profile/update",
         requestFormData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
         });
      
      // Check for success
      const isSuccess = res.status === 200 || res.status === 201 || 
                       (res.data && res.data.success) || 
                       (res.data && res.data.status === 'success');
      
      if (isSuccess) { 
        alert("Profile updated successfully!");
        router.push("/ngo");
      } else {
        alert("Profile update failed. Please try again.");
      }
    } catch (err) { 
      alert("Failed to update profile. Please try again."); 
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-gray-600 text-sm">Update your organization information</p>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white rounded-xl p-6 shadow space-y-6">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Organization Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="name"
              type="text"
              required
              defaultValue={profile.name}
              placeholder="Organization Name"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="email"
              type="email"
              required
              defaultValue={profile.email}
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Organization Type</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              name="type"
              required
              defaultValue={profile.type}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm appearance-none bg-white"
            >
              <option value="">Select Organization Type</option>
              <option value="OLDAGE">Old Age Care</option>
              <option value="CHILDREN">Children Care</option>
              <option value="DISABLED">Disabled Care</option>
              <option value="EDUCATION">Education</option>
              <option value="HEALTH">Health</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="address"
              type="text"
              required
              defaultValue={profile.address}
              placeholder="Address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="contact"
              type="tel"
              required
              defaultValue={profile.contact}
              placeholder="Contact Number"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="description"
              required
              rows="4"
              defaultValue={profile.description}
              placeholder="Organization Description"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Organization Image</label>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="image-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
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
            
            {/* Current Image or Preview */}
            {(profile.image || imagePreview) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                <div className="relative inline-block">
                  <img 
                    src={imagePreview || profile.image} 
                    alt="Profile preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      document.getElementById('image-upload').value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {submitting ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
