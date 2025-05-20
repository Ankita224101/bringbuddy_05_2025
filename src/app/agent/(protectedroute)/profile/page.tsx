"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Image,
  Tabs,
  Tab
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaUpload,
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaPencilAlt,
  FaSave,
  FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";
import Sidebar from "../../../../components/agent/Sidebar";
import Header from "../../../../components/agent/Header";
import "../../../../assets/styles/dashboard-admin.css";
import { log } from "console";

interface AgentProfile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  country_id?: number | string;
  country_code?: string;
  profile_img?: string;
  joined_date?: string;
  commission_rate?: number;
}

interface Country {
  id: number;
  name: string;
  code: string;
}

export default function AgentProfile() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AgentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  // Fetch agent profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (!userData || !userData.email) {
          router.push("/agent/login");
          return;
        }
        
        const response = await axios.post("/agent/api/get-agent", { email: userData.email });
        if (response.data && response.data.agents) {
          setProfile(response.data.agents);
          setEditedProfile(response.data.agents);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error loading profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
        
  
    const fetchCountries = async () => {
      try {
        const response = await axios.post("/api/countries/allcountries");

        console.log("Countries response:", response.data);
        if (response.data && response.data) {
          setCountries(response.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchProfile();
    fetchCountries();
  }, [router]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle profile image upload
  const handleUploadImage = async () => {
    if (!selectedFile || !profile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("id", profile.id.toString());
      formData.append("file", selectedFile);
      
      const response = await axios.post("/agent/api/upload-profile-image", formData);
      
      if (response.data && response.data.success) {
        setProfile({
          ...profile,
          profile_img: response.data.profileImgPath
        });
        setEditedProfile({
          ...editedProfile!,
          profile_img: response.data.profileImgPath
        });
        setSuccess("Profile image updated successfully");
        toast.success("Profile image updated!");
        setSelectedFile(null);
      } else {
        setError(response.data.message || "Failed to upload profile image");
        toast.error("Failed to upload image");
      }
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.message || "Error uploading image. Please try again.");
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  // Handle profile update submission
  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProfile) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post("/agent/api/update-agent", editedProfile);
      
      if (response.data && response.data.success) {
        setProfile(response.data.agent);
        setSuccess("Profile updated successfully");
        toast.success("Profile updated!");
        setIsEditing(false);
      } else {
        setError(response.data.message || "Failed to update profile");
        toast.error("Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Error updating profile. Please try again.");
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel edit mode
  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="dashboard-container">

      <div className="main-agent-content">

        
        <Container fluid className="dashboard-content">
          <div className="page-header mb-4">
            <h2 className="page-title">Agent Profile</h2>
            <p className="text-muted">View and manage your profile information</p>
          </div>
          
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
              <FaCheck className="me-2" />
              {success}
            </Alert>
          )}
          
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Loading profile data...</p>
            </div>
          ) : profile ? (
            <Row>
              <Col lg={4} className="mb-4">
                <Card className="profile-card shadow-sm">
                  <div className="profile-header">
                    <div className="profile-image-container">
                      <Image 
                        src={previewUrl || profile.profile_img || "https://via.placeholder.com/150"} 
                        alt={profile.name}
                        className="profile-image"
                        roundedCircle
                      />
                      <div className="profile-image-overlay" onClick={triggerFileInput}>
                        <FaUpload />
                        <span>Change Photo</span>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="d-none"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                      />
                    </div>
                    {selectedFile && (
                      <div className="text-center mt-3">
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={handleUploadImage}
                          disabled={isUploading}
                          className="upload-btn"
                        >
                          {isUploading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FaUpload className="me-2" />
                              Upload New Photo
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          disabled={isUploading}
                          className="ms-2"
                        >
                          <FaTimes className="me-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <h4 className="text-center mb-3">{profile.name}</h4>
                    <div className="profile-info">
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <div>
                          <p className="info-label">Email</p>
                          <p className="info-value">{profile.email}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <div>
                          <p className="info-label">Phone</p>
                          <p className="info-value">{profile.phone_number || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <div>
                          <p className="info-label">Address</p>
                          <p className="info-value">{profile.address || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FaGlobe className="info-icon" />
                        <div>
                          <p className="info-label">Country</p>
                          <p className="info-value">
                            {profile.country_id 
                              ? countries.find(c => c.id === Number(profile.country_id))?.name || "Not found"
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div>
                          <p className="info-label">Joined Date</p>
                          <p className="info-value">{formatDate(profile.joined_date)}</p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                    <h5 className="mb-0">Profile Details</h5>
                    {!isEditing ? (
                      <Button 
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <FaPencilAlt className="me-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div>
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="me-2"
                          disabled={isSubmitting}
                        >
                          <FaTimes className="me-1" />
                          Cancel
                        </Button>
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={handleSubmitUpdate}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={editedProfile?.name || ""}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              value={profile.email}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="phone_number"
                              value={editedProfile?.phone_number || ""}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                              name="country_id"
                              value={editedProfile?.country_id || ""}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            >
                              <option value="">Select a country</option>
                              {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                  {country.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={editedProfile?.address || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
                
                <Tabs defaultActiveKey="commissions" className="mb-3">
                  <Tab eventKey="commissions" title="Commission History">
                    <Card className="shadow-sm">
                      <Card.Body>
                        <div className="text-center py-4">
                          <p className="mb-3">Commission Rate: {profile.commission_rate || 0}%</p>
                          <div className="d-flex justify-content-center mb-4">
                            <div className="stats-card me-4">
                              <h3>$0</h3>
                              <p>Total Earned</p>
                            </div>
                            <div className="stats-card me-4">
                              <h3>$0</h3>
                              <p>Pending</p>
                            </div>
                            <div className="stats-card">
                              <h3>$0</h3>
                              <p>Paid</p>
                            </div>
                          </div>
                          <p className="text-muted">No commission history available yet.</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab>
                  <Tab eventKey="activity" title="Recent Activity">
                    <Card className="shadow-sm">
                      <Card.Body>
                        <div className="text-center py-4">
                          <p className="text-muted">No recent activities yet.</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          ) : (
            <Alert variant="warning">
              <p>No profile data found. Please log in again.</p>
              <Button 
                variant="primary" 
                onClick={() => router.push("/agent/login")}
              >
                Go to Login
              </Button>
            </Alert>
          )}
        </Container>
        
        {/* Footer */}
        <div className="dashboard-footer">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} Bring Your Buddy | Agent Portal
          </div>
          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .page-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        
        .page-title {
          font-weight: 600;
          color: #333;
        }
        
        .profile-card {
          border-radius: 10px;
          overflow: hidden;
        }
        
        .profile-header {
          padding: 30px 0;
          background: linear-gradient(135deg, #4299e1, #667eea);
          text-align: center;
        }
        
        .profile-image-container {
          position: relative;
          display: inline-block;
        }
        
        .profile-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .profile-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .profile-image-overlay:hover {
          opacity: 1;
        }
        
        .profile-image-overlay svg {
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .profile-info {
          margin-top: 20px;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        
        .info-icon {
          color: #4299e1;
          margin-right: 15px;
          font-size: 18px;
          margin-top: 3px;
        }
        
        .info-label {
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 0;
        }
        
        .info-value {
          font-weight: 500;
          margin-bottom: 0;
        }
        
        .upload-btn {
          background: linear-gradient(135deg, #4299e1, #667eea);
          border: none;
        }
        
        .stats-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px 25px;
          text-align: center;
        }
        
        .stats-card h3 {
          font-weight: 600;
          margin-bottom: 5px;
          color: #4299e1;
        }
        
        .stats-card p {
          color: #718096;
          margin-bottom: 0;
          font-size: 0.875rem;
        }
        
        @media (max-width: 767px) {
          .profile-header {
            padding: 20px 0;
          }
          
          .profile-image {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
}
