"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFilePdf, FaRegClock, FaGraduationCap } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import {
  FaEye,
  FaFileAlt,
  FaCheckCircle,
  FaCreditCard,
  FaUniversity,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTimesCircle,
  FaArrowRight,
  FaListAlt,
  FaPassport,
  FaPlaneDeparture,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Card, Badge, ProgressBar } from "react-bootstrap";
import { IoIosArrowDropdown } from "react-icons/io";

import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Container, Spinner, Alert } from "react-bootstrap";
import { useUser } from "@/context/userContext";

interface OfferLetter {
  name: string;
  url: string;
}

export default function Dashboard() {
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]);
  const [documents, setDocuments] = useState<OfferLetter[]>([]);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [user, setUser] = useState({});
  const [program, setProgram] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [thumbnails, setThumbnails] = useState({});
  const [document_verified, setDocumentVerfied] = useState(false);

  const [elgible, setEligible] = useState(false);

  const userContext = useUser();

  useEffect(() => {
    setLoading(true);
    const userJson = localStorage.getItem("user");
    const email = userJson ? JSON.parse(userJson)?.email : null;
    const user_id = userJson ? JSON.parse(userJson)?.id : null;
    
    if (!email || !user_id) {
      router.push("/login");
      return;
    }

    axios
      .post("/api/documentverify/iseligible/getStatus", { email })
      .then((res) => {
        console.log("is eligible : ", res.data);
        if (res.data.status.is_eligible == 1) {
          setEligible(true);
        } else {
          setEligible(false);
        }
      });

    const getUserCertificatesInfo = async () => {
      const userResponse = await axios.post("/api/getuserbyemail", { email });

      if (userResponse.data.user.bachelor_certificate != null) {
        try {
          axios
            .post("/api/scan-documents/bachelor-scan", { email })
            .then((res) => {
              console.log("bachelor scan hua ya nahi", res.data);

              if(res.data.bachelor_certificate.isBachelorCertificate == true){
                toast.success("Your Bachelor Certificate is verified successfully");
                localStorage.setItem("document_verified", "1");
                const id = JSON.parse(localStorage.getItem("user")).id;

                axios.post("/api/documentverify", { id }).then((res) => {
                  console.log("bachleor document verify", res);

                  setDocumentVerfied(true);
                  
                  elgible && toast.success(
                    "Your all documents Successfully verified !"
                  );
                }).catch((err) => {console.log(err);
                })
                axios
                  .post("/api/documentverify/iseligible", { email })
                  .then((res) => {
                    console.log("is elgible : ", res.data);
                    if (res.data.success == true) {
                      setEligible(true);
                    } else {
                      setEligible(false);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
        } catch (err) {
          console.log(err);
        }
      } else if (userResponse.data.user.bachelor_certificate == null) {
        try {
          const response = await axios.post("/api/scan-documents", {
            email,
          });

          const id = JSON.parse(localStorage.getItem("user")).id;

          if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text !== "" &&
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text !== ""
          ) {
            axios.post("/api/documentverify", { id }).then((res) => {
              console.log("hua ya nahi documentverify", res);

              setDocumentVerfied(true);
              elgible && toast.success(
                "Your all documents Successfully verified !"
              );
            });

            console.log("response.data before detecting", response.data);

            detectStream(userResponse, response);
          } else if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text !== ""
          ) {
            elgible && toast.success(
              "Your 10th Certificate is verified successfully"
            );
            localStorage.setItem("document_verified", "1");
          } else if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text == ""
          ) {
            toast.error("Please upload your 10th Certificate quality document");
            localStorage.setItem("document_verified", "0");
          } else {
            toast.error(
              "Please upload your 10th Certificate original document"
            );
            localStorage.setItem("document_verified", "0");
          }

          if (
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text !== ""
          ) {
            elgible &&
               toast.success("Your 12th Certificate is verified successfully");
            localStorage.setItem("document_verified", "1");
          } else if (
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text == ""
          ) {
            toast.error("Please upload your 12th Certificate quality document");
            localStorage.setItem("document_verified", "0");
          } else {
            toast.error(
              "Please upload your 12th Certificate original document"
            );
            localStorage.setItem("document_verified", "0");
          }
        } catch (error) {
          console.error("Error verifying documents:", error);
        }
      }
    };

    axios
      .post("/api/documentverify/getStatus", { email })
      .then((res) => {
        console.log("documentverify : ", res);
        console.log(
          "res.data.status.document_verified_status  :",
          res.data.status.document_verified_status
        ); 

        if (res.data.status.document_verified_status === 1) {
          setDocumentVerfied(true);
          userContext.setDocVerification(true);
        } else if (res.data.status.document_verified_status === 0) {
          setDocumentVerfied(false);
          userContext.setDocVerification(false);
        }
      })
      .catch((err) => {
        console.log("documentverify : ", err);
      });

    const getUserDetails = () => {
      axios
        .post("/api/getuserbyemail", { email })
        .then((res) => {
          setUser(res.data.user);
          console.log("res.data.user) : ", res.data.user);

          const program_id = res.data.user.program_id;
          const university_id = res.data.user.university_id;

          axios
            .post("/api/programs/getprogrambyid", { id: program_id })
            .then((res) => {
              setProgram(res.data.program);
            })
            .catch((err) => {
              console.log(err);
            });

          axios
            .post("/api/universities/getuniversitybyid", { id: university_id })
            .then((res) => {
              setUniversity(res.data.university);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });


    };

    const fetchOfferLetters = async () => {
      try {
        const response = await axios.post(
          "/api/offer-letter/getofferletterbyemail",
          { email }
        );
        if (response) {
          if (response.data.offerLetters) {
            setOfferLetters(response.data.offerLetters);
          } else {
            setOfferLetters([]);
          }
        } else {
          setOfferLetters([]);
        }
      } catch (error) {
        console.log("Error fetching offer letters:", error);
      }
    };

    fetchOfferLetters();

    const fetchDocuments = async () => {
      try {
        const response = await axios.post(
          "/api/send-documents/getdocumentsbyemail",
          { email }
        );

        if (response.data.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();

    const getPaymentInfo = async () => {
      try {
        const response = await axios.post("/api/payment/getpaymentinfo", {
          email,
        });

        if (response.data.data.payment_status == 1) {
          setPaymentStatus(response.data.data.payment_status);
        }
      } catch (error) {
        console.error("Error fetching payment info:", error);
      }
    };

    const getReminders = () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("/api/appointment-notification/getreminder", { id })
        .then((res) => {
          const { appointment_date, appointment_time } = res.data.reminders;

          const date = new Date(appointment_date);

          const [hours, minutes] = appointment_time.split(":").map(Number);

          date.setHours(hours);
          date.setMinutes(minutes);
          date.setSeconds(0);

          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }).format(date);

          toast.success(
            `Your appointment at the Indian Embassy is on: ${formattedDate}`,
            {
              position: "top-right",
              duration: 15000,
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getUserDetails();
    fetchDocuments();
    getPaymentInfo();

    getReminders();
    setLoading(false);
  }, [router]);

  const [dverified, setDverified] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [offerLetterGenerated, setOfferLetterGenerated] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [checklistCompleted, setChecklistCompleted] = useState(false);
  const [embassyCompleted, setEmbassyCompleted] = useState(false);
  const [airportPickupCompleted, setAirportPickupCompleted] = useState(false);

  const [startDate, setStartDate] = useState("September 1, 2023");
  const [fees, setFees] = useState(100);

  useEffect(() => {
    setLoading(true);
    if (document_verified == true) {
      setDverified(true);
    } else {
      setDverified(false);
    }

    const userJson = localStorage.getItem("user");
    const email = userJson ? JSON.parse(userJson)?.email : null;
    const user_id = userJson ? JSON.parse(userJson)?.id : null;

    if (!email || !user_id) {
      router.push("/login");
      return;
    }

    axios
      .post("/api/application-submitted/get-status", { email })
      .then((res) => {
        console.log("application submitted get Status", res);

        if (res.data.status.application_submitted == 0) {
          setApplicationSubmitted(false);
        } else if (res.data.status.application_submitted == 1) {
          setApplicationSubmitted(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setApplicationSubmitted(false);
      });

    axios
      .post("/api/offer-letter/getStatus", { email })
      .then((res) => {
        console.log("offer letter hai ya nahi", res);

        if (res.data[0].offer_letter_status == 0) {
          setOfferLetterGenerated(false);
        } else if (res.data[0].offer_letter_status == 1) {
          setOfferLetterGenerated(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post("/api/payment/getpaymentinfo", { email })
      .then((res) => {
        console.log(" getpaymentinfo", res);

        if (res.data.data.payment_status == 0) {
          setPaymentCompleted(false);
        } else if (res.data.data.payment_status == 1) {
          setPaymentCompleted(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setPaymentCompleted(false);
      });

    axios
      .post("/api/checklist-documents/get-documents/get-status", { user_id })
      .then((res) => {
        console.log("Checklist documents status:", res.data);
        if (res.data && res.data.documents && res.data.documents.length > 0) {
          setChecklistCompleted(true);
        } else {
          setChecklistCompleted(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching checklist documents:", err);
        setChecklistCompleted(false);
      });

    axios
      .post("/api/embassy/visa-status/get-visa", { user_id })
      .then((res) => {
        console.log("Embassy visa status:", res.data);
        if (res.data && res.data.documents && res.data.documents.length > 0) {
          setEmbassyCompleted(true);
        } else {
          setEmbassyCompleted(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching embassy status:", err);
        setEmbassyCompleted(false);
      });

    axios
      .post("/api/airport-pickup/get-status", { user_id })
      .then((res) => {
        console.log("Airport pickup status:", res.data);
        if (res.data && res.data.users && res.data.users.length > 0) {
          setAirportPickupCompleted(true);
        } else {
          setAirportPickupCompleted(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching airport pickup status:", err);
        setAirportPickupCompleted(false);
      });

    const userString = localStorage.getItem("user");
    if (!userString) {
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(userString);
      const email = userData?.email;

      if (!email) {
        setLoading(false);
        return;
      }

      const getUserDetails = async () => {
        try {
          const userResponse = await axios.post("/api/getuserbyemail", {
            email,
          });
          const userData = userResponse.data.user;
          setUser(userData);

          if (userData?.program_id) {
            try {
              const programResponse = await axios.post(
                "/api/programs/getprogrambyid",
                { id: userData.program_id }
              );
              setProgram(programResponse.data.program);
              localStorage.setItem(
                "program_name",
                programResponse.data.program.name
              );
            } catch (err) {
              console.error("Error fetching program:", err);
            }
          }

          if (userData?.university_id) {
            try {
              const universityResponse = await axios.post(
                "/api/universities/getuniversitybyid",
                { id: userData.university_id }
              );
              setUniversity(universityResponse.data.university);
              localStorage.setItem(
                "university_name",
                universityResponse.data.university.name
              );
            } catch (err) {
              console.error("Error fetching university:", err);
            }
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      };

      getUserDetails();
    } catch (err) {
      console.error("Error parsing user data:", err);
      setLoading(false);
    }
  }, []);

  const handleSubmitApplication = () => {
    setLoading(true);

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      toast.error("User information not found. Please login again.");
      router.push("/login");
      return;
    }
    
    const email = JSON.parse(userJson).email;

    axios
      .post("/api/application-submitted", { email })
      .then((res) => {
        console.log("application_submitted", res.data);

        localStorage.setItem("application_submitted", "true");

        toast.success("Your Documents is in process of verification");

        setApplicationSubmitted(true);
        if (userContext && userContext.setAppSubmitted) {
          userContext.setAppSubmitted(true);
        }

        setShowSuccessMessage(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleNextStep = () => {
    router.push("/applications/offerletter");
  };

  return (
    <div className="dashboard-content p-4">
      <div className="welcome-banner mb-5">
        <div className="welcome-content">
          <h2 className="fade-in">Welcome to Your Dashboard</h2>
          <p className="slide-in-right delay-1">
            Manage your applications, documents, and track your progress
          </p>
        </div>
      </div>

      <div className="milestone-roadmap mb-5">
        <div className="roadmap-container">
          <h4 className="roadmap-title">Your Application Journey</h4>
          <div className="roadmap-path">
            <div
              className="milestone-marker milestone-1 mt-5 ms-3"
              data-status={applicationSubmitted ? "completed" : "current"}
            >
              <div className="milestone-icon">
                <FaFileAlt />
              </div>
              <div className="milestone-number">1</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-2"
              data-status={
                document_verified
                  ? applicationSubmitted
                    ? "completed"
                    : "current"
                  : "pending"
              }
            >
              <div className="milestone-icon">
                <FaCheckCircle />
              </div>
              <div className="milestone-number">2</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-3"
              data-status={
                offerLetterGenerated
                  ? "completed"
                  : document_verified && applicationSubmitted
                    ? "current"
                    : "pending"
              }
            >
              <div className="milestone-icon">
                <FaFilePdf />
              </div>
              <div className="milestone-number">3</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-4"
              data-status={
                paymentCompleted
                  ? "completed"
                  : offerLetterGenerated
                    ? "current"
                    : "pending"
              }
            >
              <div className="milestone-icon">
                <FaCreditCard />
              </div>
              <div className="milestone-number">4</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-5"
              data-status={
                checklistCompleted
                  ? "completed"
                  : paymentCompleted
                    ? "current"
                    : "pending"
              }
            >
              <div className="milestone-icon">
                <FaListAlt />
              </div>
              <div className="milestone-number">5</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-6"
              data-status={
                embassyCompleted
                  ? "completed"
                  : checklistCompleted
                    ? "current"
                    : "pending"
              }
            >
              <div className="milestone-icon">
                <FaPassport />
              </div>
              <div className="milestone-number">6</div>
              <div className="marker-pulse"></div>
            </div>
            <div
              className="milestone-marker milestone-7 mt-5 me-4"
              data-status={
                airportPickupCompleted
                  ? "completed"
                  : embassyCompleted
                    ? "current"
                    : "pending"
              }
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
              <h5>Submit Application</h5>
              <p className="milestone-status">
                {applicationSubmitted ? "Completed" : "Current"}
              </p>
            </div>
            <div className="milestone-label milestone-label-2">
              <h5>Eligibility</h5>
              <p className="milestone-status">
                {document_verified
                  ? "Completed"
                  : applicationSubmitted
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
            <div className="milestone-label milestone-label-3">
              <h5>Offer Letter</h5>
              <p className="milestone-status">
                {offerLetterGenerated
                  ? "Completed"
                  : document_verified && applicationSubmitted
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
            <div className="milestone-label milestone-label-4">
              <h5>Payment</h5>
              <p className="milestone-status">
                {paymentCompleted
                  ? "Completed"
                  : offerLetterGenerated
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
            <div className="milestone-label milestone-label-5">
              <h5>Checklist Documents</h5>
              <p className="milestone-status">
                {checklistCompleted
                  ? "Completed"
                  : paymentCompleted
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
            <div className="milestone-label milestone-label-6">
              <h5>Embassy Completion</h5>
              <p className="milestone-status">
                {embassyCompleted
                  ? "Completed"
                  : checklistCompleted
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
            <div className="milestone-label milestone-label-7">
              <h5>Airport Pickup</h5>
              <p className="milestone-status">
                {airportPickupCompleted
                  ? "Completed"
                  : embassyCompleted
                    ? "Current"
                    : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="milestone-descriptions mb-5">
        <div className="container">
          <Row>
            <Col md={3} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-1-color">
                  1
                </div>
                <h5>Submit Application</h5>
                <p>
                  Complete and submit your application with all required
                  information to begin the admission process.
                </p>
                <div className="milestone-action">
                  {applicationSubmitted ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Completed
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      className="action-button"
                      onClick={handleSubmitApplication}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Start Now <FaArrowRight className="ms-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Col>

            <Col md={3} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-2-color">
                  2
                </div>
                <h5>Eligibility Check</h5>
                <p>
                  Our team verifies your documents and academic qualifications
                  for program eligibility.
                </p>
                <div className="milestone-action">
                  {document_verified ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge
                      bg={applicationSubmitted ? "warning" : "secondary"}
                      className={
                        applicationSubmitted
                          ? "status-in-progress"
                          : "status-pending"
                      }
                    >
                      {applicationSubmitted ? (
                        <>
                          <FaRegClock className="me-1" /> In Progress
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="me-1" /> Pending
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            </Col>

            <Col md={3} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-3-color">
                  3
                </div>
                <h5>Offer Letter</h5>
                <p>
                  Receive your official offer letter from the university upon
                  successful verification.
                </p>
                <div className="milestone-action">
                  {offerLetterGenerated ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Generated
                    </Badge>
                  ) : document_verified && applicationSubmitted ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="action-button"
                      onClick={handleNextStep}
                    >
                      Generate Now <FaArrowRight className="ms-1" />
                    </Button>
                  ) : (
                    <Badge bg="secondary" className="status-pending">
                      <FaTimesCircle className="me-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Col>

            <Col md={3} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-4-color">
                  4
                </div>
                <h5>Payment</h5>
                <p>
                  Complete your fee payment to confirm your admission and secure
                  your spot.
                </p>
                <div className="milestone-action">
                  {paymentCompleted ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Paid
                    </Badge>
                  ) : offerLetterGenerated ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="action-button"
                      onClick={() => router.push("/applications/payment")}
                    >
                      Pay Now <FaArrowRight className="ms-1" />
                    </Button>
                  ) : (
                    <Badge bg="secondary" className="status-pending">
                      <FaTimesCircle className="me-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={4} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-5-color">
                  5
                </div>
                <h5>Checklist Documents</h5>
                <p>
                  Prepare and submit all required documents for visa processing and university admission.
                </p>
                <div className="milestone-action">
                  {checklistCompleted ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Completed
                    </Badge>
                  ) : paymentCompleted ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="action-button"
                      onClick={() => router.push("/checklist-documents")}
                    >
                      Submit Documents <FaArrowRight className="ms-1" />
                    </Button>
                  ) : (
                    <Badge bg="secondary" className="status-pending">
                      <FaTimesCircle className="me-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Col>

            <Col md={4} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-6-color">
                  6
                </div>
                <h5>Embassy Completion</h5>
                <p>
                  Complete your visa interview and embassy procedures to prepare for your journey.
                </p>
                <div className="milestone-action">
                  {embassyCompleted ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Completed
                    </Badge>
                  ) : checklistCompleted ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="action-button"
                      onClick={() => router.push("/embassy-procedures")}
                    >
                      Schedule Interview <FaArrowRight className="ms-1" />
                    </Button>
                  ) : (
                    <Badge bg="secondary" className="status-pending">
                      <FaTimesCircle className="me-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Col>

            <Col md={4} sm={6} className="mb-3">
              <div className="milestone-description-card">
                <div className="milestone-number-badge milestone-7-color">
                  7
                </div>
                <h5>Airport Pickup</h5>
                <p>
                  Schedule your airport pickup service upon arrival for a smooth transition to your new campus.
                </p>
                <div className="milestone-action">
                  {airportPickupCompleted ? (
                    <Badge bg="success" className="status-completed">
                      <FaCheckCircle className="me-1" /> Scheduled
                    </Badge>
                  ) : embassyCompleted ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="action-button"
                      onClick={() => router.push("/airport-pickup")}
                    >
                      Schedule Pickup <FaArrowRight className="ms-1" />
                    </Button>
                  ) : (
                    <Badge bg="secondary" className="status-pending">
                      <FaTimesCircle className="me-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="stats-cards mb-5">
        <div className="row">
          <div className="col-md-6 col-sm-6 mb-4">
            <div className="stat-card fade-in">
              <div className="stat-card-body">
                <div className="stat-icon blue">
                  <FaUniversity />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{university?.name || "N/A"}</h3>
                  <p className="stat-title">Selected University</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-arrow-up"></i> Excellent Choice
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-1">
              <div className="stat-card-body">
                <div className="stat-icon red">
                  <FaGraduationCap />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{program?.name || "N/A"}</h3>
                  <p className="stat-title">Selected Program</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-arrow-up"></i> Great Selection
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-2">
              <div className="stat-card-body">
                <div className="stat-icon green">
                  <FaFileAlt />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{documents.length}</h3>
                  <p className="stat-title">Documents</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-check"></i>{" "}
                  {document_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-3">
              <div className="stat-card-body">
                <div className="stat-icon yellow">
                  <FaRegClock />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    {paymentStatus === 1 ? "Paid" : "Pending"}
                  </h3>
                  <p className="stat-title">Payment Status</p>
                </div>
              </div>
              <div className="stat-footer">
                <span
                  className={`stat-growth ${paymentStatus === 1 ? "positive" : "negative"}`}
                >
                  <i
                    className={`fas fa-${paymentStatus === 1 ? "check" : "clock"}`}
                  ></i>{" "}
                  {paymentStatus === 1 ? "Completed" : "Action Required"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="application-header">
          <div className="header-title-section">
            <div className="header-icon">
              <FaFileAlt />
            </div>
            <div className="header-text">
              <h4>Application Status</h4>
              <p className="header-subtitle">Manage your application details</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your application details...</p>
          </div>
        ) : (
          <div className="content-card-body">
            <Row className="mb-4">
              <Col lg={8}>
                <Card className="shadow-sm h-100 status-card">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-gradient-primary text-white">
                    <h5 className="mb-0">Application Details</h5>
                    <Badge
                      bg={dverified ? "success" : "warning"}
                      className="status-badge"
                    >
                      {document_verified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive className="application-details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted w-100 d-flex align-items-center gap-2">
                            <FaUniversity className="" /> University
                          </td>
                          <td className="value">
                            {university?.name || "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted w-100 d-flex align-items-center gap-2">
                            <FaGraduationCap className="" /> Program
                          </td>
                          <td className="value">
                            {program?.name || "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted w-100 d-flex align-items-center gap-2">
                            <FaCalendarAlt className="" /> Start Date
                          </td>
                          <td className="value">{startDate}</td>
                        </tr>
                        <tr>
                          <td className="text-muted w-100 d-flex align-items-center gap-2">
                            <FaMoneyBillWave className="" /> Fees
                          </td>
                          <td className="value">₹{fees}</td>
                        </tr>
                        <tr>
                          <td className="text-muted w-100 d-flex align-items-center gap-2">
                            <FaFileAlt className="" /> Document Status
                          </td>
                          <td className="value">
                            {document_verified ? (
                              <span className="text-success w-100 d-flex align-items-center">
                                <FaCheckCircle className="me-2" /> Documents
                                Verified
                              </span>
                            ) : (
                              <span className="text-warning w-100 d-flex align-items-center">
                                <FaTimesCircle className="me-2" /> Pending
                                Verification
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    {!applicationSubmitted && (
                      <div className="text-center mt-4">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleSubmitApplication}
                          disabled={loading}
                        >
                          {loading ? (
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
                            <>Submit Application</>
                          )}
                        </Button>
                      </div>
                    )}

                    {applicationSubmitted &&
                      elgible &&
                      !offerLetterGenerated && (
                        <div className="text-center mt-4 d-flex align-items-center justify-content-center">
                          <Button
                            variant="success d-flex align-items-center"
                            onClick={handleNextStep}
                          >
                            Request Offer Letter{" "}
                            <FaArrowRight className="ms-2" />
                          </Button>
                        </div>
                      )}

                    {offerLetterGenerated && !paymentCompleted && (
                      <div className="text-center mt-4 d-flex align-items-center justify-content-center">
                        <Button
                          className="d-flex  align-items-center"
                          variant="success"
                          onClick={() => router.push("/applications/payment")}
                        >
                          Continue to Payment <FaArrowRight className="ms-2" />
                        </Button>
                      </div>
                    )}

                    {paymentCompleted && (
                      <div className="text-center mt-4">
                        <Alert variant="success">
                          <FaCheckCircle className="me-2" />
                          Your application process is complete. Thank you!
                        </Alert>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-gradient-success text-white">
                    <h5 className="mb-0">Application Progress</h5>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column">
                    <div className="progress-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Document Verification</span>
                        <span>{document_verified ? "100%" : "50%"}</span>
                      </div>
                      <ProgressBar
                        variant={document_verified ? "success" : "warning"}
                        now={document_verified ? 100 : 50}
                        className="custom-progress"
                      />
                    </div>

                    <div className="progress-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Application Submission</span>
                        <span>{applicationSubmitted ? "100%" : "0%"}</span>
                      </div>
                      <ProgressBar
                        variant={applicationSubmitted ? "success" : "info"}
                        now={applicationSubmitted ? 100 : 0}
                        className="custom-progress"
                      />
                    </div>

                    <div className="progress-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Offer Letter</span>
                        <span>{offerLetterGenerated ? "100%" : "0%"}</span>
                      </div>
                      <ProgressBar
                        variant={offerLetterGenerated ? "success" : "info"}
                        now={offerLetterGenerated ? 100 : 0}
                        className="custom-progress"
                      />
                    </div>

                    <div className="progress-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>Payment</span>
                        <span>{paymentCompleted ? "100%" : "0%"}</span>
                      </div>
                      <ProgressBar
                        variant={paymentCompleted ? "success" : "info"}
                        now={paymentCompleted ? 100 : 0}
                        className="custom-progress"
                      />
                    </div>

                    <div className="aplplication-steps mt-4">
                      <h6 className="mb-3">Application Steps</h6>
                      <div className="step-item d-flex align-items-start mb-3">
                        <div
                          className={`step-number ${dverified ? "completed" : "in-progress"}`}
                        >
                          1
                        </div>
                        <div className="step-info ms-3">
                          <h6 className="mb-1">Document Verification</h6>
                          <p className="text-muted small mb-0">
                            {dverified
                              ? "Documents verified successfully"
                              : "Your documents are being verified"}
                          </p>
                        </div>
                      </div>

                      <div className="step-item d-flex align-items-start mb-3">
                        <div
                          className={`step-number ${applicationSubmitted ? "completed" : dverified ? "in-progress" : "pending"}`}
                        >
                          2
                        </div>
                        <div className="step-info ms-3">
                          <h6 className="mb-1">Submit Application</h6>
                          <p className="text-muted small mb-0">
                            {applicationSubmitted
                              ? "Application submitted successfully"
                              : dverified
                                ? "Ready to submit"
                                : "Waiting for document verification"}
                          </p>
                        </div>
                      </div>

                      <div className="step-item d-flex align-items-start mb-3">
                        <div
                          className={`step-number ${offerLetterGenerated ? "completed" : applicationSubmitted ? "in-progress" : "pending"}`}
                        >
                          3
                        </div>
                        <div className="step-info ms-3">
                          <h6 className="mb-1">Generate Offer Letter</h6>
                          <p className="text-muted small mb-0">
                            {offerLetterGenerated
                              ? "Offer letter generated successfully"
                              : applicationSubmitted
                                ? "Ready to generate"
                                : "Waiting for application submission"}
                          </p>
                        </div>
                      </div>

                      <div className="step-item d-flex align-items-start">
                        <div
                          className={`step-number ${paymentCompleted ? "completed" : offerLetterGenerated ? "in-progress" : "pending"}`}
                        >
                          4
                        </div>
                        <div className="step-info ms-3">
                          <h6 className="mb-1">Complete Payment</h6>
                          <p className="text-muted small mb-0">
                            {paymentCompleted
                              ? "Payment completed successfully"
                              : offerLetterGenerated
                                ? "Ready for payment"
                                : "Waiting for offer letter"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-progress {
          height: 10px;
          border-radius: 5px;
        }

        .status-badge {
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .header-title-section {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4a56e2, #7b68ee);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          margin-right: 16px;
        }

        .header-subtitle {
          color: #718096;
          margin-bottom: 0;
        }

        .application-details-table td.text-muted {
          width: 35%;
        }

        .application-details-table td.value {
          font-weight: 500;
        }

        .property-icon {
          color: #4a56e2;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .step-number.completed {
          background-color: #28a745;
        }

        .step-number.in-progress {
          background-color: #007bff;
        }

        .step-number.pending {
          background-color: #6c757d;
        }

        .step-info h6 {
          font-size: 14px;
          margin-bottom: 0;
        }

        /* Milestone Description Cards */
        .milestone-descriptions {
          margin-top: -20px;
          animation: fadeIn 1s ease-out;
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .milestone-description-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          height: 100%;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          position: relative;
          border-top: 5px solid #e9ecef;
          display: flex;
          flex-direction: column;
          animation: slideInFromBottom 0.8s ease-out forwards;
          animation-delay: calc(var(--i) * 0.15s + 0.6s);
          opacity: 0;
          transform: translateY(20px);
        }

        .milestone-description-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
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

        .milestone-1-color {
          background-color: #dc3545;
        }

        .milestone-2-color {
          background-color: #fd7e14;
        }

        .milestone-3-color {
          background-color: #20c997;
        }

        .milestone-4-color {
          background-color: #6610f2;
        }

        .milestone-description-card h5 {
          margin-top: 10px;
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 17px;
        }

        .milestone-description-card p {
          color: #6c757d;
          font-size: 14px;
          margin-bottom: 15px;
          flex-grow: 1;
        }

        .milestone-number-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 15px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
          margin-bottom: 5px;
        }

        .milestone-description-card:nth-child(1) {
          border-top-color: #dc3545;
        }

        .milestone-description-card:nth-child(2) {
          border-top-color: #fd7e14;
        }

        .milestone-description-card:nth-child(3) {
          border-top-color: #20c997;
        }

        .milestone-description-card:nth-child(4) {
          border-top-color: #6610f2;
        }

        .milestone-description-card:nth-child(5) {
          border-top-color: #4299e1;
        }

        .milestone-description-card:nth-child(6) {
          border-top-color: #805ad5;
        }

        .milestone-description-card:nth-child(7) {
          border-top-color: #38b2ac;
        }

        .milestone-action {
          display: flex;
          justify-content: center;
          margin-top: auto;
        }

        .action-button {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .status-completed,
        .status-in-progress,
        .status-pending {
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .status-completed {
          background-color: rgba(40, 167, 69, 0.15) !important;
          color: #28a745 !important;
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .status-in-progress {
          background-color: rgba(255, 193, 7, 0.15) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .status-pending {
          background-color: rgba(108, 117, 125, 0.15) !important;
          color: #6c757d !important;
          border: 1px solid rgba(108, 117, 125, 0.3);
        }
      `}</style>

      <style jsx global>{`
        /* Document Card Styles */
        .document-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .document-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .document-thumbnail {
          height: 200px;
          background-size: cover;
          background-position: top center;
          border-bottom: 1px solid #f0f0f0;
        }

        .document-details {
          padding: 16px;
        }

        .document-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .document-status {
          margin-bottom: 15px;
        }

        .document-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: var(--primary-light);
          color: white;
        }

        .empty-state,
        .payment-required {
          padding: 40px 20px;
        }

        .university-program-info {
          max-width: 400px;
          margin: 0 auto;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }

        .selected-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .value {
          font-weight: 600;
          color: var(--secondary);
        }
      `}</style>

      <style jsx global>{`
        /* Roadmap Styles */
        .milestone-roadmap {
          padding: 40px 20px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          margin-top: 20px;
          animation: fadeIn 0.8s ease-out;
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

        .roadmap-title {
          text-align: center;
          margin-bottom: 35px;
          color: #333;
          font-weight: 600;
          font-size: 22px;
          animation: fadeIn 0.8s ease-out;
        }

        .roadmap-container {
          max-width: 900px;
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
          background-color: #dc3545;
          color: white;
        }

        .milestone-2 {
          animation-delay: 0.4s;
          --i: 2;
          background-color: #fd7e14;
          color: white;
        }

        .milestone-3 {
          animation-delay: 0.6s;
          --i: 3;
          background-color: #20c997;
          color: white;
        }

        .milestone-4 {
          animation-delay: 0.8s;
          --i: 4;
          background-color: #6610f2;
          color: white;
        }

        .milestone-5 {
          animation-delay: 1.0s;
          --i: 5;
          background-color: #4299e1;
          color: white;
        }

        .milestone-6 {
          animation-delay: 1.2s;
          --i: 6;
          background-color: #805ad5;
          color: white;
        }

        .milestone-7 {
          animation-delay: 1.4s;
          --i: 7;
          background-color: #38b2ac;
          color: white;
        }

        .milestone-marker[data-status="pending"] {
          background-color: #e9ecef;
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
          background-color: #e9ecef;
          color: #6c757d;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .milestone-marker[data-status="current"] {
          background-color: #007bff;
          color: white;
          transform: rotate(-45deg) scale(1.12);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
          z-index: 3;
        }

        .milestone-marker[data-status="completed"] {
          background-color: #28a745;
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

        .milestone-status {
          font-size: 14px;
          margin: 0;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-block;
        }

        .milestone-label-1 .milestone-status {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .milestone-label-2 .milestone-status {
          background-color: rgba(253, 126, 20, 0.1);
          color: #fd7e14;
        }

        .milestone-label-3 .milestone-status {
          background-color: rgba(32, 201, 151, 0.1);
          color: #20c997;
        }

        .milestone-label-4 .milestone-status {
          background-color: rgba(102, 16, 242, 0.1);
          color: #6610f2;
        }

        .milestone-label-5 .milestone-status {
          background-color: rgba(66, 153, 225, 0.1);
          color: #4299e1;
        }

        .milestone-label-6 .milestone-status {
          background-color: rgba(128, 90, 213, 0.1);
          color: #805ad5;
        }

        .milestone-label-7 .milestone-status {
          background-color: rgba(56, 178, 172, 0.1);
          color: #38b2ac;
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

          .milestone-status {
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
