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
  FaCreditCard,
  FaMapMarkerAlt,
  FaGlobe,
  FaBuilding,
  FaDollarSign,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";

// Define interfaces for data types
interface University {
  id: number;
  name: string;
  program_id?: number;
  university_country_id?: number;
  location?: string;
  campus?: string;
  fees?: number;
  annual_fees?: number;
  description?: string;
  entry_type?: number;
  created_at?: string;
  updated_at?: string;
}

interface UniversityStats {
  total: number;
}

export default function UniversitiesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEntryType, setFilterEntryType] = useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<UniversityStats>({
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Add university modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // University details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  
  // Form data for adding a university
  const [formData, setFormData] = useState({
    name: "",
    program_id: "",
    university_country_id: "",
    location: "",
    campus: "",
    fees: "",
    annual_fees: "",
    description: "",
    entry_type: 0,
  });
  
  // Country and program options for dropdowns
  const [countries, setCountries] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  // State for edit university modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const router = useRouter();

  const fetchUniversities = async () => {
    setIsLoading(true);
    try {
      // Fetch all universities
      const response = await axios.get("/admin/api/universities");
      
      if (response.data && response.data.universities) {
        let universities = response.data.universities;
        
        // Filter universities based on search term
        if (searchTerm) {
          universities = universities.filter((university: University) => 
            university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            university.location?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter universities based on entry type
        if (filterEntryType !== "all") {
          const entryTypeValue = filterEntryType === "automated" ? 1 : 0;
          universities = universities.filter((university: University) => 
            university.entry_type === entryTypeValue
          );
        }
        
        setUniversities(universities);
        setStats({
          total: universities.length,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load universities data");
      setIsLoading(false);
      
      // Fallback to mock data
      const mockUniversities = [
        { id: 1, name: "Harvard University", program_id: 1, university_country_id: 1, location: "Cambridge, MA", campus: "Main Campus", fees: 50000, annual_fees: 50000, entry_type: 1, created_at: "2023-01-15" },
        { id: 2, name: "Oxford University", program_id: 2, university_country_id: 2, location: "Oxford, UK", campus: "Central Campus", fees: 40000, annual_fees: 40000, entry_type: 0, created_at: "2023-01-20" },
        { id: 3, name: "Stanford University", program_id: 1, university_country_id: 1, location: "Stanford, CA", campus: "Main Campus", fees: 55000, annual_fees: 55000, entry_type: 1, created_at: "2023-01-25" },
        { id: 4, name: "MIT", program_id: 3, university_country_id: 1, location: "Cambridge, MA", campus: "Technology Campus", fees: 58000, annual_fees: 58000, entry_type: 0, created_at: "2023-01-30" },
        { id: 5, name: "University of Toronto", program_id: 2, university_country_id: 3, location: "Toronto, Canada", campus: "Downtown Campus", fees: 35000, annual_fees: 35000, entry_type: 1, created_at: "2023-02-05" },
      ];
      
      setUniversities(mockUniversities);
      setStats({
        total: mockUniversities.length,
      });
    }
  };
  
  // Fetch supporting data for dropdowns
  const fetchSupportingData = async () => {
    try {
      // Fetch countries
      const countriesRes = await axios.post("/api/countries/allcountries");
      if (countriesRes.data) {
        setCountries(countriesRes.data);
        console.log("countries : ", countriesRes.data);
        
      }
      
      // Fetch programs
      const programsRes = await axios.get("/api/programs");
      if (programsRes.data && programsRes.data.programs) {
        setPrograms(programsRes.data.programs);
        console.log("programs : ", programsRes.data);
        
      }
    } catch (error) {
      console.error("Error fetching supporting data:", error);
      toast.error("Failed to load supporting data");
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchSupportingData();
  }, []);
  
  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUniversities();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterEntryType]);

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
  
  const handleViewUniversity = (university: University) => {
    setSelectedUniversity(university);
    setShowDetailsModal(true);
  };
  
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      program_id: "",
      university_country_id: "",
      location: "",
      campus: "",
      fees: "",
      annual_fees: "",
      description: "",
      entry_type: 0,
    });
    setShowAddModal(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert entry_type to number
    if (name === 'entry_type') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/admin/api/universities", formData);
      
      if (response.data && response.data.message) {
        toast.success("University added successfully");
        setShowAddModal(false);
        fetchUniversities();
      }
    } catch (error) {
      console.error("Error adding university:", error);
      toast.error("Failed to add university");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUniversities = universities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(universities.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterEntryType(e.target.value);
    setCurrentPage(1);
  };

  // Function to handle edit university
  const handleEditUniversity = (university: University) => {
    setSelectedUniversity(university);
    // Set form data with university details
    setFormData({
      name: university.name,
      program_id: university.program_id?.toString() || "",
      university_country_id: university.university_country_id?.toString() || "",
      location: university.location || "",
      campus: university.campus || "",
      fees: university.fees?.toString() || "",
      annual_fees: university.annual_fees?.toString() || "",
      description: university.description || "",
      entry_type: university.entry_type || 0,
    });
    setShowEditModal(true);
  };
  
  // Function to submit university update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniversity) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(`/admin/api/universities/${selectedUniversity.id}`, formData);
      console.log("selectedUniversity.id : ", selectedUniversity.id);
      
      
      if (response.data && response.data.message) {
        toast.success("University updated successfully");
        setShowEditModal(false);
        fetchUniversities();
      }
    } catch (error) {
      console.error("Error updating university:", error);
      toast.error("Failed to update university");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to handle delete confirmation
  const handleDeleteConfirmation = (university: University) => {
    setSelectedUniversity(university);
    setShowDeleteConfirmation(true);
  };
  
  // Function to delete university
  const handleDeleteUniversity = async () => {
    if (!selectedUniversity) return;
    
    setIsDeleting(true);
    
    try {
      const response = await axios.delete(`/admin/api/universities/${selectedUniversity.id}`);
      
      if (response.data && response.data.message) {
        toast.success("University deleted successfully");
        setShowDeleteConfirmation(false);
        fetchUniversities();
      }
    } catch (error) {
      console.error("Error deleting university:", error);
      toast.error("Failed to delete university");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
    

      {/* Main Content */}
      <div className={`main-admin-content w-100 ${sidebarCollapsed ? "content-collapsed" : ""}`}>
        {/* Navbar */}
   

        {/* Content Area */}
        <div className="dashboard-content">
          {/* University Statistics */}
          <Row className="mb-4">
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaUniversity />
                  </div>
                  <h3 className="mb-0">{stats.total}</h3>
                  <p className="text-muted">Total Universities</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaGlobe />
                  </div>
                  <h3 className="mb-0">{countries?.length || 0}</h3>
                  <p className="text-muted">Countries</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon yellow mb-3">
                    <FaGraduationCap />
                  </div>
                  <h3 className="mb-0">{programs.length || 0}</h3>
                  <p className="text-muted">Programs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon red mb-3">
                    <FaBuilding />
                  </div>
                  <h3 className="mb-0">{currentUniversities.filter(uni => uni.campus).length}</h3>
                  <p className="text-muted">Campuses</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Manage Universities</h5>
              <Button className=" d-flex align-items-center" variant="primary" size="sm" onClick={handleOpenAddModal}>
                <FaPlus className="me-1" /> Add University
              </Button>
            </div>
            <div className="content-card-body">
              <div className="d-flex justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <div className="search-box me-3">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search universities..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="search-input"
                    />
                  </div>
                  <Form.Select 
                    className="filter-select ms-2" 
                    value={filterEntryType}
                    onChange={handleFilterChange}
                    style={{ width: '180px' }}
                  >
                    <option value="all">All Entry Types</option>
                    <option value="manual">Manual Entry</option>
                    <option value="automated">Automated Entry</option>
                  </Form.Select>
                </div>
              </div>
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading universities data...</span>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Location</th>
                          <th>Campus</th>
                          <th>Fees</th>
                          <th>Entry Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUniversities.length > 0 ? (
                          currentUniversities.map((university) => (
                            <tr key={university.id}>
                              <td>{university.id}</td>
                              <td>{university.name}</td>
                              <td>{university.location || "-"}</td>
                              <td>{university.campus || "-"}</td>
                              <td>{university.fees ? formatCurrency(university.fees) : "-"}</td>
                              <td>
                                <Badge
                                  bg={university.entry_type === 1 ? "success" : "info"}
                                >
                                  {university.entry_type === 1 ? "Automated" : "Manual"}
                                </Badge>
                              </td>
                              <td>
                                <Button 
                                  variant="light" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleViewUniversity(university)}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="light" 
                                  size="sm"
                                  className="mx-1"
                                  onClick={() => handleEditUniversity(university)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="light" 
                                  size="sm"
                                  onClick={() => handleDeleteConfirmation(university)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No universities found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {universities.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, universities.length)} of{" "}
                        {universities.length} universities
                      </div>
                      <Pagination>
                        <Pagination.Prev 
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <Pagination.Item 
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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

      {/* Add University Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New University</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="university_country_id"
                    value={formData.university_country_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries ? countries.map((country: any) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    )) : ""}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Program</Form.Label>
                  <Form.Select
                    name="program_id"
                    value={formData.program_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Program</option>
                    {programs.map((program: any) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus</Form.Label>
                  <Form.Control
                    type="text"
                    name="campus"
                    value={formData.campus}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Entry Type</Form.Label>
                  <Form.Select
                    name="entry_type"
                    value={formData.entry_type}
                    onChange={handleFormChange}
                  >
                    <option value="0">Manual</option>
                    <option value="1">Automated</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fees (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Annual Fees (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="annual_fees"
                    value={formData.annual_fees}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add University"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* University Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>University Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUniversity && (
            <div>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="university-icon">
                      <FaUniversity size={70} color="#007bff" />
                    </div>
                  </div>
                  <h5>{selectedUniversity.name}</h5>
                  <Badge
                    bg={selectedUniversity.entry_type === 1 ? "success" : "info"}
                    className="px-3 py-2"
                  >
                    {selectedUniversity.entry_type === 1 ? "Automated" : "Manual"}
                  </Badge>
                </Col>
                <Col md={8}>
                  <h6 className="border-bottom pb-2 mb-3">
                    University Information
                  </h6>

                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      University ID:
                    </Col>
                    <Col xs={8}>{selectedUniversity.id}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Location:
                    </Col>
                    <Col xs={8}>{selectedUniversity.location || "-"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Campus:
                    </Col>
                    <Col xs={8}>{selectedUniversity.campus || "-"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Fees:
                    </Col>
                    <Col xs={8}>{selectedUniversity.fees ? formatCurrency(selectedUniversity.fees) : "-"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Annual Fees:
                    </Col>
                    <Col xs={8}>{selectedUniversity.annual_fees ? formatCurrency(selectedUniversity.annual_fees) : "-"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Program ID:
                    </Col>
                    <Col xs={8}>{selectedUniversity.program_id || "-"}</Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xs={4} className="text-muted">
                      Description:
                    </Col>
                    <Col xs={8}>{selectedUniversity.description || "-"}</Col>
                  </Row>
                  
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Entry Type:
                    </Col>
                    <Col xs={8}>
                      <Badge
                        bg={selectedUniversity.entry_type === 1 ? "success" : "primary"}
                        className="px-2 py-1"
                      >
                        {selectedUniversity.entry_type === 1 ? "Automated" : "Manual"}
                      </Badge>
                      <small className="text-muted ms-2">
                        {selectedUniversity.entry_type === 1 
                          ? "(System automatically manages entries)" 
                          : "(Entries are managed manually)"}
                      </small>
                    </Col>
                  </Row>
                  
                  <h6 className="border-bottom pb-2 mb-3">Actions</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      className=" d-flex align-items-center"
                      onClick={() => {
                        setShowDetailsModal(false); 
                        handleEditUniversity(selectedUniversity);
                      }}
                    >
                      <FaEdit className="me-1" /> Edit University
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      className=" d-flex align-items-center"
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleDeleteConfirmation(selectedUniversity);
                      }}
                    >
                      <FaTrash className="me-1" /> Delete University
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit University Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit University</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="university_country_id"
                    value={formData.university_country_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries ? countries.map((country: any) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    )) : ""}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Program</Form.Label>
                  <Form.Select
                    name="program_id"
                    value={formData.program_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Program</option>
                    {programs.map((program: any) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus</Form.Label>
                  <Form.Control
                    type="text"
                    name="campus"
                    value={formData.campus}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Entry Type</Form.Label>
                  <Form.Select
                    name="entry_type"
                    value={formData.entry_type}
                    onChange={handleFormChange}
                  >
                    <option value="0">Manual</option>
                    <option value="1">Automated</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fees (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Annual Fees (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="annual_fees"
                    value={formData.annual_fees}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update University"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUniversity && (
            <p>
              Are you sure you want to delete <strong>{selectedUniversity.name}</strong>? 
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUniversity}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete University"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 