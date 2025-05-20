"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Script from "next/script";
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
} from "react-bootstrap";
import {
  FaUsers,
  FaUser,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaUserEdit,
  FaSearch,
  FaFilter,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFileAlt,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";


interface Student {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  program_id?: number;
  payment_status: number;
  created_at: string;
  application_submitted?: number;
  university_id?: number;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_img: string;
  id_proof: string;
  address: string;
  students: number;
  created_at: string;
  country_id?: number;
  country_code?: number;
  otp?: number;
  otp_expires_at?: string;
}

interface AgentStats {
  total: number;
  totalStudents: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AgentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentStudents, setAgentStudents] = useState<{[key: number]: number}>({});
  const [studentDetails, setStudentDetails] = useState<{[key: number]: Student[]}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showIdProofModal, setShowIdProofModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  
  const [commissionForm, setCommissionForm] = useState({
    amount: "",
    email: "",
    cc: ""
  });
  
  const [stats, setStats] = useState<AgentStats>({
    total: 0,
    totalStudents: 0,
  });
  
  
  const [loadingCommission, setLoadingCommission] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const router = useRouter();

  const fetchAgentStudents = async (agentId: number) => {
    try {
      const response = await axios.post("/agent/api/get-agent-students", { agent_id: agentId });
      if (response.data && response.data.students) {
        const students = response.data.students || [];
        const studentCount = students.length;
        setAgentStudents(prev => ({
          ...prev,
          [agentId]: studentCount
        }));
        setStudentDetails(prev => ({
          ...prev,
          [agentId]: students
        }));
        return studentCount;
      }
      return 0;
    } catch (error) {
      console.error(`Error fetching students for agent ${agentId}:`, error);
      return 0;
    }
  };

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/admin/api/agents");
      console.log("agents fetch : ", response.data);
      
      if (response.data && response.data.agents) {
        // Filter out "Agent" named entries (fake agents)
        const realAgents = response.data.agents;
        
        setAgents(realAgents);
        
        // Fetch student counts for each agent
        let totalStudentCount = 0;
        const studentPromises = realAgents.map((agent: Agent) => fetchAgentStudents(agent.id));
        const studentCounts = await Promise.all(studentPromises);
        totalStudentCount = studentCounts.reduce((total, count) => total + count, 0);
        
        setStats({
          total: realAgents.length,
          totalStudents: totalStudentCount,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAgents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentModal(true);
    
    // Fetch commission data when agent modal opens
    fetchAgentCommission(agent.id);
  };
  
  const handleViewIdProof = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowIdProofModal(true);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update handler for commission submission with Razorpay integration
  const handleCommissionSubmit = () => {
    if (!selectedAgent) return;
    
    if (!commissionForm.amount) {
      toast.error("Please enter commission amount");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(commissionForm.amount) * 100, // Convert to smallest currency unit
        currency: "USD",
        name: "Bring Your Buddy",
        description: "Agent Commission Payment",
        prefill: {
          name: selectedAgent?.name || "",
          email: selectedAgent?.email || "",
          contact: selectedAgent?.phone_number || "",
        },
        theme: {
          color: "#FB0200",
        },
        modal: {
          confirm_close: true,
        },
        handler: function (response) {
          handlePaymentSuccess(response);
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
        setIsProcessingPayment(false);
      });

      rzp1.open();
    } catch (err) {
      console.error("Error initializing payment:", err);
      toast.error("Something went wrong. Please try again.");
      setIsProcessingPayment(false);
    }
  };
  
  // Add handler for successful payment
  const handlePaymentSuccess = (response) => {
    axios.post("/api/commission/payment-commission", {
      agent_id: selectedAgent.id,
      commission: commissionForm.amount,
      payment_id: response.razorpay_payment_id,
      payment_status: 'completed'
    })
      .then(response => {
        toast.success("Commission payment processed successfully");
        
        // Clear form
        setCommissionForm({
          amount: "",
          email: "",
          cc: ""
        });
        
        fetchAgentCommission(selectedAgent.id);
        setIsProcessingPayment(false);
      })
      .catch(error => {
        console.error("Error sending commission payment data:", error);
        toast.error("Payment processed but failed to update records. Please contact support.");
        setIsProcessingPayment(false);
      });
  };

  // Add function to fetch agent commission
  const fetchAgentCommission = async (agentId: number) => {
    setLoadingCommission(true);
    try {
      const response = await axios.post('/api/commission/get-commission', {agent_id: agentId});
      console.log('commission response:', response.data);
      
      if (response.data && response.data.commission) {
        // Update commission form with value from API
        setCommissionForm(prev => ({
          ...prev,
          amount: (response.data.commission.commission || 0).toString()
        }));
      }
    } catch (error) {
      console.error("Error fetching commission data:", error);
    } finally {
      setLoadingCommission(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = agents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(agents.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getIdProofUrl = (idProof: string) => {
    // If the path is empty or undefined, return a placeholder
    if (!idProof) {
      return "https://via.placeholder.com/400x300?text=No+ID+Proof+Available";
    }

    // Format the URL properly
    let formattedUrl = idProof;
    if (!idProof.startsWith('http') && !idProof.startsWith('/')) {
      formattedUrl = `/${idProof}`;
    }

    // Get the absolute URL for the document
    const baseUrl = window.location.origin;
    const absoluteUrl = idProof.startsWith('http') ? idProof : `${baseUrl}${formattedUrl}`;
    
    // Check if it's a PDF file
    const isPdf = idProof.toLowerCase().endsWith('.pdf');
    
    // If it's a PDF, use Google Docs Viewer
    if (isPdf) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
    }
    
    // Otherwise return the direct URL for images
    return absoluteUrl;
  };

  return (
    <div className="dashboard-container">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Main Content */}
      <div className="main-admin-content w-100">
        {/* Content Area */}
        <div className="dashboard-content">
          {/* Agent Statistics */}
          <Row className="mb-4">
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaUserTie />
                  </div>
                  <h3 className="mb-0">{stats.total}</h3>
                  <p className="text-muted">Total Agents</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon purple mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="mb-0">{stats.totalStudents}</h3>
                  <p className="text-muted">Total Students</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Agent Management</h5>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search agents..."
                  className="me-2"
                  style={{ width: "200px" }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="content-card-body">
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading agents data...</span>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Agent</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Students</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAgents.length > 0 ? (
                          currentAgents.map((agent) => (
                            <tr key={agent.id}>
                              <td>{agent.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Image 
                                    src={agent.profile_img} 
                                    roundedCircle 
                                    width={40} 
                                    height={40} 
                                    className="me-2"
                                    alt={agent.name}
                                  />
                                  {agent.name}
                                </div>
                              </td>
                              <td>{agent.email}</td>
                              <td>{agent.phone_number}</td>
                              <td>
                                <Badge bg="primary" pill>
                                  {agentStudents[agent.id] || 0} students
                                </Badge>
                              </td>
                              <td>{formatDate(agent.created_at)}</td>
                              <td>
                                <Button 
                                  variant="light" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleViewAgent(agent)}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="light" 
                                  size="sm"
                                  onClick={() => handleViewIdProof(agent)}
                                >
                                  <FaIdCard />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center">
                              No agents found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {agents.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, agents.length)} of{" "}
                        {agents.length} agents
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
            &copy; {new Date().getFullYear()} Bring Your Buddy | Admin Dashboard
          </div>
          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <Modal
        show={showAgentModal}
        onHide={() => setShowAgentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAgent && (
            <div>
              <Row>
                <Col md={4} className="text-center mb-4 ">
                  <div className="d-flex flex-column align-items-center">
                    <Image 
                    src={selectedAgent.profile_img} 
                    roundedCircle 
                    width={150} 
                    height={150} 
                    className="mb-3 shadow"
                    alt={selectedAgent.name}
                  />
                  <h5>{selectedAgent.name}</h5>
                  <div className="mt-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewIdProof(selectedAgent)}
                      className="d-flex align-items-center"
                    >
                      <FaIdCard className="me-1" /> View ID Proof
                    </Button>
                  </div>
                  </div>
                </Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="info" className="mb-3">
                    <Tab eventKey="info" title="Basic Info">
                      <div className="p-2">
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Agent ID:
                          </Col>
                          <Col xs={8}>#{selectedAgent.id}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Full Name:
                          </Col>
                          <Col xs={8}>{selectedAgent.name}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Email:
                          </Col>
                          <Col xs={8}>{selectedAgent.email}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Phone:
                          </Col>
                          <Col xs={8}>{selectedAgent.phone_number}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Address:
                          </Col>
                          <Col xs={8}>{selectedAgent.address}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Country ID:
                          </Col>
                          <Col xs={8}>{selectedAgent.country_id || 'Not specified'}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="text-muted">
                            Joined Date:
                          </Col>
                          <Col xs={8}>{formatDate(selectedAgent.created_at)}</Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="students" title={`Students (${agentStudents[selectedAgent.id] || 0})`}>
                      <div className="p-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {agentStudents[selectedAgent.id] > 0 && studentDetails[selectedAgent.id]?.length > 0 ? (
                          <ListGroup>
                            {studentDetails[selectedAgent.id].map(student => (
                              <ListGroup.Item key={student.id} className="mb-2 border rounded">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <div className="fw-bold">{student.name}</div>
                                    <div className="text-muted small d-flex align-items-center">
                                      <FaEnvelope className="me-1" /> {student.email}
                                    </div>
                                    {student.phone_number && (
                                      <div className="text-muted small  d-flex align-items-center">
                                        <FaPhone className="me-1" /> {student.phone_number}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <Badge 
                                      bg={parseInt(String(student.application_submitted)) === 1 ? "success" : "warning"}
                                      className="me-2"
                                    >
                                      {parseInt(String(student.application_submitted)) === 1 ? "Application Submitted" : "Pending"}
                                    </Badge>
                                    <Badge bg={student.payment_status === 1 ? "success" : "warning"}>
                                      {student.payment_status === 1 ? "Paid" : "Pending Payment"}
                                    </Badge>
                                  </div>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between small">
                                  <span>ID: #{student.id}</span>
                                  <span>Joined: {formatDate(student.created_at)}</span>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <p className="text-center py-3">This agent has no registered students yet.</p>
                        )}
                      </div>
                    </Tab>
                    
                    {/* Disperse Commission Tab */}
                    <Tab eventKey="commission" title="Disperse Commission">
                      <div className="p-2">
                        <Card className="border">
                          <Card.Header className="bg-light">
                            <h6 className="mb-0 d-flex align-items-center">
                              <FaFileAlt className="me-2 text-primary" /> Release of Commission
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <Form>
                              <Form.Group className="mb-3">
                                <Form.Label>Commission Amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder={loadingCommission ? "Loading..." : "Enter commission amount"}
                                  value={commissionForm.amount}
                                  onChange={(e) => setCommissionForm({...commissionForm, amount: e.target.value})}
                                  disabled={loadingCommission || isProcessingPayment}
                                />
                                {loadingCommission && (
                                  <div className="text-center mt-2">
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    <small className="text-muted">Loading commission data...</small>
                                  </div>
                                )}
                              </Form.Group>
                              
                              <Button 
                                variant="primary" 
                                onClick={handleCommissionSubmit}
                                disabled={loadingCommission || isProcessingPayment || !commissionForm.amount}
                              >
                                {isProcessingPayment ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-2"
                                    />
                                    Processing Payment...
                                  </>
                                ) : (
                                  <>
                                    <FaPaperPlane className="me-1" /> Pay Commission
                                  </>
                                )}
                              </Button>
                            </Form>
                          </Card.Body>
                        </Card>
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
            onClick={() => setShowAgentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ID Proof Modal */}
      <Modal
        show={showIdProofModal}
        onHide={() => setShowIdProofModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ID Proof</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedAgent && (
            <div>
              <p><strong>{selectedAgent.name}'s ID Document</strong></p>
              {selectedAgent.id_proof && (
                <div className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.open(selectedAgent.id_proof.startsWith('http') 
                      ? selectedAgent.id_proof 
                      : `${window.location.origin}${selectedAgent.id_proof.startsWith('/') ? selectedAgent.id_proof : `/${selectedAgent.id_proof}`}`, 
                      '_blank')}
                  >
                    <FaFileAlt className="me-1" /> Open in New Tab / Download
                  </Button>
                </div>
              )}
              <div className="id-proof-container">
                {selectedAgent.id_proof && selectedAgent.id_proof.toLowerCase().endsWith('.pdf') ? (
                  <div>
                    <iframe
                      src={getIdProofUrl(selectedAgent.id_proof)}
                      width="100%"
                      height="500px"
                      style={{ border: "1px solid #ddd" }}
                      allowFullScreen
                    />
                    <p className="text-muted mt-2 small">
                      <em>Note: If the document doesn't load properly, use the "Open in New Tab" button above.</em>
                    </p>
                  </div>
                ) : (
                  <Image 
                    src={getIdProofUrl(selectedAgent.id_proof)}
                    fluid
                    alt="ID Proof"
                    style={{ maxHeight: '500px', border: "1px solid #ddd" }}
                  />
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowIdProofModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}