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
  Alert,
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
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaUser,
  FaHandPointUp,
  FaFileUpload,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";
import Script from "next/script";
import "../../../../assets/styles/dashboard-admin.css";

// Add custom CSS for the user details modal
const styles = {
  documentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "16px"
  },
  userDetailsModal: {
    ".modal-content": {
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }
  }
};

// Define interfaces for data types
interface User {
  id: number;
  name: string;
  email: string;
  program_id?: number;
  phone_number?: string;
  country_id?: number;
  university_id?: number;
  created_at: string;
  status: string;
  offer_letter?: string;
  offer_letter_status?: number;
  profile_img?: string;
  // Add agent_id field
  agent_id?: number;
  // Add more fields for complete user data
  document_verified_status?: number;
  is_eligible?: number;
  tenth_certificate?: string;
  twelfth_certificate?: string;
  bachelor_certificate?: string;
  id_proof?: string;
  other_certificate?: string;
  bonafide_letter?: string;
  admission_letter?: string;
  visa?: string;
  payment_receipt?: string;
  affiliation_letter?: string;
  ugc_letter?: string;
  university_country?: string;
  course_type_id?: number;
  course_trade_id?: number;
  request_doc?: number;
  // Add marks IDs
  tenth_marks_id?: number;
  twelfth_marks_id?: number;
  // Add more fields as needed based on your database
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Add Register Form data interface
interface RegisterFormData {
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  country_id: string;
  university_country: string;
  course_type_id: string;
  course_trade_id: string;
  id_proof: File | null;
  password: string;
  confirmPassword: string;
  program_id: string;
  university_id: string;
  tenth_certificate: File | null;
  twelfth_certificate: File | null;
  bachelor_certificate: File | null;
  other_certificate: File[];
}

// Document Card Component
interface DocumentCardProps {
  title: string;
  documentUrl?: string;
  status?: number;
  uploadHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentCard = ({ title, documentUrl, status, uploadHandler }: DocumentCardProps) => {
  return (
    <div className="document-card border rounded p-3 h-100">
      <div className="d-flex align-items-center mb-2">
        <div className="document-icon me-2">
          <FaFileAlt className="text-primary" />
        </div>
        <h6 className="mb-0">{title}</h6>
      </div>

      {documentUrl ? (
        <div className="mt-2">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary w-100 d-flex"
          >
            <FaEye className="me-1" /> View Document
          </a>
          {uploadHandler && (
            <div className="mt-2">
              <Form.Group>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={uploadHandler}
                  size="sm"
                />
              </Form.Group>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2">
          {uploadHandler ? (
            <Form.Group>
              <Form.Label className="small text-muted">Upload PDF file</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={uploadHandler}
                size="sm"
              />
            </Form.Group>
          ) : (
            <Badge bg="secondary">Not Uploaded</Badge>
          )}
        </div>
      )}

      {status !== undefined && (
        <div className="mt-2">
          <Badge bg={status === 1 ? "success" : "warning"}>
            {status === 1 ? "Generated" : "Not Generated"}
          </Badge>
        </div>
      )}
    </div>
  );
};

// Add interface for grouped users
interface GroupedUsers {
  [key: string]: User[];
}

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUsers>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAgent, setFilterAgent] = useState("all");
  const [agentsList, setAgentsList] = useState<{ id: number, name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const router = useRouter();

  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailStatus, setEmailStatus] = useState(0);
  const [isEmailSending, setIsEmailSending] = useState(false);
  // Add state for university email and CC
  const [universityEmail, setUniversityEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  // Add toggle for eligibility
  const [toggleEligible, setToggleEligible] = useState(false);

  // Add state for register modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Add states for registration form
  const [registerStep, setRegisterStep] = useState(1);
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone_number: "",
    country_code: "",
    country_id: "",
    university_country: "",
    course_type_id: "",
    course_trade_id: "",
    id_proof: null,
    password: "",
    confirmPassword: "",
    program_id: "",
    university_id: "",
    tenth_certificate: null,
    twelfth_certificate: null,
    bachelor_certificate: null,
    other_certificate: [],
  });

  // Add states for dropdown data
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseTrades, setCourseTrades] = useState([]);

  // Add form validation errors state
  const [registerErrors, setRegisterErrors] = useState({
    email: "",
    phone_number: "",
    id_proof: "",
    tenth_certificate: "",
    twelfth_certificate: "",
    bachelor_certificate: "",
    other_certificate: "",
  });

  // Add user edit modal state and form state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    program_id: "",
    university_id: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new state for document email requests
  const [documentEmailRequests, setDocumentEmailRequests] = useState({
    bonafide_letter: { email: "", cc: "" },
    admission_letter: { email: "", cc: "" },
    visa: { email: "", cc: "" },
    affiliation_letter: { email: "", cc: "" },
    ugc_letter: { email: "", cc: "" },
    payment_receipt: { email: "", cc: "" }, // Add payment_receipt
  });

  // Add state for visa and photo files
  
  const [visaFile, setVisaFile] = useState<File | null>(null);
  // const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [ticketPhoto, setTicketPhoto] = useState<File | null>(null);

  // Add state for appointment data
  const [appointmentData, setAppointmentData] = useState<{ date?: string; time?: string } | null>(null);

  // Add state for student marks data
  const [tenthMarks, setTenthMarks] = useState<any>(null);
  const [twelfthMarks, setTwelfthMarks] = useState<any>(null);
  const [showTenthMarksModal, setShowTenthMarksModal] = useState(false);
  const [showTwelfthMarksModal, setShowTwelfthMarksModal] = useState(false);
  const [isLoadingMarks, setIsLoadingMarks] = useState(false);

  // Add state for university payment receipts
  const [universityPaymentReceipts, setUniversityPaymentReceipts] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingPaymentReceipts, setIsLoadingPaymentReceipts] = useState(false);

  // Add state for commission form
  const [commissionForm, setCommissionForm] = useState({
    amount: "",
    email: "",
    cc: ""
  });

  // Add state for disperse commission
  const [disperseCommissionForm, setDisperseCommissionForm] = useState({
    amount: ""
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loadingCommission, setLoadingCommission] = useState(false);
  const [commissionReceipt, setCommissionReceipt] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Add state for airport pickup form
  const [airportPickupForm, setAirportPickupForm] = useState({
    departure_datetime: "",
    departure_port: "",
    destination_port: "",
    destination_datetime: "",
  });

  const fetchAppointmentData = async (userId: number) => {
    try {
      const response = await axios.post("/api/appointment-notification/getreminder", { 
        id: userId 
      });
      console.log(response.data, "appointment data");
      
      if (response.data && response.data) {
        setAppointmentData({
          date: response.data.reminders?.appointment_date,
          time: response.data.reminders?.appointment_time
        });
      } else {
        setAppointmentData(null);
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      setAppointmentData(null);
    }
  };

  // Function to fetch university payment receipts
  const fetchUniversityPaymentReceipts = async (userId: number) => {
    if (!userId) return;
    
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

  // Function to fetch 10th marks data
  const fetchTenthMarks = async (userId?: number) => {
    if (!userId) {
      toast.error("No 10th marks ID available");
      setTenthMarks(null);
      return;
    }
    
    setIsLoadingMarks(true);
    try {
      const response = await axios.post("/admin/api/users/get-marks/tenth-marks", { 
        tenth_id: userId 
      });
      
      console.log("10th Marks Data:", response.data);
      
      if (response.data && response.data) {
        setTenthMarks(response.data.tenth_marks);
      } else {
        setTenthMarks(null);
        toast.error("Failed to load 10th marks data");
      }
    } catch (error) {
      console.error("Error fetching 10th marks:", error);
      setTenthMarks(null);
      toast.error("Error loading 10th marks data");
    } finally {
      setIsLoadingMarks(false);
    }
  };

  // Function to fetch 12th marks data
  const fetchTwelfthMarks = async (userId?: number) => {
    if (!userId) {
      toast.error("No 12th marks ID available");
      setTwelfthMarks(null);
      return;
    }
    
    setIsLoadingMarks(true);
    try {
      const response = await axios.post("/admin/api/users/get-marks/twelth-marks", { 
        twelth_id: userId 
      });
      
      console.log("12th Marks Data:", response.data);
      
      if (response.data && response.data) {
        setTwelfthMarks(response.data.twelth_marks);
      } else {
        setTwelfthMarks(null);
        toast.error("Failed to load 12th marks data");
      }
    } catch (error) {
      console.error("Error fetching 12th marks:", error);
      setTwelfthMarks(null);
      toast.error("Error loading 12th marks data");
    } finally {
      setIsLoadingMarks(false);
    }
  };

  // Update toggleEligible when a user is selected for viewing
  useEffect(() => {
    if (selectedUser) {
      setToggleEligible(selectedUser.is_eligible === 1);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Call the real API endpoint for getting all students
      const response = await axios.get("/admin/api/users/getallstudents");

      if (response.data && response.data.students) {
        // Apply filters client-side for now
        let filteredUsers = response.data.students.map((user: any) => ({
          ...user,
          offer_letter_status: user.offer_letter_status || 0 // Set default value if not provided by API
        }));

        console.log("Filtered Users:", filteredUsers);

        if (filterStatus !== "all") {
          filteredUsers = filteredUsers.filter((user: any) => user.status === filterStatus);
        }

        if (filterAgent !== "all") {
          filteredUsers = filteredUsers.filter((user: any) => {
            if (filterAgent === "direct") {
              return !user.agent_id;
            }
            return user.agent_id === parseInt(filterAgent);
          });
        }

        if (searchTerm) {
          filteredUsers = filteredUsers.filter(
            (user: any) =>
              user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setUsers(filteredUsers);

        // Group users by agent_id
        const grouped: GroupedUsers = {};

        // Create "Direct Students" group
        grouped["Direct Students"] = filteredUsers.filter((user: any) => !user.agent_id);

        // Create agent groups
        filteredUsers.forEach((user: any) => {
          if (user.agent_id) {
            const agentKey = `Agent ${user.agent_id}`;
            if (!grouped[agentKey]) {
              grouped[agentKey] = [];
            }
            grouped[agentKey].push(user);
          }
        });

        setGroupedUsers(grouped);

        // Extract unique agent IDs for filtering
        const uniqueAgents = Array.from(
          new Set(
            filteredUsers
              .filter((user: any) => user.agent_id)
              .map((user: any) => user.agent_id)
          )
        ).map(id => ({
          id: id as number,
          name: `Agent ${id}`
        }));

        setAgentsList(uniqueAgents);

        // Set pagination data
        setPagination({
          total: response.data.students.length,
          page: currentPage,
          limit: 10,
          totalPages: Math.ceil(response.data.students.length / 10),
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users data");
      setIsLoading(false);

      // Fallback to mock data in case of error (optional)
      const mockUsers = [
        { id: 1, name: "John Smith", email: "john@example.com", program_id: 1, created_at: "2023-04-25", status: "active", phone_number: "1234567890", country_id: 1, offer_letter_status: 1, offer_letter: "/offerletters/1_Offer_Letter.pdf", agent_id: 1 },
        { id: 2, name: "Emily Johnson", email: "emily@example.com", program_id: 2, created_at: "2023-04-24", status: "pending", phone_number: "2345678901", country_id: 2, offer_letter_status: 0, agent_id: 1 },
        { id: 3, name: "Michael Wilson", email: "michael@example.com", program_id: 3, created_at: "2023-04-23", status: "active", phone_number: "3456789012", country_id: 3, offer_letter_status: 1, offer_letter: "/offerletters/3_Offer_Letter.pdf", agent_id: 2 },
        ];

      setUsers(mockUsers);

      // Group mock users
      const grouped: GroupedUsers = {};
      grouped["Direct Students"] = mockUsers.filter(user => !user.agent_id);

      mockUsers.forEach(user => {
        if (user.agent_id) {
          const agentKey = `Agent ${user.agent_id}`;
          if (!grouped[agentKey]) {
            grouped[agentKey] = [];
          }
          grouped[agentKey].push(user);
        }
      });

      setGroupedUsers(grouped);

      // Extract unique agent IDs for filtering
      const uniqueAgents = Array.from(
        new Set(
          mockUsers
            .filter(user => user.agent_id)
            .map(user => user.agent_id)
        )
      ).map(id => ({
        id: id as number,
        name: `Agent ${id}`
      }));

      setAgentsList(uniqueAgents);

      setPagination({
        total: mockUsers.length,
        page: currentPage,
        limit: 10,
        totalPages: Math.ceil(mockUsers.length / 10),
      });
    }
  };

  // Fetch supporting data for registration
  const fetchSupportingData = async () => {
    try {
      // Fetch country codes
      const countryCodeRes = await fetch("/api/countries/country_code");
      const countryCodeData = await countryCodeRes.json();
      setCountryCodes(countryCodeData);

      // Fetch all countries
      const countriesRes = await axios.post("/api/countries/allcountries");
      setCountries(countriesRes.data);

      // Fetch course types
      const courseTypesRes = await axios("/api/fetchcoursetypes");
      setCourseTypes(courseTypesRes.data.result);
    } catch (error) {
      console.error("Error fetching supporting data:", error);
      toast.error("Failed to load supporting data");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSupportingData();
  }, [currentPage, filterStatus, filterAgent]);

  // Debounce search term input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleUserView = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);

    // Reset marks data
    setTenthMarks(null);
    setTwelfthMarks(null);

    // Fetch email status when user modal is opened
    console.log("user id", user.id);

    fetchEmailStatus(user.id);
    fetchAppointmentData(user.id); // Fetch appointment data
    fetchUniversityPaymentReceipts(user.id); // Fetch university payment receipts
  };

  // Add function to handle delete button click
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Add function to handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/admin/api/users/${userToDelete.id}`);

      if (response.status === 200) {
        toast.success("User deleted successfully");

        setUsers(users.filter(user => user.id !== userToDelete.id));

        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          totalPages: Math.ceil((prev.total - 1) / prev.limit)
        }));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleAgentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAgent(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Register modal functions
  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setRegisterStep(1);
    // Reset form data
    setRegisterFormData({
      name: "",
      email: "",
      phone_number: "",
      country_code: "",
      country_id: "",
      university_country: "",
      course_type_id: "",
      course_trade_id: "",
      id_proof: null,
      password: "",
      confirmPassword: "",
      program_id: "",
      university_id: "",
      tenth_certificate: null,
      twelfth_certificate: null,
      bachelor_certificate: null,
      other_certificate: [],
    });
  };

  // Email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone validation
  const validatePhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  // Handle register form input changes
  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));

    // Validate email
    if (name === "email") {
      setRegisterErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    // Validate phone number
    if (name === "phone_number") {
      setRegisterErrors((prev) => ({
        ...prev,
        phone_number: validatePhoneNumber(value)
          ? ""
          : "Phone number must be 10 digits",
      }));
    }

    // Handle country code selection
    if (name === "country_code") {
      axios
        .post("/api/countries", { id: value })
        .then((res) => {
          setCountry(res.data);
        })
        .catch((error) => console.error(error));
    }

    // Handle university country selection
    if (name === "university_country") {
      fetch("/api/universities/getuniversitiesbycountryid", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setUniversities(res.university);
        })
        .catch((error) => console.error(error));
    }

    // Handle university selection
    // if (name === "university_id") {
    //   console.log("university id", value);
    //   fetch("/api/universities/getprogramsbyuniversityid", {
    //     method: "POST",
    //     body: JSON.stringify({ id: value }),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       setPrograms(res.programs);
    //       console.log("program data", res.programs);
    //     })
    //     .catch((error) => console.error(error));
    // }

    // Handle course type selection
    if (name === "course_type_id") {
      axios
        .post("/api/programs/getprogrambycourseid", { id: value })
        .then((res) => {
          setPrograms(res.data.programs);
        })
        .catch((error) => console.error(error));
    }

    // Handle program selection
    if (name === "program_id") {
      fetch("/api/fetchcoursetrades", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setCourseTrades(res.trades);
        })
        .catch((error) => console.error(error));
    }
  };

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    if (file && file.type !== "application/pdf") {
      setRegisterErrors((prev) => ({
        ...prev,
        [field]: "Required PDF file (only .pdf allowed)",
      }));
      setRegisterFormData((prev) => ({
        ...prev,
        [field]: null,
      }));
    } else {
      setRegisterErrors((prev) => ({ ...prev, [field]: "" }));

      if (field === "other_certificate") {
        setRegisterFormData((prev) => ({
          ...prev,
          [field]: Array.from(files),
        }));
      } else {
        setRegisterFormData((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    }
  };

  // Next step in registration
  const nextRegisterStep = () => setRegisterStep((prevStep) => prevStep + 1);

  // Previous step in registration
  const prevRegisterStep = () => setRegisterStep((prevStep) => prevStep - 1);

  const submitRegisterForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(registerFormData).forEach(([key, value]) => {
      if (key === "other_certificate" && Array.isArray(value)) {
        value.forEach((file, index) => {
          formDataToSend.append(`other_certificate[${index}]`, file);
        });
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    console.log("Form Data Entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.message === "success") {
        toast.success("Registered Successfully! Check your email for OTP");
        // localStorage.setItem("email", registerFormData.email);
        router.push("/verify");
      } else {
        alert("Error in registering");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to handle opening the edit modal
  const handleEditUser = (user: User) => {
    setEditFormData({
      id: user.id.toString(),
      name: user.name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      program_id: user.program_id?.toString() || "",
      university_id: user.university_id?.toString() || ""
    });



    axios("/admin/api/programs/getProgram").then((res) => {
      setPrograms(res.data.programs);
    });

    axios("/api/universities").then((res) => {
      setUniversities(res.data.universities);
    });

    setShowEditModal(true);
  };

  // Handle edit form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {



    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit edit form
  const submitEditForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add all fields to form data
      Object.entries(editFormData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User profile updated successfully");
        setShowEditModal(false);
        // Refresh user list to show updated data
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Something went wrong while updating the profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for offer letter upload
  const handleOfferLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>, studentId: number) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append('email', selectedUser?.email || "");
    formData.append('offer_letter', file);

    try {
      toast.loading("Uploading offer letter...");
      const response = await axios.post('/admin/api/doc-upload/offerletter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.dismiss();
      toast.success("Offer letter uploaded successfully");
      fetchUsers(); // Refresh the user list
      setShowUserModal(false);

    } catch (error) {
      console.error("Error uploading offer letter:", error);
      toast.dismiss();
      toast.error("Failed to upload offer letter");
    }
  };
  const handlebonafideLetterUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    studentId: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("email", selectedUser?.email || "");
    formData.append("bonafide_letter", file);

    try {
      toast.loading("Uploading Bonafide letter...");
      const response = await axios.post(
        "/admin/api/doc-upload/bonafiedletter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.dismiss();
        toast.success("Bonafide letter uploaded successfully");
        fetchUsers(); // Refresh the user list
        setShowUserModal(false);
      } else {
        toast.dismiss();
        toast.error(
          response.data.message || "Failed to upload Bonafide letter"
        );
      }
    } catch (error) {
      console.error("Error uploading Bonafide letter:", error);
      toast.dismiss();
      toast.error("Failed to upload Bonafide letter");
    }
  };
  const handleadmissionLetterUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    studentId: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("email", selectedUser?.email || "");
    formData.append("admission_letter", file);

    try {
      toast.loading("Uploading Admission letter...");
      const response = await axios.post(
        "/admin/api/doc-upload/admissionletter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.dismiss();
        toast.success("Admission letter uploaded successfully");
        fetchUsers(); // Refresh the user list
        setShowUserModal(false);
      } else {
        toast.dismiss();
        toast.error(
          response.data.message || "Failed to upload Admission letter"
        );
      }
    } catch (error) {
      console.error("Error uploading Admission letter:", error);
      toast.dismiss();
      toast.error("Failed to upload Admission letter");
    }
  };
  const handlevisaLetterUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    studentId: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("email", selectedUser?.email || "");
    formData.append("visa", file);

    try {
      toast.loading("Uploading Visa letter...");
      const response = await axios.post(
        "/admin/api/doc-upload/visaletter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );



      console.log("Response:", response.data);


      if (response) {
        toast.dismiss();
        toast.success("Visa letter uploaded successfully");
        fetchUsers();
        setShowUserModal(false);
      }


    } catch (error) {
      console.error("Error uploading Visa letter:", error);
      toast.dismiss();
      toast.error("Failed to upload Visa letter");
    }
  };

  // Add handler for payment receipt upload
  const handlePaymentReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    studentId: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("email", selectedUser?.email || "");
    formData.append("payment_receipt", file);

    try {
      toast.loading("Uploading Payment Receipt...");
      const response = await axios.post(
        "/admin/api/doc-upload/payment-receipt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.dismiss();
        toast.success("Payment Receipt uploaded successfully");
        fetchUsers(); // Refresh the user list
        setShowUserModal(false);
      } else {
        toast.dismiss();
        toast.error(
          response.data.message || "Failed to upload Payment Receipt"
        );
      }
    } catch (error) {
      console.error("Error uploading Payment Receipt:", error);
      toast.dismiss();
      toast.error("Failed to upload Payment Receipt");
    }
  };

  // Add functions to handle eligibility toggle
  const handleEligibilityToggle = async (userId: number, isEligible: number) => {
    // Update toggle state first for immediate UI feedback
    const newEligibleStatus = isEligible === 1 ? 0 : 1;
    setToggleEligible(newEligibleStatus === 1);
    
    try {
      toast.loading("Updating eligibility status...");

      const endpoint = isEligible === 1
        ? "/admin/api/verify/not_eligible"
        : "/admin/api/verify/eligible";

      const response = await axios.post(endpoint, { email: selectedUser?.email });

      console.log(response.data, "for eligible toggle response");

      if (response.data.message === "success") {
        toast.dismiss();
        toast.success(`User is now ${isEligible === 1 ? 'not eligible' : 'eligible'}`);
        
        // Update the selected user's eligibility status in local state
        if (selectedUser) {
          selectedUser.is_eligible = newEligibleStatus;
        }
        
        fetchUsers(); // Refresh the user list
      } else {
        // Revert the toggle if API call fails
        setToggleEligible(isEligible === 1);
        toast.dismiss();
        toast.error(response.data.message || "Failed to update eligibility status");
      }
    } catch (error) {
      // Revert the toggle if API call errors
      setToggleEligible(isEligible === 1);
      console.error("Error updating eligibility status:", error);
      toast.dismiss();
      toast.error("Failed to update eligibility status");
    }
  };

  const fetchEmailStatus = async (id: number) => {
    try {
      const response = await axios.post("/api/manual-email-uni/get-status", { user_id: id });

      console.log("Email status response:", response.data);

      setEmailStatus(response.data.status.uni_email_status);

    } catch (error) {
      console.error("Error fetching email status:", error);
      setEmailStatus(0);
    }
  };

  const handleSendEmailToUniversity = async () => {
    if (!selectedUser) return;

    setIsEmailSending(true);
    try {
      const response = await axios.post("/api/manual-email-uni", {
        user_id: selectedUser.id,
        university_email: universityEmail,
        cc_email: ccEmail
      });

      if (response.data && response.data.success) {
        toast.success("Email sent to university successfully");
        setUniversityEmail("");
        setCcEmail("");
      } else {
        toast.error(response.data.message || "Failed to send email to university");
      }
    } catch (error) {
      console.error("Error sending email to university:", error);
      toast.error("Failed to send email to university");
    } finally {
      setIsEmailSending(false);
    }
  };

  // Add function to handle group card click
  const handleGroupClick = (groupName: string) => {
    setSelectedGroup(groupName === selectedGroup ? null : groupName);
  };

  // Handle document email form changes
  const handleDocumentEmailChange = (
    documentType: string,
    field: string,
    value: string
  ) => {
    setDocumentEmailRequests(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handle document request submission
  const handleAdmissionRequest = () => {
    if (!selectedUser) return;

    try {

      const { email, cc } = documentEmailRequests.admission_letter;

      console.log("Email and CC:", email, cc);
      

      axios.post("/api/manual-email-uni/request-addmission-letter", {
        user_id: selectedUser.id,
        university_email: email,
        cc_email: cc
      }).then((res) => {
        console.log("Bonafide Letter  :", res);
        toast.success("Bonafide Request Successfull !")
      })

    } catch (error) {
      console.error(`Error requesting Bonafide Letter:`, error);
      toast.dismiss();
    }
  }

  const handleBonafideRequest = () => {
    if (!selectedUser) return;

    try {

      const { email, cc } = documentEmailRequests.bonafide_letter;
      axios.post("/api/manual-email-uni/request-bonafide-letter", {
        user_id: selectedUser.id,
        university_email: email,
        cc_email: cc
      }).then((res) => {
        console.log("Bonafide Letter  :", res);
        toast.success("Bonafide Request Successfull !")
      })

    } catch (error) {
      console.error(`Error requesting Bonafide Letter:`, error);
      toast.dismiss();
    }
  }

  const handlePaymentRequest = () => {
    if (!selectedUser) return;

    try {

      const { email, cc } = documentEmailRequests.payment_receipt;
      axios.post("/api/manual-email-uni/request-docs-letter", {
        user_id: selectedUser.id,
        university_email: email,
        cc_email: cc
      }).then((res) => {
        console.log("Payment Letter  :", res);
        toast.success("Document Request Successfull !")
      })

    } catch (error) {
      console.error(`Error requesting Bonafide Letter:`, error);
      toast.dismiss();
    }
  }

  const handleVisaRequest = () => {
    if (!selectedUser) return;

    try {

      const { email, cc } = documentEmailRequests.visa;
      axios.post("/api/manual-email-uni/request-visa-letter", {
        user_id: selectedUser.id,
        university_email: email,
        cc_email: cc
      }).then((res) => {
        console.log("Visa Letter  :", res);
        toast.success("Visa Request Successfull !")
      })

    } catch (error) {
      console.error(`Error requesting Visa Letter:`, error);
      toast.dismiss();
    }
  }

  const handleAffiliationRequest = () => {
    if (!selectedUser) return;

    try {
      const { email, cc } = documentEmailRequests.affiliation_letter;
      
      // Include appointment data in the request
      axios.post("/api/manual-email-uni/request-affilation-letter", {
        user_id: selectedUser.id,
        university_email: email,
        cc_email: cc,
        appointment_date: appointmentData?.date,
        appointment_time: appointmentData?.time
      }).then((res) => {
        console.log("Embassy Letter:", res);
        toast.success("Embassy Appointment Request Successful!")
      })

    } catch (error) {
      console.error(`Error requesting Embassy Appointment:`, error);
      toast.dismiss();
    }
  }

  // Add handler for airport pickup form changes
  const handleAirportPickupChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setAirportPickupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add function to handle airport pickup request
  const handleAirportPickupRequest = async () => {
    if (!selectedUser) return;

    try {
      toast.loading("Uploading files and sending request...");

      const { email, cc } = documentEmailRequests.ugc_letter;

      // Create FormData to send files and form data
      const formData = new FormData();
      formData.append("user_id", selectedUser.id.toString());
      formData.append("university_email", email);
      formData.append("cc_email", cc || "");
      
      // Append airport pickup form data
      formData.append("departure_datetime", airportPickupForm.departure_datetime);
      formData.append("departure_port", airportPickupForm.departure_port);
      formData.append("destination_port", airportPickupForm.destination_port);
      formData.append("destination_datetime", airportPickupForm.destination_datetime);

      // Append files if they exist
      if (ticketPhoto) {
        formData.append("ticket_document", ticketPhoto);
      }

      const response = await axios.post(
        "/api/manual-email-uni/request-airport-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();
      console.log("Airport pickup request:", response);
      toast.success("Airport pickup request sent successfully!");

      // Reset the form and file inputs
      setAirportPickupForm({
        departure_datetime: "",
        departure_port: "",
        destination_port: "",
        destination_datetime: "",
      });
      setTicketPhoto(null);
    } catch (error) {
      console.error(`Error requesting airport pickup:`, error);
      toast.dismiss();
      toast.error("Failed to send airport pickup request");
    }
  };

  // Handle disperse commission payment
  const handleDisperseCommission = () => {

    toast.loading("Processing commission payment...");

    console.log(selectedUser?.id, disperseCommissionForm.amount);
    

    axios.post("/admin/api/commission", {
      user_id: selectedUser?.id,
      commission: disperseCommissionForm.amount,
    }).then((res) => {
      console.log(res.data);
      toast.dismiss();
      toast.success("Commission payment processed successfully");
    }).catch((err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Failed to process commission payment");
    })
  }

  // Handle commission receipt upload
  const handleCommissionReceiptUpload = async () => {
    if (!selectedUser || !commissionReceipt) {
      toast.error("Please select a receipt file to upload");
      return;
    }

    setUploadingReceipt(true);
    const formData = new FormData();
    formData.append('user_id', selectedUser.id.toString());
    formData.append('payment_receipt', commissionReceipt);

    try {
      toast.loading("Uploading commission receipt...");
      const response = await axios.post('/admin/api/commission/commission-reciept', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.dismiss();
      if (response.data && response.data) {
        toast.success("Commission receipt uploaded successfully");
        setCommissionReceipt(null);
      } else {
        toast.error(response.data?.message || "Failed to upload commission receipt");
      }
    } catch (error) {
      console.error("Error uploading commission receipt:", error);
      toast.dismiss();
      toast.error("Failed to upload commission receipt");
    } finally {
      setUploadingReceipt(false);
    }
  }

  return (
    <div className="dashboard-container">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div
        className={`main-admin-content w-100 ${sidebarCollapsed ? "content-collapsed" : ""}`}
      >
        <div className="dashboard-content">
          <div className="content-card mb-4">
            <div className="content-card-header d-flex justify-content-between align-items-center">
              <h5>Manage Users</h5>
              <div className="d-flex">
                <Form.Select
                  className="me-2"
                  style={{ width: "150px" }}
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
                <Form.Select
                  className="me-2"
                  style={{ width: "180px" }}
                  value={filterAgent}
                  onChange={handleAgentFilterChange}
                >
                  <option value="all">All Students</option>
                  <option value="direct">Direct Students</option>
                  {agentsList.map((agent) => (
                    <option key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </option>
                  ))}
                </Form.Select>
                <Button className=" d-flex align-items-center" variant="primary" size="sm" onClick={openRegisterModal}>
                  <FaPlus className="me-1" /> Add User
                </Button>
              </div>
            </div>
            <div className="content-card-body">
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading users data...</span>
                </div>
              ) : (
                <>
                  {Object.keys(groupedUsers).length > 0 ? (
                    <>
                      {/* Group Cards */}
                      <Row className="mb-4">
                        {Object.entries(groupedUsers).map(([groupName, groupUsers]) => (
                          <Col md={3} sm={6} className="mb-3" key={groupName}>
                            <Card
                              className={`h-100 cursor-pointer ${selectedGroup === groupName ? 'border-primary' : ''}`}
                              onClick={() => handleGroupClick(groupName)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                <div className={`icon-container p-3 rounded-circle mb-3 ${groupName === 'Direct Students' ? 'bg-success' : 'bg-primary'}`}>
                                  {groupName === 'Direct Students' ? (
                                    <FaUser className="text-white fs-4" />
                                  ) : (
                                    <FaUsers className="text-white fs-4" />
                                  )}
                                </div>
                                <h5 className="mb-2">{groupName}</h5>
                                <Badge bg="secondary" pill>
                                  {groupUsers.length} Students
                                </Badge>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      {/* Students Table (shown only when a group is selected) */}
                      {selectedGroup && (
                        <Card>
                          <Card.Header className="bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 d-flex justify-content-between align-items-center">
                                <span className="me-2">
                                  {selectedGroup === 'Direct Students' ? <FaUser /> : <FaUsers />}
                                </span>
                                {selectedGroup}
                              </h5>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setSelectedGroup(null)}
                              >
                                Back to Groups
                              </Button>
                            </div>
                          </Card.Header>
                          <Card.Body className="p-0">
                            <div className="table-responsive">
                              <Table hover className="mb-0">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Registered On</th>
                                    <th>Offer Letter</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {groupedUsers[selectedGroup].map((user) => (
                                    <tr key={user.id}>
                                      <td>{user.id}</td>
                                      <td>{user.name}</td>
                                      <td>{user.email}</td>
                                      <td>{user.phone_number}</td>
                                      <td>{formatDate(user.created_at)}</td>
                                      <td>
                                        {user.offer_letter_status === 1 ? (
                                          <Badge bg="success">Generated</Badge>
                                        ) : (
                                          <Badge bg="warning">Not Generated</Badge>
                                        )}
                                      </td>
                                      <td>
                                        <Button
                                          variant="light"
                                          size="sm"
                                          className="me-1"
                                          onClick={() => handleUserView(user)}
                                        >
                                          <FaEye />
                                        </Button>
                                        <Button
                                          variant="light"
                                          size="sm"
                                          className="mx-1"
                                          onClick={() => handleEditUser(user)}
                                        >
                                          <FaEdit />
                                        </Button>
                                        <Button
                                          variant="light"
                                          size="sm"
                                          onClick={() => handleDeleteClick(user)}
                                          className="text-danger"
                                        >
                                          <FaTrash />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Card.Body>
                        </Card>
                      )}

                      {!selectedGroup && (
                        <div className="text-center my-5 py-5">
                          <div className="mb-3 d-flex align-items-center justify-content-center">
                            <FaHandPointUp className="text-muted" style={{ fontSize: '3rem' }} />
                          </div>
                          <h4>Select a group to view students</h4>
                          <p className="text-muted">
                            Click on any card above to view students in that group
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <Alert variant="info">
                      No students found matching the current filters.
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Statistics */}
          {/* <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon blue mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="mb-0">{pagination.total}</h3>
                  <p className="text-muted">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon green mb-3">
                    <FaCheckCircle />
                  </div>
                  <h3 className="mb-0">{users.filter(user => user.status === 'active').length}</h3>
                  <p className="text-muted">Active Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon yellow mb-3">
                    <FaFilter />
                  </div>
                  <h3 className="mb-0">{users.filter(user => user.status === 'pending').length}</h3>
                  <p className="text-muted">Pending Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="stat-icon red mb-3">
                    <FaTimesCircle />
                  </div>
                  <h3 className="mb-0">{users.filter(user => user.status === 'inactive').length}</h3>
                  <p className="text-muted">Inactive Users</p>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
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

      <Modal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        centered
        size="lg"
        className="user-details-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedUser && (
            <div>
              {selectedUser.request_doc === 1 && (
                <Alert variant="info" className="mb-4 d-flex align-items-center">
                  <FaFileAlt className="me-3 text-primary fs-5" />
                  <div>
                    <strong>Document Request:</strong> This student is requesting Bonafide Letter, Admission Letter, and Affiliation Letter.
                  </div>
                </Alert>
              )}

              <div className="user-profile-header mb-4 d-flex align-items-center bg-light p-3 rounded">
                <div className="user-avatar me-3 position-relative">
                  {selectedUser.profile_img ? (
                    <img
                      src={selectedUser.profile_img}
                      alt={selectedUser.name}
                      className="rounded-circle"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                      style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                    >
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Badge
                    bg={
                      selectedUser.status === "active"
                        ? "success"
                        : selectedUser.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                    className="position-absolute bottom-0 end-0 rounded-circle p-2 border border-2 border-white"
                    style={{ transform: "translate(20%, 20%)" }}
                  />
                </div>
                <div className="user-info">
                  <h4 className="mb-1">{selectedUser.name}</h4>
                  <p className="text-muted mb-0 d-flex justify-content-between align-items-center">
                    <FaEnvelope className="me-2" />
                    {selectedUser.email}
                  </p>
                  <p className="text-muted mb-0 d-flex  align-items-center">
                    <FaPhone className="me-2" />
                    {selectedUser.phone_number || "Not provided"}
                  </p>
                  {selectedUser.agent_id && (
                    <p className="mt-1">
                      <Badge bg="info" className="px-2 py-1 d-flex align-items-center gap-4">
                        <FaUser className="me-1" /> Agent ID: {selectedUser.agent_id}
                      </Badge>
                    </p>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="info-card mb-4 border rounded p-3">
                    <h5 className="border-bottom pb-2 d-flex align-items-center">
                      <FaUser className="me-2 text-primary" /> Basic Information
                    </h5>
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="text-muted" width="40%">Status</td>
                          <td>
                            <Badge
                              bg={
                                selectedUser.status === "active"
                                  ? "success"
                                  : selectedUser.status === "pending"
                                    ? "warning"
                                    : "danger"
                              }
                              className="px-3 py-2"
                            >
                              {selectedUser.status}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Country</td>
                          <td>{selectedUser.country_id}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Registered</td>
                          <td>{formatDate(selectedUser.created_at)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Is Eligible</td>
                          <td>
                           <Form.Check 
                             type="switch" 
                             id="eligibility-switch" 
                             checked={toggleEligible} 
                             onChange={() => handleEligibilityToggle(selectedUser.id, selectedUser.is_eligible || 0)}
                             label={toggleEligible ? "Eligible" : "Not Eligible"}
                           />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Academic Records</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => {
                                  fetchTenthMarks(selectedUser?.tenth_marks_id);
                                  setShowTenthMarksModal(true);
                                }}
                              >
                                10th Marks
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => {
                                  fetchTwelfthMarks(selectedUser?.twelfth_marks_id);
                                  setShowTwelfthMarksModal(true);
                                }}
                              >
                                12th Marks
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-card mb-4 border rounded p-3">
                    <h5 className="border-bottom pb-2 d-flex align-items-center">
                      <FaGraduationCap className="me-2 text-primary" /> Educational Details
                    </h5>
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="text-muted" width="40%">Program</td>
                          <td>{selectedUser.program_id}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">University</td>
                          <td>{selectedUser.university_id}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Course Type</td>
                          <td>{selectedUser.course_type_id}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Course Trade</td>
                          <td>{selectedUser.course_trade_id}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="info-card mb-4 border rounded p-3">
                <h5 className="border-bottom pb-2 d-flex align-items-center">
                  <FaEnvelope className="me-2 text-primary" /> University Communication
                </h5>
                <Form className="mt-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>University Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="University Email"
                          value={universityEmail}
                          onChange={(e) => setUniversityEmail(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CC Email (optional)</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="CC Email"
                          value={ccEmail}
                          onChange={(e) => setCcEmail(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="primary"
                      disabled={emailStatus === 0 || isEmailSending || !universityEmail}
                      onClick={handleSendEmailToUniversity}
                      className="me-3"
                    >
                      {isEmailSending ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending...
                        </>
                      ) : (
                        <div className="d-flex align-items-center">
                          <FaPaperPlane className="me-2" />
                          Send Email to University
                        </div>
                      )}
                    </Button>
                    {emailStatus === 0 && (
                      <Badge bg="warning">
                        User has not applied for offer letter
                      </Badge>
                    )}
                  </div>
                </Form>
              </div>

              {/* Documents Section */}
              <Tabs defaultActiveKey="educational" className="mb-4">
                <Tab eventKey="educational" title={<span className="d-flex justify-content-between align-items-center"><FaFileAlt className="me-2" />Educational</span>}>
                  <div className="p-3 border border-top-0 rounded-bottom">
                    <div style={styles.documentGrid}>
                      <DocumentCard
                        title="10th Certificate"
                        documentUrl={selectedUser?.tenth_certificate}
                      />
                      <DocumentCard
                        title="12th Certificate"
                        documentUrl={selectedUser?.twelfth_certificate}
                      />
                      <DocumentCard
                        title="Bachelor Certificate"
                        documentUrl={selectedUser?.bachelor_certificate}
                      />
                      <DocumentCard
                        title="ID Proof"
                        documentUrl={selectedUser?.id_proof}
                      />
                      <DocumentCard
                        title="Other Certificate"
                        documentUrl={selectedUser?.other_certificate}
                      />
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="university" title={<span className="d-flex justify-content-between align-items-center"><FaUniversity className="me-2" />University</span>}>
                  <div className="p-3 border border-top-0 rounded-bottom">
                    <div className="document-section">
                      {/* Offer Letter (Keep original card) */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Offer Letter
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.offer_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser.offer_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Document
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Not Uploaded</Badge>
                              )}

                              <div className="mt-2">
                                <Form.Group>
                                  <Form.Label className="small text-muted">Upload PDF file</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleOfferLetterUpload(e as any, selectedUser?.id || 0)}
                                    size="sm"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="status-container">
                                <Badge bg={selectedUser?.offer_letter_status === 1 ? "success" : "warning"}>
                                  {selectedUser?.offer_letter_status === 1 ? "Generated" : "Not Generated"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Receipt (keep original format) */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Payment Receipt
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.payment_receipt ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.payment_receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Document
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Not Uploaded</Badge>
                              )}
                              
                              {/* Add file upload field for payment receipt */}
                              <div className="mt-2">
                                <Form.Group>
                                  <Form.Label className="small text-muted">Upload PDF file</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handlePaymentReceiptUpload(e as any, selectedUser?.id || 0)}
                                    size="sm"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="University email"
                                  value={documentEmailRequests.payment_receipt.email}
                                  onChange={(e) => handleDocumentEmailChange("payment_receipt", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.payment_receipt.cc}
                                  onChange={(e) => handleDocumentEmailChange("payment_receipt", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handlePaymentRequest}
                                disabled={!documentEmailRequests.payment_receipt.email}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" />Email to  University
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                     

                      {/* Admission Letter with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Admission Letter
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.admission_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.admission_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Document
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Not Uploaded</Badge>
                              )}

                              <div className="mt-2">
                                <Form.Group>
                                  <Form.Label className="small text-muted">Upload PDF file</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleadmissionLetterUpload(e as any, selectedUser?.id || 0)}
                                    size="sm"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="University email"
                                  value={documentEmailRequests.admission_letter.email}
                                  onChange={(e) => handleDocumentEmailChange("admission_letter", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.admission_letter.cc}
                                  onChange={(e) => handleDocumentEmailChange("admission_letter", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAdmissionRequest}
                                disabled={!documentEmailRequests.admission_letter.email}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" /> Request Admission Letter
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                       {/* Bonafide Letter with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Bonafide Letter
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.bonafide_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.bonafide_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Document
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Not Uploaded</Badge>
                              )}

                              <div className="mt-2">
                                <Form.Group>
                                  <Form.Label className="small text-muted">Upload PDF file</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handlebonafideLetterUpload(e as any, selectedUser?.id || 0)}
                                    size="sm"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="University email"
                                  value={documentEmailRequests.bonafide_letter.email}
                                  onChange={(e) => handleDocumentEmailChange("bonafide_letter", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.bonafide_letter.cc}
                                  onChange={(e) => handleDocumentEmailChange("bonafide_letter", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleBonafideRequest}
                                disabled={!documentEmailRequests.bonafide_letter.email}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" /> Request Bonafide Letter
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                       {/* Affiliation Letter with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Request to Embassy
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.admission_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.admission_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Admission Document
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Admission Document Not Uploaded</Badge>
                              )}
                              {selectedUser?.offer_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.offer_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Offer Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Offer Letter Not Uploaded</Badge>
                              )}
                              {selectedUser?.bonafide_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.bonafide_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Bonafide Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Bonafide Not Uploaded</Badge>
                              )}
                              {selectedUser?.visa ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.visa}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Visa Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Visa Not Uploaded</Badge>
                              )}
                              {selectedUser?.ugc_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.ugc_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View UGC Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">UGC Not Uploaded</Badge>
                              )}
                              {selectedUser?.affiliation_letter ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.affiliation_letter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Affiliation Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Affiliation Letter Not Uploaded</Badge>
                              )}
                              {selectedUser?.payment_receipt ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.payment_receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Payment Reciept
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Payment Reciept Not Uploaded</Badge>
                              )}
                              
                              {/* Add appointment information section */}
                              <div className="mt-3 pt-2 border-top">
                                <h6 className="mb-2">Embassy Appointment Details</h6>
                                {appointmentData?.date && appointmentData?.time ? (
                                  <Alert variant="info" className="mb-0 py-2">
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        <strong>Date:</strong> {appointmentData.date}
                                      </div>
                                      <div>
                                        <strong>Time:</strong> {appointmentData.time}
                                      </div>
                                    </div>
                                  </Alert>
                                ) : (
                                  <Alert variant="warning" className="mb-0 py-2">
                                    No appointment details available
                                  </Alert>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">Embassy Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="Embassy email"
                                  value={documentEmailRequests.affiliation_letter.email}
                                  onChange={(e) => handleDocumentEmailChange("affiliation_letter", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.affiliation_letter.cc}
                                  onChange={(e) => handleDocumentEmailChange("affiliation_letter", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAffiliationRequest}
                                disabled={!documentEmailRequests.affiliation_letter.email || !appointmentData?.date || !appointmentData?.time}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" /> Request Embassy Appointment
                              </Button>
                              {!appointmentData?.date || !appointmentData?.time ? (
                                <div className="mt-2">
                                  <small className="text-danger">
                                    Student hasn't uploaded appointment date and time
                                  </small>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visa with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Visa
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              {selectedUser?.visa ? (
                                <div className="mt-2">
                                  <a
                                    href={selectedUser?.visa}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  >
                                    <FaEye className="me-1" /> View Visa Letter
                                  </a>
                                </div>
                              ) : (
                                <Badge bg="secondary">Visa Not Uploaded</Badge>
                              )}

                              <div className="mt-2">
                                <Form.Group>
                                  <Form.Label className="small text-muted">Upload PDF file</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handlevisaLetterUpload(e as any, selectedUser?.id || 0)}
                                    size="sm"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="University email"
                                  value={documentEmailRequests.visa.email}
                                  onChange={(e) => handleDocumentEmailChange("visa", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.visa.cc}
                                  onChange={(e) => handleDocumentEmailChange("visa", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleVisaRequest}
                                disabled={!documentEmailRequests.visa.email}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" /> Request Visa
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      

                     

                      

                      {/* UGC Letter with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Airport Pickup Arrangement
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <Row>
                                <Col md={12}>
                                  <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">Departure Date & Time</Form.Label>
                                    <Form.Control
                                      type="datetime-local"
                                      name="departure_datetime"
                                      value={airportPickupForm.departure_datetime}
                                      onChange={handleAirportPickupChange as any}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={12}>
                                  <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">Departure Airport/Port</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="departure_port"
                                      placeholder="e.g., JFK International Airport"
                                      value={airportPickupForm.departure_port}
                                      onChange={handleAirportPickupChange as any}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={12}>
                                  <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">Destination Airport/Port</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="destination_port"
                                      placeholder="e.g., Heathrow Airport"
                                      value={airportPickupForm.destination_port}
                                      onChange={handleAirportPickupChange as any}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={12}>
                                  <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">Arrival Date & Time</Form.Label>
                                    <Form.Control
                                      type="datetime-local"
                                      name="destination_datetime"
                                      value={airportPickupForm.destination_datetime}
                                      onChange={handleAirportPickupChange as any}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              {/* Ticket Photo Upload Field */}
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">Upload Ticket Photo</Form.Label>
                                <Form.Control
                                  type="file"
                                  accept="image/*,.pdf"
                                  size="sm"
                                  onChange={(e) => {
                                    const files = (e.target as HTMLInputElement).files;
                                    if (files && files.length > 0) {
                                      setTicketPhoto(files[0]);
                                    }
                                  }}
                                />
                                {ticketPhoto && (
                                  <small className="text-success">
                                    Selected: {ticketPhoto.name}
                                  </small>
                                )}
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="University email"
                                  value={documentEmailRequests.ugc_letter.email}
                                  onChange={(e) => handleDocumentEmailChange("ugc_letter", "email", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  value={documentEmailRequests.ugc_letter.cc}
                                  onChange={(e) => handleDocumentEmailChange("ugc_letter", "cc", e.target.value)}
                                  size="sm"
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAirportPickupRequest}
                                disabled={
                                  !documentEmailRequests.ugc_letter.email ||
                                  !airportPickupForm.departure_datetime ||
                                  !airportPickupForm.departure_port ||
                                  !airportPickupForm.destination_port ||
                                  !airportPickupForm.destination_datetime ||
                                  !ticketPhoto
                                }
                                className="d-flex justify-content-between align-items-center"
                              >
                                <FaPaperPlane className="me-1" /> Request Airport Pickup
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* UGC Letter with email request */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> University Final Payment Receipts
                          </h6>
                        </div>
                        <div className="card-body">
                          {isLoadingPaymentReceipts ? (
                            <div className="text-center py-3">
                              <Spinner animation="border" size="sm" />
                              <p className="mb-0 mt-2">Loading payment receipts...</p>
                            </div>
                          ) : universityPaymentReceipts && universityPaymentReceipts.length > 0 ? (
                            <div className="document-list">
                              {universityPaymentReceipts.map((receipt, index) => (
                                <div key={index} className="mb-2 border-bottom pb-2">
                                  <div className="d-flex align-items-center">
                                    <FaFileAlt className="me-2 text-primary" />
                                    <span className="me-3">{receipt.name || `Receipt ${index + 1}`}</span>
                                    <a
                                      href={receipt.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary ms-auto d-flex align-items-center"
                                    >
                                      <FaEye className="me-1" /> View Receipt
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Alert variant="info" className="mb-0">
                              No university payment receipts available for this student.
                            </Alert>
                          )}
                        </div>
                      </div>

                      {/* Agent Commission Section */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Release of Commission
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Commission Amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter commission amount"
                                  size="sm"
                                  value={commissionForm.amount}
                                  onChange={(e) => setCommissionForm({ ...commissionForm, amount: e.target.value })}
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">University Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="Email address"
                                  size="sm"
                                  value={commissionForm.email}
                                  onChange={(e) => setCommissionForm({ ...commissionForm, email: e.target.value })}
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="small text-muted">CC Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="CC email (optional)"
                                  size="sm"
                                  value={commissionForm.cc}
                                  onChange={(e) => setCommissionForm({ ...commissionForm, cc: e.target.value })}
                                />
                              </Form.Group>
                              <Button
                                variant="primary"
                                className="d-flex justify-content-between align-items-center"
                                size="sm"
                                disabled={universityPaymentReceipts.length === 0}
                                onClick={() => {
                                  if (!selectedUser) return;

                                  if (!commissionForm.amount || !commissionForm.email) {
                                    toast.error("Please enter commission amount and email");
                                    return;
                                  }

                                  toast.loading("Sending commission data...");

                                  axios.post("/api/commission", {
                                    user_id: selectedUser.id,
                                    agent_id: selectedUser.agent_id,
                                    commission: commissionForm.amount,
                                    email: commissionForm.email,
                                    cc: commissionForm.cc || ""
                                  })
                                    .then(response => {
                                      toast.dismiss();
                                      toast.success("Commission information sent successfully");

                                      setCommissionForm({
                                        amount: "",
                                        email: "",
                                        cc: ""
                                      });
                                    })
                                    .catch(error => {
                                      console.error("Error sending commission data:", error);
                                      toast.dismiss();
                                      toast.error("Failed to send commission data");
                                    });
                                }}
                              >
                                <FaPaperPlane className="me-1" /> Request for  Commission
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Disperse Commission Section */}
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <FaFileAlt className="me-2 text-primary" /> Disperse Commission
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-8">
                              <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Commission Amount to Pay</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter commission amount"
                                  value={disperseCommissionForm.amount}
                                  onChange={(e) => setDisperseCommissionForm({...disperseCommissionForm, amount: e.target.value})}
                                  disabled={isProcessingPayment || !selectedUser?.agent_id}
                                />
                                {!selectedUser?.agent_id && (
                                  <div className="text-danger mt-2 small">
                                    <em>This student is not associated with any agent</em>
                                  </div>
                                )}
                              </Form.Group>
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                              <Button 
                                variant="success" 
                                className="w-100 d-flex justify-content-center align-items-center"
                                onClick={handleDisperseCommission}
                                disabled={isProcessingPayment || !disperseCommissionForm.amount || !selectedUser?.agent_id}
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
                            </div>
                          </div>
                          
                          {/* Add Commission Receipt Upload */}
                          <div className="row mt-4 pt-3 border-top">
                            <div className="col-md-8">
                              <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Upload Payment Receipt</Form.Label>
                                <Form.Control
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = (e.target as HTMLInputElement).files;
                                    if (files && files.length > 0) {
                                      setCommissionReceipt(files[0]);
                                    }
                                  }}
                                  disabled={uploadingReceipt || !selectedUser?.agent_id}
                                />
                                {commissionReceipt && (
                                  <small className="text-success mt-1 d-block">
                                    Selected: {commissionReceipt.name}
                                  </small>
                                )}
                              </Form.Group>
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                              <Button 
                                variant="outline-primary" 
                                className="w-100 d-flex justify-content-center align-items-center"
                                onClick={handleCommissionReceiptUpload}
                                disabled={uploadingReceipt || !commissionReceipt || !selectedUser?.agent_id}
                              >
                                {uploadingReceipt ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-2"
                                    />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <FaFileUpload className="me-1" /> Upload Receipt
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          {/*                           
                          <div className="mt-3">
                            <Alert variant="info" className="mb-0 py-2">
                              <small>
                                <strong>Note:</strong> This will process a direct payment to the agent through Razorpay. 
                                Make sure you have entered the correct amount before proceeding.
                              </small>
                            </Alert>
                          </div> */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
          <Button className="d-flex align-items-center" variant="outline-primary" onClick={() => handleEditUser(selectedUser!)}>
            <FaEdit className="me-2" /> Edit User
          </Button>
        </Modal.Footer>
      </Modal>
 
      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Register New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitRegisterForm}>
            {registerStep === 1 && (
              <>
                <h5 className="mb-3">Step 1: Basic Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={registerFormData.name}
                        onChange={handleRegisterChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerFormData.email}
                        onChange={handleRegisterChange}
                        required
                        isInvalid={!!registerErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country Code</Form.Label>
                      <Form.Select
                        name="country_code"
                        value={registerFormData.country_code}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select Country Code</option>
                        {countryCodes.map((code: any) => (
                          <option key={code.id} value={code?.country_id}>
                            {code.phone_code}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        value={registerFormData.phone_number}
                        onChange={handleRegisterChange}
                        required
                        isInvalid={!!registerErrors.phone_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.phone_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        name="country_id"
                        value={registerFormData.country_id}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select Country</option>
                        {country.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerFormData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={registerFormData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        isInvalid={
                          registerFormData.confirmPassword !== "" &&
                          registerFormData.password !==
                          registerFormData.confirmPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {registerStep === 2 && (
              <>
                <h5 className="mb-3">Step 2: Educational Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Type</Form.Label>
                      <Form.Select
                        name="course_type_id"
                        value={registerFormData.course_type_id}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select Course Type</option>
                        {courseTypes.map((type: any) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Program</Form.Label>
                      <Form.Select
                        name="program_id"
                        value={registerFormData.program_id}
                        onChange={handleRegisterChange}
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
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Trade</Form.Label>
                      <Form.Select
                        name="course_trade_id"
                        value={registerFormData.course_trade_id}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select Course Trade</option>
                        {courseTrades.map((trade: any) => (
                          <option key={trade.id} value={trade.id}>
                            {trade.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>University Country</Form.Label>
                      <Form.Select
                        name="university_country"
                        value={registerFormData.university_country}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select University Country</option>
                        {countries.map((country: any) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>University</Form.Label>
                      <Form.Select
                        name="university_id"
                        value={registerFormData.university_id}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Select University</option>
                        {universities.map((university: any) => (
                          <option key={university.id} value={university.id}>
                            {university.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {registerStep === 3 && (
              <>
                <h5 className="mb-3">Step 3: Document Upload</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Proof (PDF)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(e, "id_proof")}
                        accept=".pdf"
                        required
                        isInvalid={!!registerErrors.id_proof}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.id_proof}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>10th Certificate (PDF)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, "tenth_certificate")
                        }
                        accept=".pdf"
                        required
                        isInvalid={!!registerErrors.tenth_certificate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.tenth_certificate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>12th Certificate (PDF)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, "twelfth_certificate")
                        }
                        accept=".pdf"
                        required
                        isInvalid={!!registerErrors.twelfth_certificate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.twelfth_certificate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {registerFormData.course_type_id == "2" ? (
                      <Form.Group
                        className="mb-3"
                        controlId="formBachelorCertificate"
                      >
                        <Form.Label>Bachelor Certificate (PDF only)</Form.Label>
                        <Form.Control
                          accept="application/pdf"
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "bachelor_certificate")
                          }
                        />

                        <Form.Control.Feedback type="invalid">
                          {registerErrors.bachelor_certificate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Other Certificates (PDF, multiple files)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, "other_certificate")
                        }
                        accept=".pdf"
                        multiple
                        isInvalid={!!registerErrors.other_certificate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {registerErrors.other_certificate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {registerStep > 1 && (
            <Button variant="secondary" onClick={prevRegisterStep}>
              Previous
            </Button>
          )}

          {registerStep < 3 ? (
            <Button
              variant="primary"
              onClick={nextRegisterStep}
              disabled={
                (registerStep === 1 &&
                  (!registerFormData.name ||
                    !registerFormData.email ||
                    !registerFormData.phone_number ||
                    !registerFormData.country_code ||
                    !registerFormData.country_id ||
                    !registerFormData.password ||
                    !registerFormData.confirmPassword ||
                    registerFormData.password !==
                    registerFormData.confirmPassword ||
                    !!registerErrors.email ||
                    !!registerErrors.phone_number)) ||
                (registerStep === 2 &&
                  (!registerFormData.course_type_id ||
                    !registerFormData.program_id ||
                    !registerFormData.university_country ||
                    !registerFormData.university_id))
              }
            >
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={submitRegisterForm}>
              Register User
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Add Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitEditForm}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange as any}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange as any}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={editFormData.phone_number}
                onChange={handleEditFormChange as any}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Program</Form.Label>
              <Form.Select
                name="program_id"
                value={editFormData.program_id}
                onChange={handleEditFormChange as any}
              >
                <option value="">Select Program</option>
                {programs
                  ? programs.map((program: any) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))
                  : ""}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>University</Form.Label>
              <Form.Select
                name="university_id"
                value={editFormData.university_id}
                onChange={handleEditFormChange as any}
              >
                <option value="">Select University</option>
                {universities
                  ? universities.map((university: any) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))
                  : ""}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowEditModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
          <p className="fw-bold text-danger">This action cannot be undone.</p>
          {userToDelete && (
            <div className="alert alert-secondary">
              <small>
                <strong>Name:</strong> {userToDelete.name}
                <br />
                <strong>Email:</strong> {userToDelete.email}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 10th Marks Modal */}
      <Modal
        show={showTenthMarksModal}
        onHide={() => setShowTenthMarksModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>10th Grade Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingMarks ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading marks data...</p>
            </div>
          ) : tenthMarks && tenthMarks.length > 0 ? (
            <>
              <div className="mb-3">
                <h6>Student: {selectedUser?.name}</h6>
              </div>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr className="bg-light">
                    <th>Subject</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {tenthMarks.map((subject: any, index: number) => (
                    <tr key={index}>
                      <td>{subject.subject}</td>
                      <td>{subject.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {tenthMarks[0]?.percentage && (
                <div className="mt-3 text-end">
                  <Badge bg="success" className="p-2 fs-6">Overall Percentage: {tenthMarks[0].percentage}%</Badge>
                </div>
              )}
            </>
          ) : (
            <Alert variant="warning">
              No marks data found for this student. The student may not have uploaded their 10th grade marks.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTenthMarksModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 12th Marks Modal */}
      <Modal
        show={showTwelfthMarksModal}
        onHide={() => setShowTwelfthMarksModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>12th Grade Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingMarks ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading marks data...</p>
            </div>
          ) : twelfthMarks && twelfthMarks.length > 0 ? (
            <>
              <div className="mb-3">
                <h6>Student: {selectedUser?.name}</h6>
              </div>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr className="bg-light">
                    <th>Subject</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {twelfthMarks.map((subject: any, index: number) => (
                    <tr key={index}>
                      <td>{subject.subject}</td>
                      <td>{subject.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {twelfthMarks[0]?.percentage && (
                <div className="mt-3 text-end">
                  <Badge bg="success" className="p-2 fs-6">Overall Percentage: {twelfthMarks[0].percentage}%</Badge>
                </div>
              )}
            </>
          ) : (
            <Alert variant="warning">
              No marks data found for this student. The student may not have uploaded their 12th grade marks.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTwelfthMarksModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 