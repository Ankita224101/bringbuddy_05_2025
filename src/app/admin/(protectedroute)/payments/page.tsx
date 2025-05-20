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
  FaCreditCard,
  FaDollarSign,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaFileDownload,
  FaFilePdf,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";

// Define interfaces for data types
interface Payment {
  id: number;
  user_id: number;
  name: string;
  email: string;
  program_id?: number;
  university_id?: number;
  phone_number?: string;
  payment_status: number; // 1 = paid, 0 = pending
  amount?: number;
  payment_receipt?: string;
  created_at: string;
  updated_at?: string;
}

interface PaymentStats {
  total: number;
  paid: number;
  pending: number;
  totalAmount: number;
}

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    paid: 0,
    pending: 0,
    totalAmount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      // Fetch all users from applications endpoint
      const response = await axios.get("/admin/api/applications");

      console.log("Payments data:", response.data);
      
      
      if (response.data && response.data.students) {
        // Map students data to payments with mock payment amounts
        let payments = response.data.students.map((student: any) => ({
          id: student.id,
          user_id: student.id,
          name: student.name,
          email: student.email,
          program_id: student.program_id,
          phone_number: student.phone_number,
          payment_status: student.payment_status || 0,
          amount: student.payment_amount || Math.floor(Math.random() * 5000) + 5000, // Mock amount if not available
          payment_receipt: student.payment_receipt || "/documents/99_Payment_Receipt.pdf", // Default receipt path
          created_at: student.created_at,
          updated_at: student.updated_at,
        }));
        
        // Filter payments based on search term
        if (searchTerm) {
          payments = payments.filter((payment: Payment) => 
            payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter payments based on status
        if (filterStatus !== "all") {
          payments = payments.filter((payment: Payment) => 
            filterStatus === "paid" ? payment.payment_status === 1 : payment.payment_status === 0
          );
        }
        
        setPayments(payments);
        
        // Calculate stats
        const total = payments.length;
        const paid = payments.filter((payment: Payment) => payment.payment_status === 1).length;
        const pending = payments.filter((payment: Payment) => payment.payment_status === 0).length;
        const totalAmount = payments.reduce((sum: number, payment: Payment) => sum + (payment.payment_status === 1 ? (payment.amount || 0) : 0), 0);
        
        setStats({
          total,
          paid,
          pending,
          totalAmount,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments data");
      setIsLoading(false);
      
      // Use mock data as fallback
      const mockPayments = [
        { id: 1, user_id: 1, name: "John Smith", email: "john@example.com", program_id: 1, phone_number: "1234567890", payment_status: 1, amount: 7500, created_at: "2023-05-10" },
        { id: 2, user_id: 2, name: "Emily Johnson", email: "emily@example.com", program_id: 2, phone_number: "2345678901", payment_status: 0, amount: 8000, created_at: "2023-05-12" },
        { id: 3, user_id: 3, name: "Michael Wilson", email: "michael@example.com", program_id: 3, phone_number: "3456789012", payment_status: 1, amount: 6500, created_at: "2023-05-15" },
        { id: 4, user_id: 4, name: "Sarah Brown", email: "sarah@example.com", program_id: 1, phone_number: "4567890123", payment_status: 0, amount: 7000, created_at: "2023-05-18" },
        { id: 5, user_id: 5, name: "David Lee", email: "david@example.com", program_id: 2, phone_number: "5678901234", payment_status: 1, amount: 8500, created_at: "2023-05-20" },
      ];
      
      setPayments(mockPayments);
      
      // Calculate stats from mock data
      const total = mockPayments.length;
      const paid = mockPayments.filter(payment => payment.payment_status === 1).length;
      const pending = mockPayments.filter(payment => payment.payment_status === 0).length;
      const totalAmount = mockPayments.reduce((sum, payment) => sum + (payment.payment_status === 1 ? (payment.amount || 0) : 0), 0);
      
      setStats({
        total,
        paid,
        pending,
        totalAmount,
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);
  
  // Debounce search term input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPayments();
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
  
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };
  
  const handleShowUpdateModal = (payment: Payment) => {
    setSelectedPayment(payment);
    getPaymentDetails(payment.id);
    setShowUpdateModal(true);
  };

  const getPaymentDetails = async (id: number) => {
    try {
      const response = await axios.get(`/admin/api/payments/${id}`);
      console.log("Payment details:", response.data);
      if (response.data && response.data.payment) {
        setSelectedPayment(response.data.payment);
        console.log("Payment details:", response.data);

      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      // toast.error("Failed to fetch payment details");
    }
  };
  
  
  const updatePaymentStatus = async (id: number, newStatus: number) => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(`/admin/api/payments/${id}`, {
        payment_status: newStatus
      });
      
      // Update the payment in the local state
      const updatedPayments = payments.map(payment => 
        payment.id === id ? { ...payment, payment_status: newStatus } : payment
      );
      setPayments(updatedPayments);
      
      // Update stats
      calculateStats(updatedPayments);
      
      toast.success(`Payment status ${newStatus === 1 ? 'marked as paid' : 'marked as pending'}`);
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateStats = (updatedPayments: Payment[]) => {
    const total = updatedPayments.length;
    const paid = updatedPayments.filter((payment: Payment) => payment.payment_status === 1).length;
    const pending = updatedPayments.filter((payment: Payment) => payment.payment_status === 0).length;
    const totalAmount = updatedPayments.reduce((sum: number, payment: Payment) => sum + (payment.payment_status === 1 ? (payment.amount || 0) : 0), 0);
    
    setStats({
      total,
      paid,
      pending,
      totalAmount,
    });
  };
  
  const handleCloseUpdateModal = () => {
    setSelectedPayment(null);
    setShowUpdateModal(false);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const viewPaymentReceipt = (payment: Payment) => {
    if (payment.payment_receipt) {
      setPdfUrl(payment.payment_receipt);
      setShowPdfModal(true);
    } else {
      toast.error("Payment receipt not available");
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
          {/* Payment Statistics */}
          <Row className="mb-4">
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="mb-0">{stats.total}</h3>
                  <p className="text-muted">Total Students</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaCheckCircle />
                  </div>
                  <h3 className="mb-0">{stats.paid}</h3>
                  <p className="text-muted">Paid Fees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon yellow mb-3">
                    <FaTimesCircle />
                  </div>
                  <h3 className="mb-0">{stats.pending}</h3>
                  <p className="text-muted">Pending Fees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon purple mb-3">
                    <FaMoneyBillWave />
                  </div>
                  <h3 className="mb-0">{formatCurrency(stats.totalAmount)}</h3>
                  <p className="text-muted">Total Revenue</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Payment Management</h5>
              <div className="d-flex">
                <Form.Select 
                  className="me-2" 
                  style={{ width: "150px" }}
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </div>
            </div>
            <div className="content-card-body">
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading payments data...</span>
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
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPayments.length > 0 ? (
                          currentPayments.map((payment) => (
                            <tr key={payment.id}>
                              <td>{payment.id}</td>
                              <td>{payment.name}</td>
                              <td>{payment.email}</td>
                              <td>{formatCurrency(payment.amount || 0)}</td>
                              <td>
                                <Badge
                                  bg={payment.payment_status === 1 ? "success" : "warning"}
                                >
                                  {payment.payment_status === 1 ? "Paid" : "Pending"}
                                </Badge>
                              </td>
                              <td>{formatDate(payment.created_at)}</td>
                              <td>
                                <Button 
                                  variant="light" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleViewPayment(payment)}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="light" 
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleShowUpdateModal(payment)}
                                >
                                  <FaEdit />
                                </Button>
                                {payment.payment_status === 1 && (
                                  <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => viewPaymentReceipt(payment)}
                                  >
                                    <FaFilePdf />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No payments found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {payments.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, payments.length)} of{" "}
                        {payments.length} payments
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

      {/* Payment Details Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div style={{ 
                      backgroundColor: selectedPayment.payment_status === 1 ? "#28a745" : "#ffc107", 
                      width: "150px", 
                      height: "150px", 
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center" 
                    }}>
                      {selectedPayment.payment_status === 1 ? (
                        <FaCheckCircle size={80} color="white" />
                      ) : (
                        <FaTimesCircle size={80} color="white" />
                      )}
                    </div>
                  </div>
                  <h5>{selectedPayment.name}</h5>
                  <Badge
                    bg={selectedPayment.payment_status === 1 ? "success" : "warning"}
                    className="px-3 py-2"
                  >
                    {selectedPayment.payment_status === 1 ? "Paid" : "Pending"}
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
                    <Col xs={8}>{selectedPayment.name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Email:
                    </Col>
                    <Col xs={8}>{selectedPayment.email}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Phone:
                    </Col>
                    <Col xs={8}>{selectedPayment.phone_number}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Program ID:
                    </Col>
                    <Col xs={8}>{selectedPayment.program_id}</Col>
                  </Row>

                  <h6 className="border-bottom pb-2 mb-3 mt-4">
                    Payment Information
                  </h6>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Payment ID:
                    </Col>
                    <Col xs={8}>PAY-{selectedPayment.id}-{Math.floor(Math.random() * 1000000)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Amount:
                    </Col>
                    <Col xs={8}>{formatCurrency(selectedPayment.amount || 0)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Status:
                    </Col>
                    <Col xs={8}>{selectedPayment.payment_status === 1 ? "Paid" : "Pending"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4} className="text-muted">
                      Date:
                    </Col>
                    <Col xs={8}>
                      {formatDate(selectedPayment.created_at)}
                    </Col>
                  </Row>
                  
                  <h6 className="border-bottom pb-2 mb-3 mt-4">Actions</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedPayment.payment_status === 0 ? (
                      <Button 
                        variant="success" 
                        size="sm"
                        className=" d-flex align-items-center"
                        onClick={() => updatePaymentStatus(selectedPayment.id, 1)}
                      >
                        <FaCheckCircle className="me-1" /> Mark as Paid
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="warning" 
                          size="sm"
                          className=" d-flex align-items-center"
                          onClick={() => updatePaymentStatus(selectedPayment.id, 0)}
                        >
                          <FaTimesCircle className="me-1" /> Mark as Pending
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          className=" d-flex align-items-center"
                          onClick={() => viewPaymentReceipt(selectedPayment)}
                        >
                          <FaFilePdf className="me-1" /> View Receipt
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Payment Status Modal */}
      <Modal
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <p>Student: <strong>{selectedPayment.name}</strong></p>
              <p>Current Status: <Badge bg={selectedPayment.payment_status === 1 ? "success" : "warning"}>
                {selectedPayment.payment_status === 1 ? "Paid" : "Pending"}
              </Badge></p>
              <p>Amount: <strong>{formatCurrency(selectedPayment.amount || 0)}</strong></p>
              <p>Do you want to mark this payment as {selectedPayment.payment_status === 1 ? "Pending" : "Paid"}?</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseUpdateModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {selectedPayment?.payment_status === 0 ? (
            <Button 
              variant="success" 
              onClick={() => updatePaymentStatus(selectedPayment.id, 1)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Mark as Paid'}
            </Button>
          ) : (
            <Button 
              variant="warning" 
              onClick={() => selectedPayment && updatePaymentStatus(selectedPayment.id, 0)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Mark as Pending'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        centered
        size="lg"
        className="pdf-viewer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="pdf-container" style={{ height: "80vh" }}>
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="100%" 
              style={{ border: "none" }}
              title="Payment Receipt"
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