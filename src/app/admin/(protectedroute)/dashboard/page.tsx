"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  ProgressBar,
  Form,
  Spinner,
  Dropdown
} from "react-bootstrap";
import {
  FaUsers,
  FaUniversity,
  FaGraduationCap,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserEdit,
  FaArrowRight,
  FaSignOutAlt,
  FaEye,
  FaTrash,
  FaBars,
  FaSearch,
  FaBell,
  FaCog,
  FaTachometerAlt,
  FaRegClock,
  FaRegCalendarAlt,
  FaChartLine,
  FaShoppingCart,
  FaGlobe,
  FaDesktop,
  FaMobileAlt,
  FaDatabase,
  FaBuilding,
  FaUserFriends,
  FaFilePdf,
  FaCreditCard,
  FaListAlt,
  FaPassport,
  FaPlaneDeparture
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import Chart from 'chart.js/auto';
import toast from "react-hot-toast";
import "../../../../assets/styles/dashboard-admin.css";
import Image from "next/image";
import Link from "next/link";

// Define interfaces for data types
interface User {
  id: number;
  name: string;
  email: string;
  program: string;
  registeredOn: string;
  status: string;
}

interface VerificationDocument {
  id: number;
  name: string;
  email: string;
  documentType: string;
  submittedOn: string;
}

interface Payment {
  id: number;
  name: string;
  amount: string;
  program: string;
  date: string;
  status: string;
}

interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingVerifications: number;
  totalPayments: number;
}

interface SessionData {
  name: string;
  value: number;
  percentage: string;
}

interface EmployeeData {
  name: string;
  value: string;
}

interface DeviceStats {
  uptime: string;
  firstSeen: string;
  collectedTime: string;
  memorySpace: string;
}

interface SalesData {
  online: number;
  offline: number;
  marketing: number;
}

interface RevenueData {
  currentMonth: number;
  lastMonth: number;
  growthCurrentMonth: number;
  growthLastMonth: number;
}

// Add AdminDetails interface
interface AdminDetails {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [countUser, setCountUsers] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState<VerificationDocument[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [salesData, setSalesData] = useState<SalesData>({
    online: 23342,
    offline: 13221,
    marketing: 1542
  });
  const [revenueData, setRevenueData] = useState<RevenueData>({
    currentMonth: 287493,
    lastMonth: 87493,
    growthCurrentMonth: 1.4,
    growthLastMonth: 9.43
  });
  const [sessionsByChannel, setSessionsByChannel] = useState<SessionData[]>([
    { name: "Registered Students", value: 12, percentage: "30%" },
    { name: "Active Students", value: 2, percentage: "40%" },
    { name: "Offline Students", value: 7, percentage: "60%" },
  ]);
  const [topEmployees, setTopEmployees] = useState<EmployeeData[]>([
    { name: "Connor Chandler", value: "$409" },
    { name: "Russell Floyd", value: "$987" },
    { name: "Douglas White", value: "$612" },
    { name: "Alta Fletcher", value: "$233" },
    { name: "Marguerite Pearson", value: "$233" },
    { name: "Leonard Gutierrez", value: "$35" },
  ]);
  
  const [adminDetails, setAdminDetails] = useState<AdminDetails>({});
  const [offerletterCount, setOfferletterCount] = useState(0);
  const [applicationsubmittedCount, setApplicationSubmittedCount] = useState(0);
  const [paidfeesCount, setPaidFeesCount] = useState(0);
  const [completedProfileCount, setCompletedProfileCount] = useState(0);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios("/admin/api/users/getusercount").then((res) => {
      setCountUsers(res.data.totalUsers);
      console.log("user count : ",res.data);
    }).catch((err) => {
      console.error("Error fetching user count:", err);
    })

    axios("/admin/api/get-admin")
      .then((res) => {
        console.log("admin fetch : ",res.data);
        setAdminDetails(res.data.admins);
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });

      axios("/admin/api/users/getofferlettercount")
        .then((res) => {
          setOfferletterCount(res.data.offerLetterCount);
          console.log("offer letter count : ", res.data);
        })
        .catch((err) => {
          console.error("Error fetching offer letter count:", err);
        });

        axios("/admin/api/users/getappsubmittedcount")
          .then((res) => {
            console.log("getappsubmittedcount : ", res.data);
            setApplicationSubmittedCount(res.data.submittedApplicationsCount);
          })
          .catch((err) => {
            console.error("Error fetching application submitted count:", err);
          });

          axios("/admin/api/users/getstu-paidfees")
          .then((res) => {
            console.log("getstu-paidfees : ", res.data);
            setPaidFeesCount(res.data.paidFeesCount);
          })
          .catch((err) => {
            console.error("Error fetching paidfees count:", err);
          });

          axios("/admin/api/users/getcompletestudents")
            .then((res) => {
              setCompletedProfileCount(res.data.completedStudentsCount);
              console.log("getcompletestudents : ", res.data);
            })
            .catch((err) => {
              console.error("Error fetching getcompletestudents count:", err);
            });

  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Persist sidebar state in localStorage
    localStorage.setItem('sidebarCollapsed', (!sidebarCollapsed).toString());
  }, [sidebarCollapsed]);

  // For mobile sidebar toggle with overlay
  const toggleMobileSidebar = useCallback(() => {
    const sidebarElement = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarElement && mainContent) {
      sidebarElement.classList.toggle('sidebar-open');
      
      // Add overlay when sidebar is open on mobile
      if (sidebarElement.classList.contains('sidebar-open')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', toggleMobileSidebar);
        mainContent.appendChild(overlay);
      } else {
        // Remove overlay when sidebar is closed
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
          overlay.remove();
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Initialize charts after component mounts
    const timeout = setTimeout(() => {
      initCharts();
    }, 500);

    // Get saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }

    // Add responsive sidebar event listener
    const handleResize = () => {
      if (window.innerWidth <= 991) {
        setSidebarCollapsed(true);
      }
    };

    // Call once to initialize
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get real data from API
      const response = await axios.get("/admin/api/dashboard");
      const data = response.data;
      console.log("Dashboard data:", data);
      
      // Set dashboard stats if API call succeeds
      if (data && data.stats) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep using the mock data initialized in state
      setIsLoading(false);
    }
  };

  const initCharts = () => {
    // Dynamic import of Chart.js to avoid SSR issues
    import('chart.js/auto').then((Chart) => {
      // Events Chart
      const eventsCtx = document.getElementById('eventsChart');
      if (eventsCtx) {
        new Chart.default(eventsCtx as HTMLCanvasElement, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [
              {
                label: 'Critical',
                data: [5, 10, 15, 12, 18, 12, 15, 20, 15],
                borderColor: '#FF5A5A',
                backgroundColor: 'rgba(255, 90, 90, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 1
              },
              {
                label: 'Error',
                data: [3, 7, 12, 8, 14, 10, 13, 16, 12],
                borderColor: '#FF8C5A',
                backgroundColor: 'rgba(255, 140, 90, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 1
              },
              {
                label: 'Warning',
                data: [2, 5, 8, 6, 10, 7, 10, 12, 8],
                borderColor: '#5AAEFF',
                backgroundColor: 'rgba(90, 174, 255, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            }
          }
        });
      }

      // Sales Analytics Chart
      const salesCtx = document.getElementById('salesChart');
      if (salesCtx) {
        new Chart.default(salesCtx as HTMLCanvasElement, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Online',
                data: [5000, 15000, 10000, 18000, 12000, 22000, 18000, 15000, 21000, 25000, 20000, 23342],
                borderColor: '#FF5A5A',
                backgroundColor: 'rgba(255, 90, 90, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0
              },
              {
                label: 'Offline',
                data: [3000, 8000, 12000, 10000, 7000, 15000, 9000, 14000, 8000, 12000, 10000, 13221],
                borderColor: '#5470FF',
                backgroundColor: 'rgba(84, 112, 255, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0
              },
              {
                label: 'Marketing',
                data: [1000, 2000, 3000, 2500, 1800, 2800, 1500, 2300, 1200, 1800, 1400, 1542],
                borderColor: '#FFA63F',
                backgroundColor: 'rgba(255, 166, 63, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            }
          }
        });
      }

      // Revenue Chart
      const revenueCtx = document.getElementById('revenueChart');
      if (revenueCtx) {
        new Chart.default(revenueCtx as HTMLCanvasElement, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Revenue',
                data: [21000, 25000, 20000, 25000, 28000, 22000, 30000, 25000, 32000, 24000, 28000, 29000],
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  return index % 2 === 0 ? '#5470FF' : '#E9EFFD';
                },
                borderRadius: 3,
                barThickness: 6,
                maxBarThickness: 10
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            }
          }
        });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}

      {/* Main Content */}
      <div
        className={`main-admin-content  w-100 ${sidebarCollapsed ? "content-collapsed" : ""}`}
      >
        {/* Navbar */}

        {/* Content Area */}
        <div className="dashboard-content p-3">
          {/* Admin Info Header */}
          <div className="admin-info mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="m-0">{adminDetails?.name}</h4>
              </div>
            </div>
          </div>

          <div className="milestone-roadmap mb-5">
            <div className="roadmap-container">
              <h4 className="roadmap-title">
                Student Application Journey Overview
              </h4>
              <div className="roadmap-path">
                <div
                  className="milestone-marker milestone-1 mt-5 ms-3"
                  data-status="completed"
                >
                  <div className="milestone-icon">
                    <FaFileAlt />
                  </div>
                  <div className="milestone-number">1</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-2"
                  data-status="completed"
                >
                  <div className="milestone-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="milestone-number">2</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-3"
                  data-status="current"
                >
                  <div className="milestone-icon">
                    <FaFilePdf />
                  </div>
                  <div className="milestone-number">3</div>
                  <div className="marker-pulse"></div>
                </div>
                <div
                  className="milestone-marker milestone-4"
                  data-status="pending"
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
                    {applicationsubmittedCount > 0
                      ? applicationsubmittedCount
                      : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-2">
                  <h5>Eligibility</h5>
                  <p className="milestone-status-admin">
                    {completedProfileCount > 0 ? completedProfileCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-3">
                  <h5>Offer Letters</h5>
                  <p className="milestone-status-admin">
                    {offerletterCount > 0 ? offerletterCount : 0}
                  </p>
                </div>
                <div className="milestone-label milestone-label-4">
                  <h5>Payments</h5>
                  <p className="milestone-status-admin">
                    {paidfeesCount > 0 ? paidfeesCount : 0}
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

          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" className="me-2" />
              <span>Loading dashboard data...</span>
            </div>
          ) : (
            <Row>
              <Col lg={4} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h5 className="card-title mb-3">Student Details</h5>
                    <div className="d-flex align-items-center">
                      <div className="score-circle me-4">
                        <div className="score-value">
                          <strong>75%</strong>
                        </div>
                      </div>
                      <div className="sessions-list">
                        <div className="session-item d-flex align-items-center mb-2">
                          <div className="session-name me-2">Students</div>
                          <div className="session-value">{countUser}</div>
                        </div>
                        <div className="session-item d-flex align-items-center mb-2">
                          <div className="session-name me-2">
                            Registered Students
                          </div>
                          <div className="session-value">4</div>
                        </div>
                        <div className="session-item d-flex align-items-center mb-2">
                          <div className="session-name me-2">
                            Active Students
                          </div>
                          <div className="session-value">4</div>
                        </div>
                        <div className="session-item d-flex align-items-center mb-2">
                          <div className="session-name me-2">
                            Offline Students
                          </div>
                          <div className="session-value">0</div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Events Card */}
              <Col lg={4} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h5 className="card-title mb-3">Status</h5>
                    <div className="events-legend d-flex mb-3">
                      <div className="event-type me-3">
                        <span className="dot critical"></span> New
                      </div>
                      <div className="event-type me-3">
                        <span className="dot error"></span> Previous
                      </div>
                      <div className="event-type">
                        <span className="dot warning"></span> Warning
                      </div>
                    </div>
                    <div className="events-chart" style={{ height: "150px" }}>
                      <canvas id="eventsChart"></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Device Stats Card */}
              <Col lg={4} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h5 className="card-title mb-3">Student Stats</h5>
                    <div className="device-stats">
                      <div className="d-flex justify-content-between mb-3">
                        <div className="stat-label">
                          Students having offerletter
                        </div>
                        <div className="stat-value">{offerletterCount}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="stat-label">
                          Students who submitted application
                        </div>
                        <div className="stat-value">
                          {applicationsubmittedCount}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="stat-label">Students who paid fees</div>
                        <div className="stat-value">{paidfeesCount}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <div className="stat-label">Completed Students</div>
                        <div className="stat-value">
                          {completedProfileCount}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Sessions By Channel (Employees) */}
              <Col lg={8} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h5 className="card-title mb-3">Students this Month</h5>
                    <div className="employee-header mb-3 d-flex justify-content-between">
                      <div className="employee-label">Students Name</div>
                      <div className="employee-label">Programs</div>
                      <div className="employee-label">This Month</div>
                    </div>
                    <div className="employee-list">
                      {recentUsers
                        ? recentUsers.map((employee, index) => (
                            <div
                              key={index}
                              className="employee-item d-flex justify-content-between mb-3"
                            >
                              <div className="employee-name text-primary">
                                {employee.name}
                              </div>
                              <div className="employee-program  text-primary">
                                {employee.program}
                              </div>
                              <div className="employee-value">
                                {employee.registeredOn.substring(0, 10)}
                              </div>
                            </div>
                          ))
                        : ""}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Sales Analytics */}
              {/* <Col lg={4} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h5 className="card-title mb-3">Sales Analytics</h5>
                    <div className="sales-summary d-flex mb-3">
                      <div className="sales-type me-4">
                        <div className="sales-label d-flex align-items-center">
                          <span className="dot online"></span> Online
                        </div>
                        <div className="sales-value text-danger">
                          {salesData.online.toLocaleString()}
                        </div>
                      </div>
                      <div className="sales-type me-4">
                        <div className="sales-label d-flex align-items-center">
                          <span className="dot offline"></span> Offline
                        </div>
                        <div className="sales-value text-primary">
                          {salesData.offline.toLocaleString()}
                        </div>
                      </div>
                      <div className="sales-type">
                        <div className="sales-label d-flex align-items-center">
                          <span className="dot marketing"></span> Marketing
                        </div>
                        <div className="sales-value text-warning">
                          {salesData.marketing.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="sales-chart" style={{ height: "150px" }}>
                      <canvas id="salesChart"></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col> */}

              {/* Card Title (Revenue) */}
              <Col lg={4} md={6} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="card-title">Payments</h5>
                      <div className="period-selector">
                        <Button
                          variant="light"
                          size="sm"
                          className="shadow-sm border"
                        >
                          Month
                        </Button>
                      </div>
                    </div>
                    <div className="revenue-data mb-3">
                      <div className="revenue-title text-primary">
                        Total Payments
                      </div>
                      <div className="revenue-amount">
                        {revenueData.currentMonth.toLocaleString()}$
                      </div>
                      <div className="revenue-growth text-success">
                        {revenueData.growthCurrentMonth}% Since Last Month
                      </div>
                    </div>
                    <div className="revenue-data mb-3">
                      <div className="revenue-title text-primary">
                        Total Payments
                      </div>
                      <div className="revenue-amount">
                        {revenueData.lastMonth.toLocaleString()}
                      </div>
                      <div className="revenue-growth text-success">
                        {revenueData.growthLastMonth}% Since Last Month
                      </div>
                    </div>
                    <div className="revenue-chart" style={{ height: "100px" }}>
                      <canvas id="revenueChart"></canvas>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Add the Admin Journey Roadmap section after your stats cards */}

          {/* Admin Dashboard Info Cards */}
        </div>

        {/* <div className="dashboard-footer">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} Bring Your Buddy | Admin Dashboard
          </div>
          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div> */}
      </div>

      <style jsx global>{`
        /* Enhanced Card Styles */
        .card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
        }

        .card-body {
          padding: 1.5rem;
        }

        .card-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 1.2rem;
          position: relative;
          display: inline-block;
        }

        .card-title:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          height: 3px;
          width: 40px;
          background: linear-gradient(90deg, #5470ff, #8c94ff);
          border-radius: 10px;
        }

        /* Score Circle Enhancements */
        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: conic-gradient(#5470ff 75%, #e9effd 0);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 6px 15px rgba(84, 112, 255, 0.15);
          transition: all 0.3s ease;
        }

        .score-circle:hover {
          transform: scale(1.05);
        }

        .score-circle::before {
          content: "";
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .score-value {
          position: relative;
          color: #5470ff;
          font-size: 22px;
          z-index: 1;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(84, 112, 255, 0.1);
        }

        /* Session Item Styling */
        .session-item {
          font-size: 14px;
          margin-bottom: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          background-color: rgba(84, 112, 255, 0.05);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .session-item:hover {
          background-color: rgba(84, 112, 255, 0.1);
          transform: translateX(5px);
        }

        .session-name {
          color: #555;
          font-weight: 500;
        }

        .session-value {
          font-weight: 600;
          color: #5470ff;
          background: rgba(84, 112, 255, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Dots for Legends */
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 8px;
          position: relative;
        }

        .dot:after {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: inherit;
          opacity: 0.4;
          z-index: -1;
        }

        .critical {
          background-color: #ff5a5a;
        }

        .error {
          background-color: #ff8c5a;
        }

        .warning {
          background-color: #5aaeff;
        }

        .online {
          background-color: #ff5a5a;
        }

        .offline {
          background-color: #5470ff;
        }

        .marketing {
          background-color: #ffa63f;
        }

        /* Event Legends */
        .event-type {
          display: flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 20px;
          background-color: rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }

        .event-type:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }

        /* Student Stats */
        .device-stats {
          padding: 5px;
        }

        .device-stats > div {
          padding: 12px 15px;
          border-radius: 10px;
          background-color: rgba(84, 112, 255, 0.04);
          margin-bottom: 10px !important;
          transition: all 0.2s ease;
        }

        .device-stats > div:hover {
          background-color: rgba(84, 112, 255, 0.08);
          transform: translateX(5px);
        }

        .stat-label {
          color: #555;
          font-size: 14px;
          font-weight: 500;
        }

        .stat-value {
          font-weight: 600;
          color: #5470ff;
          background: rgba(84, 112, 255, 0.1);
          padding: 3px 10px;
          border-radius: 6px;
        }

        /* Employee Styling */
        .employee-header {
          background-color: rgba(84, 112, 255, 0.06);
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 15px !important;
        }

        .employee-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }

        .employee-item {
          padding: 10px 15px;
          border-radius: 10px;
          background-color: rgba(84, 112, 255, 0.03);
          margin-bottom: 8px !important;
          transition: all 0.2s ease;
        }

        .employee-item:hover {
          background-color: rgba(84, 112, 255, 0.07);
          transform: translateX(5px);
        }

        .employee-name {
          font-size: 14px;
          font-weight: 500;
        }

        .employee-value {
          font-size: 14px;
          font-weight: 600;
          color: #5470ff;
        }

        /* Revenue Section */
        .revenue-title {
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }

        .revenue-amount {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin: 5px 0;
        }

        .revenue-growth {
          font-size: 13px;
          padding: 4px 8px;
          border-radius: 20px;
          background-color: rgba(40, 167, 69, 0.1);
          display: inline-block;
        }

        .revenue-data {
          padding: 15px;
          border-radius: 12px;
          background-color: rgba(84, 112, 255, 0.03);
          margin-bottom: 15px;
          transition: all 0.2s ease;
        }

        .revenue-data:hover {
          background-color: rgba(84, 112, 255, 0.07);
          transform: translateX(5px);
        }

        /* Milestone Dashboard Styles Enhancements */
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

        .milestone-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.85)
          );
          border-radius: 12px;
          padding: 15px;
          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.05),
            0 1px 2px rgba(0, 0, 0, 0.05);
          width: 100%;
          transition: all 0.3s ease;
        }

        .milestone-stat:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .milestone-count {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #5470ff, #8c94ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 5px rgba(84, 112, 255, 0.2);
        }

        .milestone-label-small {
          font-size: 14px;
          color: #555;
          margin-top: 3px;
          font-weight: 500;
        }

        .progress-mini {
          height: 5px;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          margin-top: 12px;
          width: 100%;
          overflow: hidden;
        }

        .progress-bar-mini {
          height: 100%;
          background: linear-gradient(90deg, #5470ff, #8c94ff);
          border-radius: 10px;
          transition: width 1s ease;
        }

        .progress-orange {
          background: linear-gradient(90deg, #fd7e14, #ffad5f);
        }

        .progress-green {
          background: linear-gradient(90deg, #20c997, #4adcb5);
        }

        .progress-purple {
          background: linear-gradient(90deg, #6610f2, #8c5cf7);
        }

        /* Roadmap Styles Enhancements */
        .milestone-roadmap {
          padding: 40px 25px;
          background: linear-gradient(135deg, #fff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
          margin-top: 30px;
          animation: fadeIn 0.8s ease-out;
          border: 1px solid rgba(0, 0, 0, 0.03);
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

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        /* Milestone Description Cards Enhancements */
        .milestone-descriptions {
          margin-top: -20px;
          animation: fadeIn 1s ease-out;
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .milestone-action {
          display: flex;
          justify-content: center;
          margin-top: auto;
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