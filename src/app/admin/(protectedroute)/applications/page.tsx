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
  Tabs,
  Tab,
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
  FaChartBar,
  FaClipboardCheck,
  FaClipboardList,
  FaHourglassHalf,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";

// Define interfaces for data types
interface Application {
  id: number;
  user_id: number;
  name: string;
  email: string;
  program_id?: number;
  university_id?: number;
  phone_number?: string;
  status: string;
  application_submitted: number;
  created_at: string;
  updated_at?: string;
}

interface ApplicationStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function ApplicationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const router = useRouter();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // Fetch all applications
      const response = await axios.get("/admin/api/applications");
      
      if (response.data && response.data.students) {
        // Map students data to applications 
        let applications = response.data.students.map((student: any) => ({
          id: student.id,
          user_id: student.id,
          name: student.name,
          email: student.email,
          program_id: student.program_id,
          phone_number: student.phone_number,
          // Determine status based on application_submitted
          status: student.application_status || (student.application_submitted === 1 ? "submitted" : "pending"),
          application_submitted: student.application_submitted || 0,
          created_at: student.created_at,
          updated_at: student.updated_at,
        }));
        
        // Filter applications based on search term
        if (searchTerm) {
          applications = applications.filter((app: Application) => 
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter applications based on status
        if (filterStatus !== "all") {
          applications = applications.filter((app: Application) => 
            app.status === filterStatus
          );
        }
        
        setApplications(applications);
        
        // Calculate stats
        const total = applications.length;
        const submitted = applications.filter((app: Application) => app.application_submitted === 1).length;
        const pending = applications.filter((app: Application) => app.application_submitted === 0).length;
        const rejected = applications.filter((app: Application) => app.status === "rejected").length;
        
        setStats({
          total,
          approved: submitted, // Rename approved to submitted in the stats
          pending,
          rejected,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications data");
      setIsLoading(false);
      
      // Use mock data as fallback
      const mockApplications = [
        { id: 1, user_id: 1, name: "John Smith", email: "john@example.com", program_id: 1, phone_number: "1234567890", status: "submitted", application_submitted: 1, created_at: "2023-05-10" },
        { id: 2, user_id: 2, name: "Emily Johnson", email: "emily@example.com", program_id: 2, phone_number: "2345678901", status: "pending", application_submitted: 0, created_at: "2023-05-12" },
        { id: 3, user_id: 3, name: "Michael Wilson", email: "michael@example.com", program_id: 3, phone_number: "3456789012", status: "rejected", application_submitted: 1, created_at: "2023-05-15" },
        { id: 4, user_id: 4, name: "Sarah Brown", email: "sarah@example.com", program_id: 1, phone_number: "4567890123", status: "pending", application_submitted: 0, created_at: "2023-05-18" },
        { id: 5, user_id: 5, name: "David Lee", email: "david@example.com", program_id: 2, phone_number: "5678901234", status: "submitted", application_submitted: 1, created_at: "2023-05-20" },
      ];
      
      setApplications(mockApplications);
      
      // Calculate stats from mock data
      const total = mockApplications.length;
      const submitted = mockApplications.filter(app => app.application_submitted === 1).length;
      const pending = mockApplications.filter(app => app.application_submitted === 0).length;
      const rejected = mockApplications.filter(app => app.status === "rejected").length;
      
      setStats({
        total,
        approved: submitted,
        pending,
        rejected,
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);
  
  // Debounce search term input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };
  
  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      // Update application status
      const response = await axios.put(`/admin/api/applications/${applicationId}`, {
        status: newStatus
      });
      
      if (response.data.message) {
        toast.success(`Application status updated to ${newStatus}`);
        fetchApplications();
        setShowApplicationModal(false);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Error updating application status. Please try again.");
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}

      {/* Main Content */}
      <div
        className={`main-admin-content w-100 ${sidebarCollapsed ? "content-collapsed" : ""}`}
      >
        {/* Content Area */}
        <div className="dashboard-content">
          {/* Application Statistics */}
          <Row className="mb-4">
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaClipboardList />
                  </div>
                  <h3 className="mb-0">{stats.total}</h3>
                  <p className="text-muted">Total Applications</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaCheckCircle />
                  </div>
                  <h3 className="mb-0">{stats.approved}</h3>
                  <p className="text-muted">submitted</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon yellow mb-3">
                    <FaHourglassHalf />
                  </div>
                  <h3 className="mb-0">{stats.pending}</h3>
                  <p className="text-muted">Pending</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon red mb-3">
                    <FaTimesCircle />
                  </div>
                  <h3 className="mb-0">{stats.rejected}</h3>
                  <p className="text-muted">Rejected</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Application Management</h5>
              <div className="d-flex">
                <Form.Select
                  className="me-2"
                  style={{ width: "150px" }}
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="submitted">submitted</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </div>
            </div>
            <div className="content-card-body">
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading applications data...</span>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Applied On</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentApplications.length > 0 ? (
                          currentApplications.map((application) => (
                            <tr key={application.id}>
                              <td>{application.id}</td>
                              <td>{application.name}</td>
                              <td>{application.email}</td>
                              <td>{application.phone_number}</td>
                              <td>{formatDate(application.created_at)}</td>
                              <td>
                                <Badge
                                  bg={
                                    application.status === "submitted"
                                      ? "success"
                                      : application.status === "pending"
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {application.status}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="me-1"
                                  onClick={() =>
                                    handleViewApplication(application)
                                  }
                                >
                                  <FaEye />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No applications found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {applications.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, applications.length)} of{" "}
                        {applications.length} applications
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
      </div>

      {/* Application Details Modal */}
      <Modal
        show={showApplicationModal}
        onHide={() => setShowApplicationModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={selectedApplication?.profile_img}
                      alt={selectedApplication.name}
                      className="rounded-circle img-fluid mb-3 w-25 "
                      style={{ maxWidth: "150px" }}
                    />
                    <h5>{selectedApplication.name}</h5>
                  </div>
                  <Badge
                    bg={
                      selectedApplication.status === "submitted"
                        ? "success"
                        : selectedApplication.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                    className="px-3 py-2"
                  >
                    {selectedApplication.status}
                  </Badge>
                </Col>
                <Col md={8}>
                  <h6 className="border-bottom pb-2 mb-3">
                    Student Information
                  </h6>

                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Full Name:
                    </Col>
                    <Col xs={8}>{selectedApplication.name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Email:
                    </Col>
                    <Col xs={8}>{selectedApplication.email}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Phone:
                    </Col>
                    <Col xs={8}>{selectedApplication.phone_number}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Program ID:
                    </Col>
                    <Col xs={8}>{selectedApplication.program_id}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Applied On:
                    </Col>
                    <Col xs={8}>
                      {formatDate(selectedApplication.created_at)}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Status:
                    </Col>
                    <Col xs={8}>{selectedApplication.status}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Application Submitted:
                    </Col>
                    <Col xs={8}>
                      {selectedApplication.application_submitted === 1
                        ? "Yes"
                        : "No"}
                    </Col>
                  </Row>

                  {/* <h6 className="border-bottom pb-2 mb-3 mt-4">Documents</h6>
                  <div className="mb-3">
                    <p className="mb-1">ID Proof:</p>
                    <Button variant="outline-primary" size="sm">
                      <FaEye className="me-1" /> View Document
                    </Button>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">10th Certificate:</p>
                    <Button variant="outline-primary" size="sm">
                      <FaEye className="me-1" /> View Document
                    </Button>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">12th Certificate:</p>
                    <Button variant="outline-primary" size="sm">
                      <FaEye className="me-1" /> View Document
                    </Button>
                  </div> */}

                  <h6 className="border-bottom pb-2 mb-3 mt-4">Decision</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      className=" d-flex align-items-center"
                      onClick={() =>
                        handleStatusChange(selectedApplication.id, "submitted")
                      }
                      disabled={selectedApplication.status === "submitted"}
                    >
                      <FaCheckCircle className="me-1" /> Mark as submitted
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(selectedApplication.id, "pending")
                      }
                      disabled={selectedApplication.status === "pending"}
                      className=" d-flex align-items-center"
                    >
                      <FaHourglassHalf className="me-1" /> Mark as Pending
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(selectedApplication.id, "rejected")
                      }
                      disabled={selectedApplication.status === "rejected"}
                      className=" d-flex align-items-center"
                    >
                      <FaTimesCircle className="me-1" /> Reject
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
            onClick={() => setShowApplicationModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 