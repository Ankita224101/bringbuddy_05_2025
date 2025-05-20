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
  Tab,
  Tabs,
  ListGroup,
} from "react-bootstrap";
import {
  FaUsers,
  FaUserGraduate,
  FaFileAlt,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaEye,
  FaEdit,
  FaUniversity,
  FaGraduationCap,
  FaFileDownload,
  FaFilter,
  FaChartPie,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale,
} from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale
);

interface Student {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  program_id?: number;
  university_id?: number;
  payment_status: number;
  application_submitted: number | string;
  created_at: string;
  academic_documents?: string;
  identification_documents?: string;
  financial_documents?: string;
  payment_receipt?: string;
  other_documents?: string;
  admission_letter?: string;
  affiliation_letter?: string;
  bachelor_certificate?: string;
  bonafide_letter?: string;
  tenth_certificate?: string;
  twelfth_certificate?: string;
  id_proof?: string;
  other_certificate?: string;
  offer_letter?: string;
  ugc_letter?: string;
  visa?: string;
}

// Add interface for commission data
interface Commission {
  amount: number;
  status: number;
  user_id: number;
}

export default function StudentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [universities, setUniversities] = useState<{[key: number]: string}>({});
  const [programs, setPrograms] = useState<{[key: number]: string}>({});
  
  // Add state for university payment receipts
  const [universityPaymentReceipts, setUniversityPaymentReceipts] = useState<{name: string, url: string}[]>([]);
  const [isLoadingPaymentReceipts, setIsLoadingPaymentReceipts] = useState(false);
  
  // Add state for commission data
  const [commission, setCommission] = useState<Commission | null>(null);
  const [isLoadingCommission, setIsLoadingCommission] = useState(false);
  const [claimingCommission, setClaimingCommission] = useState(false);
  
  // CSS styles
  const styles = {
    iconBox: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
    },
    chartContainer: {
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    chartHeader: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
    },
    chartIcon: {
      marginRight: '8px',
      fontSize: '1.2rem',
    }
  };
  
  const router = useRouter();

  useEffect(() => {
    const agent_id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}').id : null;

    if (!agent_id) {
      router.push("/agent/login");
      return;
    }

    fetchStudents(agent_id);
  }, [router]);

  const fetchStudents = async (agent_id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/agent/api/get-agent-students", { agent_id });
      if (response.data && response.data.students) {
        const fetchedStudents = response.data.students || [];
        console.log("Fetched students:", fetchedStudents);
        
        // Map the API response directly without adding mock data
        // The API already includes the document paths
        setStudents(fetchedStudents);
        
        // Fetch university and program data for each student
        fetchedStudents.forEach((student: Student) => {
          if (student.university_id) {
            fetchUniversityById(student.university_id);
          }
          if (student.program_id) {
            fetchProgramById(student.program_id);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUniversityById = async (id: number) => {
    try {
      const response = await axios.post("/api/universities/getuniversitybyid", { id });
      if (response.data && response.data.university) {
        setUniversities(prev => ({
          ...prev,
          [id]: response.data.university.name
        }));
      }
    } catch (error) {
      console.error(`Error fetching university with id ${id}:`, error);
    }
  };

  const fetchProgramById = async (id: number) => {
    try {
      const response = await axios.post("/api/programs/getprogrambyid", { id });
      if (response.data && response.data.program) {
        setPrograms(prev => ({
          ...prev,
          [id]: response.data.program.name
        }));
      }
    } catch (error) {
      console.error(`Error fetching program with id ${id}:`, error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
    
    // Fetch university payment receipts when viewing a student
    fetchUniversityPaymentReceipts(student.id);
    
    // Fetch commission data for the student
    fetchCommissionData(student.id);
  };

  // Function to fetch university payment receipts
  const fetchUniversityPaymentReceipts = async (userId: number) => {
    setIsLoadingPaymentReceipts(true);
    try {
      const response = await axios.post("/api/payment/university-payment/get-university-reciept", { 
        user_id: userId 
      });
      
      console.log("University Payment Receipts:", response.data);
      
      if (response.data && response.data.payment_document) {
        setUniversityPaymentReceipts(response.data.payment_document);
      } else {
        setUniversityPaymentReceipts([]);
      }
    } catch (error) {
      console.error("Error fetching university payment receipts:", error);
      setUniversityPaymentReceipts([]);
    } finally {
      setIsLoadingPaymentReceipts(false);
    }
  };

  // Function to fetch commission data
  const fetchCommissionData = async (userId: number) => {
    setIsLoadingCommission(true);
    try {
      const response = await axios.post("/admin/api/commission/get-commission", { 
        user_id: userId 
      });
      
      console.log("Commission Data:", response.data);
      
      if (response.data) {
        setCommission(response.data.commission);
      } else {
        setCommission(null);
      }
    } catch (error) {
      console.error("Error fetching commission data:", error);
      setCommission(null);
    } finally {
      setIsLoadingCommission(false);
    }
  };

  // Function to handle claiming commission
  const handleClaimCommission = async (userId: number) => {


    toast.success("Claimed commission successfully");

    axios.post("/admin/api/commission/commission-claim-email", {user_id : userId}).then((res) => {
      console.log("Claimed commission email response:", res.data);
      toast.success("Claimed commission email sent successfully");
    }).catch((err) => {
      console.log(err);
      
    })


    // if (!commission || claimingCommission) return;
    
    // setClaimingCommission(true);
    // try {
    //   const response = await axios.post("/admin/api/commission/claim-commission", { 
    //     user_id: userId 
    //   });
      
    //   if (response.data && response.data.success) {
    //     toast.success("Commission claimed successfully");
    //     // Update commission status
    //     setCommission({
    //       ...commission,
    //       status: 0 // Assuming status 0 means claimed
    //     });
    //   } else {
    //     toast.error(response.data.message || "Failed to claim commission");
    //   }
    // } catch (error) {
    //   console.error("Error claiming commission:", error);
    //   toast.error("Failed to claim commission");
    // } finally {
    //   setClaimingCommission(false);
    // }
  };

  const viewDocument = (documentUrl: string, title: string) => {
    if (documentUrl) {
      setPdfUrl(documentUrl);
      setPdfTitle(title);
      setShowPdfModal(true);
    } else {
      toast.error("Document not available");
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUniversityName = (universityId: number | undefined) => {
    if (!universityId) return "Not Specified";
    return universities[universityId] || "Loading...";
  };
  
  const getProgramName = (programId: number | undefined) => { 
    if (!programId) return "Not Specified";
    return programs[programId] || "Loading...";
  };

  const getStatusBadge = (status: number | string) => {
    const statusNum = typeof status === 'string' ? parseInt(status) : status;
    switch (statusNum) {
      case 1:
        return <Badge bg="success">Accepted</Badge>;
      case 0:
        return <Badge bg="warning">Pending</Badge>;
      case -1:
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: number) => {
    return status === 1 ? 
      <Badge bg="success">Paid</Badge> : 
      <Badge bg="warning">Pending</Badge>;
  };

  const hasDocuments = (student: Student) => {
    return !!(
      student.admission_letter ||
      student.offer_letter ||
      student.payment_receipt ||
      student.affiliation_letter ||
      student.bonafide_letter ||
      student.tenth_certificate ||
      student.twelfth_certificate ||
      student.bachelor_certificate ||
      student.id_proof ||
      student.visa ||
      student.ugc_letter ||
      student.other_certificate
    );
  };

  const countDocuments = (student: Student) => {
    let count = 0;
    let total = 11; // Total possible documents
    
    if (student.admission_letter) count++;
    if (student.offer_letter) count++;
    if (student.payment_receipt) count++;
    if (student.affiliation_letter) count++;
    if (student.bonafide_letter) count++;
    if (student.tenth_certificate) count++;
    if (student.twelfth_certificate) count++;
    if (student.bachelor_certificate) count++;
    if (student.id_proof) count++;
    if (student.visa) count++;
    if (student.ugc_letter) count++;
    if (student.other_certificate) count++;
    
    return { count, total, percentage: Math.round((count / total) * 100) };
  };

  // Generate chart data for the student
  const generateChartData = (student: Student) => {
    // Documents data for doughnut chart
    const docData = {
      labels: ['Submitted', 'Pending'],
      datasets: [
        {
          label: 'Documents',
          data: [countDocuments(student).count, countDocuments(student).total - countDocuments(student).count],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Document types for bar chart
    const documentStatus = [
      { name: 'Admission Letter', status: student.admission_letter ? 1 : 0 },
      { name: 'Offer Letter', status: student.offer_letter ? 1 : 0 },
      { name: 'Affiliation Letter', status: student.affiliation_letter ? 1 : 0 },
      { name: 'Bonafide Letter', status: student.bonafide_letter ? 1 : 0 },
      { name: 'UGC Letter', status: student.ugc_letter ? 1 : 0 },
      { name: '10th Certificate', status: student.tenth_certificate ? 1 : 0 },
      { name: '12th Certificate', status: student.twelfth_certificate ? 1 : 0 },
      { name: 'Bachelor Certificate', status: student.bachelor_certificate ? 1 : 0 },
      { name: 'ID Proof', status: student.id_proof ? 1 : 0 },
      { name: 'Payment Receipt', status: student.payment_receipt ? 1 : 0 },
      { name: 'Visa', status: student.visa ? 1 : 0 },
      { name: 'Other Certificate', status: student.other_certificate ? 1 : 0 },
    ];

    const docTypesData = {
      labels: documentStatus.map(doc => doc.name),
      datasets: [
        {
          label: 'Document Status',
          data: documentStatus.map(doc => doc.status),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Student progress radar chart
    const progressData = {
      labels: ['Document Completion', 'Application Status', 'Payment Status', 'Overall Progress'],
      datasets: [
        {
          label: 'Student Progress',
          data: [
            (countDocuments(student).count / countDocuments(student).total) * 100,
            student.application_submitted === 1 || student.application_submitted === "1" ? 100 : 
              student.application_submitted === 0 || student.application_submitted === "0" ? 50 : 0,
            student.payment_status === 1 ? 100 : 0,
            ((countDocuments(student).count / countDocuments(student).total) * 100 + 
             (student.application_submitted === 1 || student.application_submitted === "1" ? 100 : 
               student.application_submitted === 0 || student.application_submitted === "0" ? 50 : 0) + 
             (student.payment_status === 1 ? 100 : 0)) / 3,
          ],
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };

    return {
      docData,
      docTypesData,
      progressData
    };
  };

  // Filter students based on search term and filter status
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "accepted") return matchesSearch && (student.application_submitted === 1 || student.application_submitted === "1");
    if (filterStatus === "pending") return matchesSearch && (student.application_submitted === 0 || student.application_submitted === "0");
    if (filterStatus === "rejected") return matchesSearch && (student.application_submitted === -1 || student.application_submitted === "-1");
    if (filterStatus === "paid") return matchesSearch && student.payment_status === 1;
    if (filterStatus === "unpaid") return matchesSearch && student.payment_status === 0;
    
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="main-agent-content">
      <div className="content-header">
        <h2><FaUsers className="me-2" /> Student Management</h2>
        <p>View and manage all your students and their documents</p>
      </div>

      {/* Student Statistics */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div style={styles.iconBox} className="bg-primary text-white">
                <FaUsers />
              </div>
              <div className="ms-3">
                <h3 className="mb-0">{students.length}</h3>
                <p className="text-muted mb-0">Total Students</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div style={styles.iconBox} className="bg-success text-white">
                <FaCheckCircle />
              </div>
              <div className="ms-3">
                <h3 className="mb-0">{students.filter(student => student.application_submitted === 1 || student.application_submitted === "1").length}</h3>
                <p className="text-muted mb-0">Accepted</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div style={styles.iconBox} className="bg-warning text-white">
                <FaTimesCircle />
              </div>
              <div className="ms-3">
                <h3 className="mb-0">{students.filter(student => student.application_submitted === 0 || student.application_submitted === "0").length}</h3>
                <p className="text-muted mb-0">Pending</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div style={styles.iconBox} className="bg-info text-white">
                <FaFilePdf />
              </div>
              <div className="ms-3">
                <h3 className="mb-0">{students.reduce((total, student) => total + countDocuments(student).count, 0)}</h3>
                <p className="text-muted mb-0">Documents</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <div className="content-card mb-4">
        <div className="content-card-body">
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={8}>
                  <Form.Group>
                    <Form.Select 
                      value={filterStatus}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Students</option>
                      <option value="accepted">Accepted Applications</option>
                      <option value="pending">Pending Applications</option>
                      <option value="rejected">Rejected Applications</option>
                      <option value="paid">Paid Fees</option>
                      <option value="unpaid">Unpaid Fees</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="text-end">
                  <FaFilter className="me-2" /> Filter
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Students Table */}
      <div className="content-card mb-4">
        <div className="content-card-header d-flex justify-content-between align-items-center">
          <h5 className="d-flex align-items-center"><FaUserGraduate className="me-2" /> Students List</h5>
          <span className="badge bg-primary">{filteredStudents.length} Students</span>
        </div>
        <div className="content-card-body">
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" className="me-2" />
              <span>Loading students data...</span>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>University</th>
                      <th>Program</th>
                      <th>Application Status</th>
                      <th>Payment Status</th>
                      <th>Documents</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{getUniversityName(student.university_id)}</td>
                          <td>{getProgramName(student.program_id)}</td>
                          <td>{getStatusBadge(student.application_submitted)}</td>
                          <td>{getPaymentStatusBadge(student.payment_status)}</td>
                          <td>
                            <div className="dropdown">
                              <Button   variant="outline-primary" 
                                size="sm"
                                className="dropdown-toggle d-flex align-items-center"
                                id={`dropdown-documents-${student.id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <FaFilePdf className="me-1" /> Documents
                              </Button>
                              <ul className="dropdown-menu" aria-labelledby={`dropdown-documents-${student.id}`}>
                                {student.admission_letter && (
                                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewDocument(student.admission_letter || "", "Admission Letter"); }}>Admission Letter</a></li>
                                )}
                                {student.offer_letter && (
                                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewDocument(student.offer_letter || "", "Offer Letter"); }}>Offer Letter</a></li>
                                )}
                                {student.payment_receipt && (
                                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewDocument(student.payment_receipt || "", "Payment Receipt"); }}>Payment Receipt</a></li>
                                )}
                                {student.visa && (
                                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewDocument(student.visa || "", "Visa"); }}>Visa</a></li>
                                )}
                                {!student.admission_letter && !student.offer_letter && !student.payment_receipt && !student.visa && (
                                  <li><span className="dropdown-item text-muted">No documents available</span></li>
                                )}
                              </ul>
                            </div>
                          </td>
                          <td>
                            <Button 
                              variant="outline-info" 
                              size="sm" 
                              className="me-1"
                              onClick={() => handleViewStudent(student)}
                            >
                              <FaEye />
                            </Button>
                            {/* <Button 
                              variant="outline-success" 
                              size="sm"      
                              onClick={() => router.push(`/agent/students/edit/${student.id}`)}
                            >
                              <FaEdit />
                            </Button> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredStudents.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
                    {filteredStudents.length} students
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

      {/* Student Details Modal */}
      <Modal
        show={showStudentModal}
        onHide={() => setShowStudentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
    <div>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="student-avatar mb-3">
                    <div style={{ 
                      backgroundColor: "#f8f9fa", 
                      width: "120px", 
                      height: "120px", 
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      fontSize: "3rem",
                      color: "#6c757d"
                    }}>
                      {selectedStudent.name.charAt(0)}
                    </div>
                  </div>
                  <h5>{selectedStudent.name}</h5>
                  <p className="text-muted mb-3">ID: {selectedStudent.id}</p>
                  <div className="mb-3">
                    <p className="mb-1">Document Completion</p>
                    <div className="progress" style={{ height: "10px" }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${countDocuments(selectedStudent).percentage}%`,
                          backgroundColor: countDocuments(selectedStudent).percentage < 50 ? "#ffc107" : "#198754"
                        }} 
                        aria-valuenow={countDocuments(selectedStudent).percentage} 
                        aria-valuemin={0} 
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <small className="text-muted">{countDocuments(selectedStudent).count} of {countDocuments(selectedStudent).total} documents submitted</small>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {getStatusBadge(selectedStudent.application_submitted)}
                    {getPaymentStatusBadge(selectedStudent.payment_status)}
                  </div>
                </Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="info" className="mb-3">
                    <Tab eventKey="info" title="Basic Info">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="d-flex align-items-center"><FaEnvelope className="me-2" /> Email:</span>
                          <span className="text-muted ">{selectedStudent.email}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="d-flex align-items-center"><FaPhone className="me-2" /> Phone:</span>
                          <span className="text-muted">{selectedStudent.phone_number || "Not provided"}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="d-flex align-items-center"><FaUniversity className="me-2" /> University:</span>
                          <span className="text-muted">{getUniversityName(selectedStudent.university_id)}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="d-flex align-items-center"><FaGraduationCap className="me-2" /> Program:</span>
                          <span className="text-muted">{getProgramName(selectedStudent.program_id)}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="d-flex align-items-center"><FaFileAlt className="me-2" /> Registration Date:</span>
                          <span className="text-muted">{formatDate(selectedStudent.created_at)}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    </Tab>
                    <Tab eventKey="documents" title="Documents">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Admission Letter</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.admission_letter || "", "Admission Letter")}
                            disabled={!selectedStudent.admission_letter}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Offer Letter</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.offer_letter || "", "Offer Letter")}
                            disabled={!selectedStudent.offer_letter}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Affiliation Letter</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.affiliation_letter || "", "Affiliation Letter")}
                            disabled={!selectedStudent.affiliation_letter}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Bonafide Letter</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.bonafide_letter || "", "Bonafide Letter")}
                            disabled={!selectedStudent.bonafide_letter}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> UGC Letter</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.ugc_letter || "", "UGC Letter")}
                            disabled={!selectedStudent.ugc_letter}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> 10th Certificate</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.tenth_certificate || "", "10th Certificate")}
                            disabled={!selectedStudent.tenth_certificate}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> 12th Certificate</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.twelfth_certificate || "", "12th Certificate")}
                            disabled={!selectedStudent.twelfth_certificate}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Bachelor Certificate</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.bachelor_certificate || "", "Bachelor Certificate")}
                            disabled={!selectedStudent.bachelor_certificate}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> ID Proof</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.id_proof || "", "ID Proof")}
                            disabled={!selectedStudent.id_proof}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Payment Receipt</span>
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-2"
                              onClick={() => viewDocument(selectedStudent.payment_receipt || "", "Payment Receipt")}
                              disabled={!selectedStudent.payment_receipt || selectedStudent.payment_status === 0}
                            >
                              View Document
                            </Button>
                            <Form.Group className="mb-0">
                              <Form.Control
                                type="file"
                                size="sm"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const formData = new FormData();
                                    formData.append('email', selectedStudent?.email || "");
                                    formData.append('payment_receipt', file);
                                    
                                    toast.loading("Uploading payment receipt...");
                                    axios.post('/admin/api/doc-upload/payment-receipt', formData, {
                                      headers: {
                                        'Content-Type': 'multipart/form-data'
                                      }
                                    })
                                    .then(response => {
                                      toast.dismiss();
                                      toast.success("Payment receipt uploaded successfully");
                                      // Update the student object with the new payment receipt URL
                                      if (selectedStudent) {
                                        setSelectedStudent({
                                          ...selectedStudent,
                                          payment_receipt: response.data.url || selectedStudent.payment_receipt
                                        });
                                      }
                                    })
                                    .catch(error => {
                                      toast.dismiss();
                                      toast.error("Failed to upload payment receipt");
                                      console.error("Error uploading payment receipt:", error);
                                    });
                                  }
                                }}
                              />
                            </Form.Group>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Visa</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.visa || "", "Visa")}
                            disabled={!selectedStudent.visa}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center"><FaFilePdf className="me-2" /> Other Certificate</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewDocument(selectedStudent.other_certificate || "", "Other Certificate")}
                            disabled={!selectedStudent.other_certificate}
                          >
                            View Document
                          </Button>
                        </ListGroup.Item>
                        
                        {/* University Payment Receipts Section */}
                        <ListGroup.Item className="mt-4 border-top pt-3">
                          <h6 className="mb-3 d-flex align-items-center">
                            <FaFilePdf className="me-2 text-primary" /> University Final Payment Receipts
                          </h6>
                          
                          {isLoadingPaymentReceipts ? (
                            <div className="text-center py-3">
                              <Spinner animation="border" size="sm" />
                              <p className="mb-0 mt-2">Loading payment receipts...</p>
                            </div>
                          ) : universityPaymentReceipts && universityPaymentReceipts.length > 0 ? (
                            <div className="document-list">
                              {universityPaymentReceipts.map((receipt, index) => (
                                <div key={index} className="mb-3 pb-2 border-bottom">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="d-flex align-items-center">
                                      <FaFilePdf className="me-2 text-primary" /> 
                                      {receipt.name || `Receipt ${index + 1}`}
                                    </span>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => viewDocument(receipt.url, receipt.name || `Receipt ${index + 1}`)}
                                    >
                                      View Document
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted mb-0">No university payment receipts available.</p>
                          )}
                        </ListGroup.Item>
                      </ListGroup>
                    </Tab>                                                                         
                    <Tab eventKey="application" title="Application">
                      <div className="p-3">
                        <h6>Application Status</h6>
                        <div className="mb-3">
                          {getStatusBadge(selectedStudent.application_submitted)}
                        </div>
                         
                        <h6>Payment Status</h6>
                        <div className="mb-3">
                          {getPaymentStatusBadge(selectedStudent.payment_status)}
                        </div>
                        
                        <h6>Application Timeline</h6>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                              <span>Registration</span>
                              <span className="text-muted">{formatDate(selectedStudent.created_at)}</span>
                            </div>
                            <Badge bg="success">Completed</Badge>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                              <span>Document Submission</span>
                              <span className="text-muted">{formatDate(selectedStudent.created_at)}</span>
                            </div>
                            <Badge bg={hasDocuments(selectedStudent) ? "success" : "warning"}>
                              {hasDocuments(selectedStudent) ? "Completed" : "Pending"}
                            </Badge>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                              <span>Application Review</span>
                              <span className="text-muted">-</span>
                            </div>
                            <Badge bg={selectedStudent.application_submitted === 1 || selectedStudent.application_submitted === "1" ? "success" : "warning"}>
                              {selectedStudent.application_submitted === 1 || selectedStudent.application_submitted === "1" ? "Completed" : "Pending"}
                            </Badge>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                              <span>Payment</span>
                              <span className="text-muted">-</span>
                            </div>
                            <Badge bg={selectedStudent.payment_status === 1 ? "success" : "warning"}>
                              {selectedStudent.payment_status === 1 ? "Completed" : "Pending"}
                            </Badge>
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                    </Tab>
                    <Tab eventKey="charts" title={<span className="d-flex align-items-center"><FaChartPie className="me-2" /> Charts</span>}>
                      <div className="p-3">
                        <Row className="mb-4">
                          <Col md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                              <Card.Header className="bg-light">
                                <h6 className="mb-0 d-flex align-items-center" style={styles.chartHeader}>
                                  <FaChartPie className="me-2 text-primary" style={styles.chartIcon} /> Document Completion
                                </h6>
                              </Card.Header>
                              <Card.Body className="d-flex justify-content-center">
                                <div style={{ width: '220px', height: '220px' }}>
                                  <Doughnut 
                                    data={generateChartData(selectedStudent).docData}
                                    options={{
                                      responsive: true,
                                      plugins: {
                                        legend: {
                                          position: 'bottom',
                                        },
                                        title: {
                                          display: true,
                                          text: 'Document Status',
                                        },
                                      },
                                    }} 
                                  />
                                </div>
                              </Card.Body>
                              <Card.Footer className="bg-white text-center">
                                <small className="text-muted">
                                  {countDocuments(selectedStudent).count} out of {countDocuments(selectedStudent).total} documents submitted ({countDocuments(selectedStudent).percentage}%)
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                          <Col md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                              <Card.Header className="bg-light">
                                <h6 className="mb-0 d-flex align-items-center" style={styles.chartHeader}>
                                  <FaChartLine className="me-2 text-success" style={styles.chartIcon} /> Student Progress
                                </h6>
                              </Card.Header>
                              <Card.Body className="d-flex justify-content-center">
                                <div style={{ width: '260px', height: '260px' }}>
                                  <Radar 
                                    data={generateChartData(selectedStudent).progressData}
                                    options={{
                                      responsive: true,
                                      scales: {
                                        r: {
                                          min: 0,
                                          max: 100,
                                          ticks: {
                                            stepSize: 20
                                          }
                                        }
                                      },
                                      plugins: {
                                        legend: {
                                          position: 'bottom',
                                        },
                                      },
                                    }} 
                                  />
                                </div>
                              </Card.Body>
                              <Card.Footer className="bg-white text-center">
                                <small className="text-muted">
                                  Overall progress across different aspects of the application
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <Card className="shadow-sm">
                              <Card.Header className="bg-light">
                                <h6 className="mb-0 d-flex align-items-center" style={styles.chartHeader}>
                                  <FaChartBar className="me-2 text-info" style={styles.chartIcon} /> Document Status Details
                                </h6>
                              </Card.Header>
                              <Card.Body>
                                <div style={{ height: '300px' }}>
                                  <Bar 
                                    data={generateChartData(selectedStudent).docTypesData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      indexAxis: 'y',
                                      scales: {
                                        x: {
                                          beginAtZero: true,
                                          max: 1,
                                          ticks: {
                                            stepSize: 1,
                                            callback: (value) => value === 0 ? 'Not Submitted' : 'Submitted'
                                          }
                                        }
                                      },
                                      plugins: {
                                        legend: {
                                          display: false,
                                        },
                                        tooltip: {
                                          callbacks: {
                                            label: (context) => {
                                              return context.raw === 0 ? 'Not Submitted' : 'Submitted';
                                            }
                                          }
                                        }
                                      },
                                    }} 
                                  />
                                </div>
                              </Card.Body>
                              <Card.Footer className="bg-white text-center">
                                <small className="text-muted">
                                  Detailed view of each document's submission status
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    
                    {/* New Commission Tab */}
                    <Tab eventKey="commission" title={<span className="d-flex align-items-center"><FaFileDownload className="me-2" /> Commission</span>}>
                      <div className="p-3">
                        <h6 className="mb-4">Commission Details</h6>
                        
                        {isLoadingCommission ? (
                          <div className="text-center py-4">
                            <Spinner animation="border" size="sm" />
                            <p className="mb-0 mt-2">Loading commission data...</p>
                          </div>
                        ) : commission ? (
                          <Card className="border-0 shadow-sm">
                            <Card.Body>
                              <Row>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <h5 className="text-muted mb-1">Amount</h5>
                                    <h3 className="text-success">₹{commission.amount.toLocaleString()}</h3>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <h5 className="text-muted mb-1">Status</h5>
                                    <h3>
                                      {commission.status === 1 ? (
                                        <Badge bg="success">Available</Badge>
                                      ) : (
                                        <Badge bg="secondary">Claimed</Badge>
                                      )}
                                    </h3>
                                  </div>
                                </Col>
                              </Row>
                              
                              {commission.status === 1 && (
                                <div className="mt-3 text-center">
                                  <Button 
                                    variant="primary" 
                                    size="lg"
                                    disabled={commission.payment_reciept !== null}
                                    onClick={() => handleClaimCommission(selectedStudent.id)}
                                  >
                                    {claimingCommission ? (
                                      <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Processing...
                                      </>
                                    ) : (
                                      <> {commission.payment_reciept == null ? "Claim Commission" : "Claimed"} </>
                                    )}
                                  </Button>

                                   {commission?.payment_reciept !== null ? (<a
                                                href={commission?.payment_reciept}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary w-100 d-flex"
                                              >
                                                <FaEye className="me-1" /> View reciept
                                              </a>)
                                              :
                                  (<p className="text-muted mt-2 small">
                                    Click to claim your commission for this student
                                  </p>)}
                                </div>
                              )}
                            </Card.Body>
                          </Card>

                            

                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted">No commission data available for this student.</p>
                          </div>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowStudentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        centered
        size="lg"
        className="pdf-viewer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{pdfTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="pdf-container" style={{ height: "80vh" }}>
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="100%" 
              style={{ border: "none" }} 
              title={pdfTitle}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => window.open(pdfUrl, "_blank")}
          >
            <FaFileDownload className="me-1" /> Download
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowPdfModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      
    </div>
  );
}

