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
  Image,
  Tab,
  Tabs,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import {
  FaUsers,
  FaUserTie,
  FaGraduationCap,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUniversity,
  FaBell,
  FaChartLine,
  FaFileAlt,
  FaFilePdf,
  FaCreditCard,
  FaListAlt,
  FaPassport,
  FaPlaneDeparture
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";
import Sidebar from "../../../../components/agent/Sidebar";
import Header from "../../../../components/agent/Header";

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
}

interface AgentStats {
  totalStudents: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

export default function AgentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [agentProfile, setAgentProfile] = useState({
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone_number: "(123) 456-7890",
    profile_img: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "123 Main St, New York, NY 10001",
    joined_date: "2023-01-15",
    commission_rate: 15,
  });
  const [stats, setStats] = useState<AgentStats>({
    totalStudents: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
  });

  const [universities, setUniversities] = useState<{[key: number]: string}>({});
  const [programs, setPrograms] = useState<{[key: number]: string}>({});
  const [allUniversities, setAllUniversities] = useState<{id: number, name: string}[]>([]);
  const [allPrograms, setAllPrograms] = useState<{id: number, name: string}[]>([]);
  const [countriesList, setCountriesList] = useState<{id: number, name: string}[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerLetterCount, setOfferLetterCount] = useState(0);
  const [submittedApplicationCount, setSubmittedApplicationCount] = useState(0);
  const [paidFeesCount, setPaidFeesCount] = useState(0);
  const [completeProfileCount, setCompleteProfileCount] = useState(0);

  const [commission, setCommission] = useState(0);
  
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionToRequest, setCommissionToRequest] = useState("0");
  const [universityEmail, setUniversityEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [loadingCommission, setLoadingCommission] = useState(false);
  const [claimCommissionEmail, setClaimCommissionEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Fetch countries for the dropdown
    const fetchCountries = async () => {
      try {
        const response = await axios.post("/api/countries/allcountries");
        if (response.data) {
          setCountriesList(response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    
    // Fetch all programs for the dropdown
    const fetchAllPrograms = async () => {
      try {
        const response = await axios.get("/api/programs");
        if (response.data && response.data.programs) {
          setAllPrograms(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    
    fetchCountries();
    fetchAllPrograms();

    const email = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}').email : null;
    const agent_id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}').id : null;

    if (email) {
      axios.post("/agent/api/get-agent", { email: email })
        .then((res) => {
          console.log("agents fetch : ", res.data);
          setAgentProfile(res.data.agents);
          setCommission(res.data.agents.commission)
          
          if (res.data.agents.commission) {
            setCommissionToRequest(res.data.agents.commission.toString());
          }
        })
        .catch((err) => {
          console.error("Error fetching agent:", err);
        });
    }

    if (agent_id) {
      axios
        .post("/agent/api/get-agent-students", { agent_id: agent_id })
        .then((res) => {
          console.log("students fetch : ", res.data);
          const fetchedStudents = res.data.students || [];
          setStudents(fetchedStudents);
          stats.totalStudents = fetchedStudents.length;
          
          const pendingApplications = fetchedStudents.filter((student: Student) => 
            student?.application_submitted === 0 || student?.application_submitted === "0").length;
          const acceptedApplications = fetchedStudents.filter((student: Student) => 
            student?.application_submitted === 1 || student?.application_submitted === "1").length;
          const paidStudents = fetchedStudents.filter((student: Student) => 
            parseInt(String(student.payment_status)) === 1).length;
          const profileCompleted = fetchedStudents.filter((student: Student) => 
            student.name && student.email && student.phone_number).length;
   
          setSubmittedApplicationCount(acceptedApplications);
          setOfferLetterCount(acceptedApplications);
          setPaidFeesCount(paidStudents);
          setCompleteProfileCount(profileCompleted);
          
          stats.pendingApplications = pendingApplications;
          stats.acceptedApplications = acceptedApplications;

          fetchedStudents.forEach((student: Student) => {
            if (student.university_id) {
              fetchUniversityById(student.university_id);
            }
            if (student.program_id) {
              fetchProgramById(student.program_id);
            }
          });
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
        });
    }

    const fetchCommissionData = async () => {
      try {
        setLoadingCommission(true);
        const response = await axios.post('/api/commission/get-commission', {agent_id});
        if (response.data) {
          console.log('commission response  :',response.data);
          
          setCommission(response.data.commission.commission || 0);
          setCommissionToRequest((response.data.commission.commission || 0).toString());
        }
      } catch (error) {
        console.error("Error fetching commission data:", error);
      } finally {
        setLoadingCommission(false);
      }
    };
    
    fetchCommissionData();

    setIsLoading(false);
  }, []);


  const handleclaim = async () => {
    if (!claimCommissionEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      const response = await axios.post("/api/commission/request-commission", {
        commission: commission,
        email: claimCommissionEmail,
      });
      
      if (response.data) {
        toast.success("Commission claim request submitted successfully");
        setClaimCommissionEmail("");
      } else {
        toast.error("Failed to submit commission claim");
      }
    } catch (error) {
      console.error("Error submitting commission claim:", error);
      toast.error("An error occurred while submitting your request");
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
  };
  
  const handleLogout = () => {
    localStorage.removeItem("agent");
    router.push("/agent/login");
    toast.success("Logged out successfully");
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(students.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getUniversityName = (universityId: number | undefined) => {
    if (!universityId) return "Not Specified";
    return universities[universityId] || "Loading...";
  };
  
  const getProgramName = (programId: number | undefined) => { 
    if (!programId) return "Not Specified";
    return programs[programId] || "Loading...";
  };

  const handleEditStudent = (student: Student) => {
    setEditedStudent({...student});
    
    // Find the student's university to determine country
    if (student.university_id) {
      // First get all countries
      axios.post("/api/countries/allcountries")
        .then(res => {
          setCountriesList(res.data);
          
          // Then get the university details to find its country
          axios.post("/api/universities/getuniversitybyid", { id: student.university_id })
            .then(uniRes => {
              if (uniRes.data && uniRes.data.university && uniRes.data.university.country_id) {
                const countryId = uniRes.data.university.country_id.toString();
                setSelectedCountry(countryId);
                
                // Fetch universities for this country
                fetchUniversitiesByCountry(countryId);
              }
            })
            .catch(err => console.error("Error fetching university details:", err));
        })
        .catch(err => console.error("Error fetching countries:", err));
    }
    
    // Fetch all programs
    axios.get("/api/programs")
      .then(res => {
        if (res.data && res.data.programs) {
          setAllPrograms(res.data.programs);
        }
      })
      .catch(err => console.error("Error fetching programs:", err));
    
    setShowEditModal(true);
  };

  const handleUpdateStudent = async () => {
    if (!editedStudent) return;
    
    setIsSubmitting(true);
    try {
      // Create a data object with all the updated fields
      const updateData = {
        id: editedStudent.id,
        name: editedStudent.name,
        email: editedStudent.email,
        phone_number: editedStudent.phone_number,
        university_id: editedStudent.university_id,
        program_id: editedStudent.program_id,
        application_submitted: editedStudent.application_submitted,
        payment_status: editedStudent.payment_status
      };
      
      console.log("Updating student with data:", updateData);
    
      const response = await axios.post("/agent/api/update-student", updateData);
      if (response.data && response.data.success) {
        // Update the student in the local state
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === editedStudent.id ? editedStudent : student
          )
        );
        
        // Update cached university and program names
        if (editedStudent.university_id) {
          fetchUniversityById(editedStudent.university_id);
        }
        
        if (editedStudent.program_id) {
          fetchProgramById(editedStudent.program_id);
        }
        
        toast.success("Student information updated successfully");
        setShowEditModal(false);
      } else {
        toast.error("Failed to update student information");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Error updating student information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedStudent) return;
    
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleCommissionClaimSubmit = async () => {
    if (!commissionToRequest || !universityEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/commission/request-commission", {
        commission: commissionToRequest,
        universityEmail: universityEmail,
        ccEmail: ccEmail || undefined,
        agentId: agentProfile.id,
        agentName: agentProfile.name,
        agentEmail: agentProfile.email
      });
      
      if (response.data && response.data.success) {
        toast.success("Commission claim request submitted successfully");
        setShowCommissionModal(false);
        setUniversityEmail("");
        setCcEmail("");
      } else {
        toast.error("Failed to submit commission claim");
      }
    } catch (error) {
      console.error("Error submitting commission claim:", error);
      toast.error("An error occurred while submitting your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to fetch universities by country
  const fetchUniversitiesByCountry = async (countryId: string) => {
    try {
      const response = await axios.post("/api/universities/getuniversitiesbycountryid", { 
        id: countryId 
      });
      
      if (response.data && response.data.university) {
        setAllUniversities(response.data.university);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load universities");
    }
  };

  return (
    <div className="dashboard-container">
      {/* <Sidebar /> */}
      
      {/* Main Content */}
      <div className="main-agent-content">
        {/* <Header /> */}
        
        {/* Content Area */}
        <div className="dashboard-content">
          {/* Milestone Roadmap */}
          <div className="milestone-roadmap mb-5">
            <div className="roadmap-container">
              <h4 className="roadmap-title">
                Student Application Journey Overview
              </h4>
              <div className="roadmap-path">
                <div
                  className="milestone-marker milestone-1 mt-5 ms-3"
                  data-status={submittedApplicationCount > 0 ? "completed" : "pending"}
                >
                  <div className="milestone-icon">
                    <FaFileAlt />
                  </div>
                  <div className="milestone-number">1</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-2"
                  data-status={completeProfileCount > 0 ? "completed" : "pending"}
                >
                  <div className="milestone-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="milestone-number">2</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-3"
                  data-status={offerLetterCount > 0 ? "current" : "pending"}
                >
                  <div className="milestone-icon">
                    <FaFilePdf />
                  </div>
                  <div className="milestone-number">3</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-4"
                  data-status={paidFeesCount > 0 ? "completed" : "pending"}
                >
                  <div className="milestone-icon">
                    <FaCreditCard />
                  </div>
                  <div className="milestone-number">4</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-5"
                  data-status="pending"
                >
                  <div className="milestone-icon">
                    <FaListAlt />
                  </div>
                  <div className="milestone-number">5</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-6"
                  data-status="pending"
                >
                  <div className="milestone-icon">
                    <FaPassport />
                  </div>
                  <div className="milestone-number">6</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-7 mt-5 me-4"
                  data-status="pending"
                >
                  <div className="milestone-icon">
                    <FaPlaneDeparture />
                  </div>
                  <div className="milestone-number">7</div>
                  <div className="marker-pulse"></div>
                </div>
              </div>
              <div className="milestone-labels">
                <div className="milestone-label milestone-label-1">
                  <h5>Applications</h5>
                  <p className="milestone-status-admin">
                    {submittedApplicationCount > 0 ? submittedApplicationCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-2">
                  <h5>Eligibility</h5>
                  <p className="milestone-status-admin">
                    {completeProfileCount > 0 ? completeProfileCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-3">
                  <h5>Offer Letters</h5>
                  <p className="milestone-status-admin">
                    {offerLetterCount > 0 ? offerLetterCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-4">
                  <h5>Payments</h5>
                  <p className="milestone-status-admin">
                    {paidFeesCount > 0 ? paidFeesCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-5">
                  <h5>Checklist Docs</h5>
                  <p className="milestone-status-admin">0</p>
                </div>
                <div className="milestone-label milestone-label-6">
                  <h5>Embassy</h5>
                  <p className="milestone-status-admin">0</p>
                </div>
                <div className="milestone-label milestone-label-7">
                  <h5>Airport Pickup</h5>
                  <p className="milestone-status-admin">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="mb-0">{stats.totalStudents}</h3>
                  <p className="text-muted">Total Students</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaCheckCircle />
                  </div>
                  <h3 className="mb-0">{stats.acceptedApplications}</h3>
                  <p className="text-muted">Accepted Applications</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon yellow mb-3">
                    <FaTimesCircle />
                  </div>
                  <h3 className="mb-0">{stats.pendingApplications}</h3>
                  <p className="text-muted">Pending Applications</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon purple mb-3">
                    <FaMoneyBillWave />
                  </div>
                  <h3 className="mb-0">
                    ${commission === null ? "0.00" : commission}
                  </h3>
                  <p className="text-muted">Total Commission</p>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="mt-2 mb-2"
                    value={claimCommissionEmail}
                    onChange={(e) => setClaimCommissionEmail(e.target.value)}
                    size="sm"
                  />
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-1"
                    onClick={handleclaim}
                  >
                    Claim Commission
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
 
          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>My Students</h5>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search students..."
                  className="me-2"
                  style={{ width: "200px" }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Form.Select
                  style={{ width: "150px" }}
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </div>
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
                          <th>Payment</th>
                          <th>Added On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <tr key={student.id}>
                              <td>{student.id}</td>
                              <td>{student.name}</td>
                              <td>{student.email}</td>
                              <td>
                                {getUniversityName(student.university_id)}
                              </td>
                              <td>{getProgramName(student.program_id)}</td>
                              <td>
                                <Badge
                                  bg={
                                    parseInt(
                                      String(student.application_submitted)
                                    ) == 1
                                      ? "success"
                                      : parseInt(
                                            String(
                                              student.application_submitted
                                            )
                                          ) == 0
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {parseInt(
                                    String(student.application_submitted)
                                  ) == 1
                                    ? "Accepted"
                                    : parseInt(
                                          String(student.application_submitted)
                                        ) == 0
                                      ? "Pending"
                                      : "Rejected"}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  bg={
                                    parseInt(String(student.payment_status)) ==
                                    1
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {parseInt(String(student.payment_status)) == 1
                                    ? "Paid"
                                    : "Pending"}
                                </Badge>
                              </td>
                              <td>{formatDate(student.created_at)}</td>
                              <td>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleViewStudent(student)}
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <FaEdit />
                                </Button>
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
                  {students.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, students.length)} of{" "}
                        {students.length} students
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
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div
                      style={{
                        backgroundColor:
                          parseInt(
                            String(selectedStudent.application_submitted)
                          ) === 1
                            ? "#28a745"
                            : parseInt(
                                  String(selectedStudent.application_submitted)
                                ) === 0
                              ? "#ffc107"
                              : "#dc3545",
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {parseInt(
                        String(selectedStudent.application_submitted)
                      ) === 1 ? (
                        <FaCheckCircle size={80} color="white" />
                      ) : parseInt(
                          String(selectedStudent.application_submitted)
                        ) === 0 ? (
                        <FaTimesCircle size={80} color="white" />
                      ) : (
                        <FaTimesCircle size={80} color="white" />
                      )}
                    </div>
                  </div>
                  <h5>{selectedStudent.name}</h5>
                  <Badge
                    bg={
                      parseInt(
                        String(selectedStudent.application_submitted)
                      ) === 1
                        ? "success"
                        : parseInt(
                              String(selectedStudent.application_submitted)
                            ) === 0
                          ? "warning"
                          : "danger"
                    }
                    className="px-3 py-2"
                  >
                    {parseInt(String(selectedStudent.application_submitted)) ===
                    1
                      ? "Accepted"
                      : parseInt(
                            String(selectedStudent.application_submitted)
                          ) === 0
                        ? "Pending"
                        : "Rejected"}
                  </Badge>
                </Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="info" className="mb-3">
                    <Tab eventKey="info" title="Student Information">
                      <div className="p-2">
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Student ID:
                          </Col>
                          <Col xs={8}>#{selectedStudent.id}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Full Name:
                          </Col>
                          <Col xs={8}>{selectedStudent.name}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Email:
                          </Col>
                          <Col xs={8}>{selectedStudent.email}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Phone:
                          </Col>
                          <Col xs={8}>{selectedStudent.phone_number}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Application Date:
                          </Col>
                          <Col xs={8}>
                            {formatDate(selectedStudent.created_at)}
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="application" title="Application Details">
                      <div className="p-2">
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            University:
                          </Col>
                          <Col xs={8}>
                            {getUniversityName(selectedStudent.university_id)}
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Program:
                          </Col>
                          <Col xs={8}>
                            {getProgramName(selectedStudent.program_id)}
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Application Status:
                          </Col>
                          <Col xs={8}>
                            <Badge
                              bg={
                                parseInt(
                                  String(selectedStudent.application_submitted)
                                ) === 1
                                  ? "success"
                                  : parseInt(
                                        String(
                                          selectedStudent.application_submitted
                                        )
                                      ) === 0
                                    ? "warning"
                                    : "danger"
                              }
                            >
                              {parseInt(
                                String(selectedStudent.application_submitted)
                              ) === 1
                                ? "Accepted"
                                : parseInt(
                                      String(
                                        selectedStudent.application_submitted
                                      )
                                    ) === 0
                                  ? "Pending"
                                  : "Rejected"}
                            </Badge>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Payment Status:
                          </Col>
                          <Col xs={8}>
                            <Badge
                              bg={
                                parseInt(
                                  String(selectedStudent.payment_status)
                                ) === 1
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {parseInt(
                                String(selectedStudent.payment_status)
                              ) === 1
                                ? "Paid"
                                : "Pending"}
                            </Badge>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Commission:
                          </Col>
                          <Col xs={8}>
                            {parseInt(
                              String(selectedStudent.application_submitted)
                            ) === 1
                              ? formatCurrency(500)
                              : "-"}
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Commission Status:
                          </Col>
                          <Col xs={8}>
                            {parseInt(
                              String(selectedStudent.application_submitted)
                            ) === 1 ? (
                              <Badge bg="info">Pending Payout</Badge>
                            ) : (
                              "-"
                            )}
                          </Col>
                        </Row>
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
          <Button 
            variant="primary"
            onClick={() => {
              setShowStudentModal(false);
              if (selectedStudent) {
                handleEditStudent(selectedStudent);
              }
            }}
          >
            Edit Details
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedStudent && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editedStudent.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editedStudent.email}
                      onChange={handleInputChange}
                    />
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
                      value={editedStudent.phone_number || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Application Status</Form.Label>
                    <Form.Select
                      name="application_submitted"
                      value={editedStudent.application_submitted}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          application_submitted: e.target.value,
                        })
                      }
                    >
                      <option value="1">Accepted</option>
                      <option value="2">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                      value={selectedCountry}
                      onChange={(e) => {
                        const countryId = e.target.value;
                        setSelectedCountry(countryId);
                        fetchUniversitiesByCountry(countryId);
                        // Reset university selection when country changes
                        setEditedStudent({
                          ...editedStudent!,
                          university_id: undefined
                        });
                      }}
                    >
                      <option value="">Select Country</option>
                      {countriesList.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>University</Form.Label>
                    <Form.Select
                      value={editedStudent.university_id || ""}
                      onChange={(e) => {
                        const universityId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedStudent({
                          ...editedStudent!,
                          university_id: universityId
                        });
                      }}
                      disabled={!selectedCountry || allUniversities.length === 0}
                    >
                      <option value="">Select University</option>
                      {allUniversities.map((university) => (
                        <option key={university.id} value={university.id}>
                          {university.name}
                        </option>
                      ))}
                    </Form.Select>
                    {!selectedCountry && (
                      <Form.Text className="text-muted">
                        Please select a country first
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Program</Form.Label>
                    <Form.Select
                      value={editedStudent.program_id || ""}
                      onChange={(e) => {
                        const programId = e.target.value ? parseInt(e.target.value) : undefined;
                        setEditedStudent({
                          ...editedStudent!,
                          program_id: programId
                        });
                      }}
                    >
                      <option value="">Select Program</option>
                      {allPrograms.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      name="payment_status"
                      value={editedStudent.payment_status}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          payment_status: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>Paid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateStudent}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Commission Request Modal */}
      <Modal
        show={showCommissionModal}
        onHide={() => setShowCommissionModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Commission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Commission Amount ($)</Form.Label>
              <Form.Control
                type="number"
                value={commissionToRequest}
                onChange={(e) => setCommissionToRequest(e.target.value)}
                placeholder="Enter commission amount"
                required
              />
              <Form.Text className="text-muted">
                You can adjust this value if needed.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>University Email *</Form.Label>
              <Form.Control
                type="email"
                value={universityEmail}
                onChange={(e) => setUniversityEmail(e.target.value)}
                placeholder="Enter university email"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>CC Email (Optional)</Form.Label>
              <Form.Control
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="Enter cc email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommissionModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCommissionClaimSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        /* Milestone Roadmap Styles */
        .milestone-roadmap {
          padding: 40px 25px;
          background: linear-gradient(135deg, #fff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
          margin-top: 20px;
          margin-bottom: 30px;
          animation: fadeIn 0.8s ease-out;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .roadmap-title {
          text-align: center;
          margin-bottom: 35px;
          color: #333;
          font-weight: 600;
          font-size: 24px;
          animation: fadeIn 0.8s ease-out;
          position: relative;
          display: inline-block;
          left: 50%;
          transform: translateX(-50%);
        }

        .roadmap-title:after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #5470ff, #8c94ff);
          border-radius: 10px;
        }

        .roadmap-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .roadmap-path {
          height: 142px;
          background: url("/road-path-bg.svg") no-repeat center center;
          background-size: contain;
          position: relative;
          margin: 0 auto 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 6%;
          animation: fadeIn 1s ease-out;
          padding-bottom: 80px;
        }

        .milestone-marker {
          width: 50px;
          height: 50px;
          border-radius: 50% 50% 50% 0;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: rotate(-45deg);
          animation: popIn 0.6s ease-out forwards;
          animation-delay: calc(var(--i) * 0.2s);
          opacity: 0;
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.6) rotate(-45deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.1) rotate(-45deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-45deg);
          }
        }

        .milestone-1 {
          animation-delay: 0.2s;
          --i: 1;
          background: linear-gradient(135deg, #dc3545, #ff5f6d);
          color: white;
        }

        .milestone-2 {
          animation-delay: 0.4s;
          --i: 2;
          background: linear-gradient(135deg, #fd7e14, #ffad5f);
          color: white;
        }

        .milestone-3 {
          animation-delay: 0.6s;
          --i: 3;
          background: linear-gradient(135deg, #20c997, #4adcb5);
          color: white;
        }

        .milestone-4 {
          animation-delay: 0.8s;
          --i: 4;
          background: linear-gradient(135deg, #6610f2, #8c5cf7);
          color: white;
        }

        .milestone-5 {
          animation-delay: 1s;
          --i: 5;
          background: linear-gradient(135deg, #4299e1, #63b3ed);
          color: white;
        }

        .milestone-6 {
          animation-delay: 1.2s;
          --i: 6;
          background: linear-gradient(135deg, #805ad5, #9f7aea);
          color: white;
        }

        .milestone-7 {
          animation-delay: 1.4s;
          --i: 7;
          background: linear-gradient(135deg, #38b2ac, #4fd1c5);
          color: white;
        }

        .milestone-marker[data-status="pending"] {
          background: linear-gradient(135deg, #e9ecef, #dee2e6);
          color: #6c757d;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .milestone-marker[data-status="pending"].milestone-1,
        .milestone-marker[data-status="pending"].milestone-2,
        .milestone-marker[data-status="pending"].milestone-3,
        .milestone-marker[data-status="pending"].milestone-4,
        .milestone-marker[data-status="pending"].milestone-5,
        .milestone-marker[data-status="pending"].milestone-6,
        .milestone-marker[data-status="pending"].milestone-7 {
          background: linear-gradient(135deg, #e9ecef, #dee2e6);
          color: #6c757d;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .milestone-marker[data-status="current"] {
          background: linear-gradient(135deg, #007bff, #63b3ff);
          color: white;
          transform: rotate(-45deg) scale(1.12);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
          z-index: 3;
        }

        .milestone-marker[data-status="completed"] {
          background: linear-gradient(135deg, #28a745, #48c76a);
          color: white;
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }

        .milestone-icon {
          font-size: 20px;
          transform: rotate(45deg);
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
        }

        .milestone-number {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #343a40;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          transform: rotate(45deg);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50% 50% 50% 0;
          animation: none;
        }

        .milestone-marker[data-status="current"] .marker-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(0, 123, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
          }
        }

        .milestone-labels {
          display: flex;
          justify-content: space-between;
          text-align: center;
          padding: 0 5%;
        }

        .milestone-label {
          flex: 1;
          max-width: 150px;
          padding: 0 10px;
          transition: all 0.3s ease;
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: calc(var(--i) * 0.2s + 0.2s);
          opacity: 0;
        }

        .milestone-label-1 {
          animation-delay: 0.3s;
          --i: 1;
        }

        .milestone-label-2 {
          animation-delay: 0.5s;
          --i: 2;
        }

        .milestone-label-3 {
          animation-delay: 0.7s;
          --i: 3;
        }

        .milestone-label-4 {
          animation-delay: 0.9s;
          --i: 4;
        }

        .milestone-label-5 {
          animation-delay: 1.1s;
          --i: 5;
        }

        .milestone-label-6 {
          animation-delay: 1.3s;
          --i: 6;
        }

        .milestone-label-7 {
          animation-delay: 1.5s;
          --i: 7;
        }

        .milestone-label h5 {
          font-size: 16px;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
        }

        .milestone-status-admin {
          font-size: 16px;
          margin: 0;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 12px;
          display: inline-block;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.7)
          );
          box-shadow:
            0 3px 10px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.05);
          color: #333;
          transition: all 0.3s ease;
        }

        .milestone-label:hover .milestone-status-admin {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 767px) {
          .roadmap-path {
            height: 100px;
            margin-bottom: 70px;
          }

          .milestone-marker {
            width: 45px;
            height: 45px;
          }

          .milestone-icon {
            font-size: 18px;
          }

          .milestone-number {
            width: 22px;
            height: 22px;
            font-size: 11px;
            top: -8px;
            right: -8px;
          }

          .milestone-label h5 {
            font-size: 14px;
          }

          .milestone-status-admin {
            font-size: 12px;
            padding: 2px 6px;
          }

          .milestone-labels {
            flex-wrap: wrap;
          }

          .milestone-label {
            flex: 0 0 50%;
            max-width: 50%;
            margin-bottom: 15px;
          }
        }

        @media (max-width: 575px) {
          .roadmap-path {
            height: 80px;
          }

          .milestone-marker {
            width: 38px;
            height: 38px;
          }

          .milestone-icon {
            font-size: 16px;
          }

          .milestone-number {
            width: 20px;
            height: 20px;
            font-size: 10px;
            top: -6px;
            right: -6px;
          }

          .milestone-label {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
