"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaPen } from "react-icons/fa";
import "../../../../assets/styles/dashboard-admin.css";
export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch admin data when component mounts
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("/admin/api/get-admin");
        const adminData = response.data.admins;
        
        setFormData({
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          password: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast.error("Failed to load admin profile");
      }
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required fields");
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (!formData.password) {
      toast.error("Current password is required to update profile");
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for API
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.newPassword || formData.password
      };

      // Send update request
      const response = await axios.put(`/admin/api/update-profile/${formData.id}`, dataToSend);
      
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          password: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Admin Profile</h4>
              <button 
                className="btn btn-light btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
            <div className="card-body">
              {!isEditing ? (
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <div className="avatar-circle mx-auto mb-3 bg-primary d-flex align-items-center justify-content-center">
                      <FaUser className="text-white" size={50} />
                    </div>
                    <h5>{formData.name}</h5>
                    <p className="text-muted">{formData.email}</p>
                  </div>
                  <div className="col-md-8">
                    <div className="admin-info">
                      <div className="info-item d-flex align-items-center mb-3">
                        <div className="icon-container me-3">
                          <FaUser className="text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 text-muted small">Name</p>
                          <h6>{formData.name}</h6>
                        </div>
                      </div>
                      <div className="info-item d-flex align-items-center mb-3">
                        <div className="icon-container me-3">
                          <FaEnvelope className="text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 text-muted small">Email</p>
                          <h6>{formData.email}</h6>
                        </div>
                      </div>
                      <div className="info-item d-flex align-items-center">
                        <div className="icon-container me-3">
                          <FaLock className="text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 text-muted small">Password</p>
                          <h6>••••••••</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      <FaUser className="me-2" /> Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="me-2" /> Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <FaLock className="me-2" /> Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      <FaLock className="me-2" /> New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock className="me-2" /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .icon-container {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba(13, 110, 253, 0.1);
        }
      `}</style>
    </div>
  );
}
