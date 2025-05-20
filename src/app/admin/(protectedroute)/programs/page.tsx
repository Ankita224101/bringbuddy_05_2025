"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Form,
  Spinner,
  Modal,
  Card,
  Pagination,
} from "react-bootstrap";
import {
  FaUsers,
  FaUniversity,
  FaGraduationCap,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserEdit,
  FaSearch,
  FaFilter,
  FaSignOutAlt,
  FaEye,
  FaTrash,
  FaBars,
  FaBell,
  FaCog,
  FaTachometerAlt,
  FaPlus,
  FaEdit,
  FaBook,
  FaList,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";

// Define interfaces for data types
interface Program {
  id: number;
  name: string;
  course_id: number;
  created_at?: string;
  updated_at?: string;
}

interface Course {
  id: number;
  name: string;
}

export default function ProgramsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Form state for adding/editing programs
  const [formData, setFormData] = useState({
    name: "",
    course_id: "",
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Fetch all programs
      const response = await axios.get("/admin/api/programs/getProgram");
      
      if (response.data && response.data.programs) {
        // Filter programs based on search term
        let filteredPrograms = response.data.programs;
        
        if (searchTerm) {
          filteredPrograms = filteredPrograms.filter((program: any) => 
            program.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setPrograms(filteredPrograms);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs data");
      setIsLoading(false);
      
      // Use mock data as fallback
      const mockPrograms = [
        { id: 1, name: "Computer Science", course_id: 1 },
        { id: 2, name: "Data Science", course_id: 1 },
        { id: 3, name: "Business Administration", course_id: 2 },
        { id: 4, name: "Mechanical Engineering", course_id: 3 },
        { id: 5, name: "Electrical Engineering", course_id: 3 },
      ];
      
      setPrograms(mockPrograms);
    }
  };
  
  const fetchCourses = async () => {
    try {
      // Fetch course types for the dropdown
      const response = await axios.get("/api/fetchcoursetypes");
      if (response.data && response.data.result) {
        setCourses(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching course types:", error);
      toast.error("Failed to load course types");
      
      // Fallback mock data
      setCourses([
        { id: 1, name: "Undergraduate" },
        { id: 2, name: "Postgraduate" },
        { id: 3, name: "Diploma" },
      ]);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchCourses();
  }, []);
  
  // Debounce search term input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPrograms();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      course_id: "",
    });
    setIsEditMode(false);
  };
  
  const openAddProgramModal = () => {
    resetForm();
    setShowProgramModal(true);
  };
  
  const openEditProgramModal = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      course_id: program.course_id.toString(),
    });
    setIsEditMode(true);
    setShowProgramModal(true);
  };
  
  const openDeleteModal = (program: Program) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.course_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      if (isEditMode && selectedProgram) {
        // Update existing program
        const response = await axios.put(`/admin/api/programs/${selectedProgram.id}`, formData);
        if (response.data.message) {
          toast.success("Program updated successfully");
          fetchPrograms();
          setShowProgramModal(false);
        } else {
          toast.error("Failed to update program");
        }
      } else {
        // Add new program
        const response = await axios.post("/admin/api/programs", formData);
        if (response.data.message) {
          toast.success("Program added successfully");
          fetchPrograms();
          setShowProgramModal(false);
        } else {
          toast.error("Failed to add program");
        }
      }
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Error saving program. Please try again.");
    }
  };
  
  const handleDelete = async () => {
    if (!selectedProgram) return;
    
    try {
      const response = await axios.delete(`/admin/api/programs/${selectedProgram.id}`);
      if (response.data.message) {
        toast.success("Program deleted successfully");
        fetchPrograms();
        setShowDeleteModal(false);
      } else {
        toast.error("Failed to delete program");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Error deleting program. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
  

      {/* Main Content */}
      <div className={`main-admin-content w-100 ${sidebarCollapsed ? 'content-collapsed' : ''}`}>
        {/* Navbar */}


        {/* Content Area */}
        <div className="dashboard-content">
          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Manage Programs</h5>
              <div className="d-flex">
                <Button variant="primary" size="sm" onClick={openAddProgramModal}>
                  <FaPlus className="me-1" /> Add Program
                </Button>
              </div>
            </div>
            <div className="content-card-body">
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading programs data...</span>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Program Name</th>
                          <th>Course Type ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programs.length > 0 ? (
                          programs.map((program) => (
                            <tr key={program.id}>
                              <td>{program.id}</td>
                              <td>{program.name}</td>
                              <td>{program.course_id}</td>
                              <td>
                                <Button 
                                  variant="light" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => openEditProgramModal(program)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="light" 
                                  size="sm"
                                  onClick={() => openDeleteModal(program)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No programs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Program Statistics */}
          <Row>
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaBook />
                  </div>
                  <h3 className="mb-0">{programs.length}</h3>
                  <p className="text-muted">Total Programs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaList />
                  </div>
                  <h3 className="mb-0">{courses.length}</h3>
                  <p className="text-muted">Course Types</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon purple mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="mb-0">--</h3>
                  <p className="text-muted">Students Enrolled</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} Bring Your Buddy | Admin Dashboard
          </div>
          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Add/Edit Program Modal */}
      <Modal show={showProgramModal} onHide={() => setShowProgramModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Program' : 'Add New Program'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter program name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Course Type</Form.Label>
              <Form.Select
                name="course_id"
                value={formData.course_id}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Course Type</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgramModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditMode ? 'Update Program' : 'Add Program'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the program <strong>{selectedProgram?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Program
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 