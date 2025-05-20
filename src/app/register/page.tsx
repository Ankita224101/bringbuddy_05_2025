"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import "../../assets/styles/style.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// Add types for the marks data structure
interface SubjectMark {
  subject: string;
  marks: string;
}

interface TenthMarksData {
  id: string;
  subjects: SubjectMark[];
  grade: string;
  percentage: string;
}

// Define interface for form data
interface FormDataState {
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  country_id: string;
  university_country: string;
  course_type_id: string;
  course_trade_id: string;
  id_proof: File | null;
  profile_img: File | null;
  password: string;
  confirmPassword: string;
  program_id: string;
  university_id: string;
  tenth_marks_id: string;
  twelfth_marks_id: string;
  bachelor_marks_id: string;
  tenth_certificate: File | null;
  twelfth_certificate: File | null;
  bachelor_certificate: File | null;
  other_certificate: File[];
  register_with_agent: boolean;
  agent_id: string;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    phone_number: "",
    country_code:"",
    country_id: "",
    university_country: "",
    course_type_id: "",
    course_trade_id: "",
    id_proof: null,
    profile_img: null,
    password: "",
    confirmPassword: "",
    program_id: "",
    university_id: "",
    tenth_marks_id: "",
    twelfth_marks_id: "",
    bachelor_marks_id: "",
    tenth_certificate: null,
    twelfth_certificate: null,
    bachelor_certificate: null,
    other_certificate: [],
    register_with_agent: false,
    agent_id: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
    id_proof: "",
    tenth_certificate: "",
    twelfth_certificate: "",
    bachelor_certificate: "",
    other_certificate: "",
    profile_img: "",
  });

  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country_code, setCountryCode] = useState([]);
  const [program, setProgram] = useState([]);
  const [university, setUniversity] = useState([]);
  const [course_type, setCourseType] = useState([]);
  const [course_trade, setCourseTrade] = useState([]);
  const router = useRouter();

  // Add state for marks modal
  const [showMarksModal, setShowMarksModal] = useState(false);

  const [tenthMarks, setTenthMarks] = useState({
    id: uuidv4(),
    subjects: [{ subject: "", marks: "" }],
    grade: "",
    percentage: ""
  });
  const [twelfthMarks, setTwelfthMarks] = useState({
    id: uuidv4(),
    subjects: [{ subject: "", marks: "" }],
    grade: "",
    percentage: ""
  });
  const [bachelorMarks, setBachelorMarks] = useState({
    id: uuidv4(),
    marks: "",
    degree : "",
    grade: "",
    percentage: ""
  });
  const [twelthModal, setTwelthModal] = useState(false);
  const [bachelorModal, setBachelorModal] = useState(false);

  useEffect(() => {

    fetch("/api/countries/country_code")
      .then((res) => res.json())
      .then((res) => setCountryCode(res))
      .catch((error) => console.error(error));



axios
  .post("/api/countries/allcountries")
  .then((res) => {
    setCountries(res.data);
    console.log("country data", res.data);
  })
  .catch((error) => console.error(error));
      

    
      axios("/api/fetchcoursetypes")
      .then((res) => {
        console.log(res.data);
        setCourseType(res.data.result);
      })
      .catch((error) => console.error(error))
  }, []);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "phone_number") {
      setErrors((prev) => ({
        ...prev,
        phone_number: validatePhoneNumber(value)
          ? ""
          : "Phone number must be 10 digits",
      }));
    }



    if (name === "university_country"){
      console.log("university country", value);
      fetch("/api/universities/getuniversitiesbycountryid", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setUniversity(res.university);
          console.log("university data", res.university);
          
        })
        .catch((error) => console.error(error));
    }

    if (name === "university_id") {

      console.log("university id", value);
      fetch("/api/universities/getprogramsbyuniversityid", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setProgram(res.programs);
          console.log("program data", res.programs);
        })
        .catch((error) => console.error(error));
    }

    if (name === "country_code") {
      console.log("code value", value);

      axios
        .post("/api/countries", { id: value })
        .then((res) => {
          setCountry(res.data);
          console.log("country data", res.data);
        })
        .catch((error) => console.error(error));
    }

    
    if (name == "course_type_id") {
      console.log("program id :", value);
      axios
        .post("/api/programs/getprogrambycourseid", { id: value })
        .then((res) => {
          console.log(res.data, "program data");
          setProgram(res.data.programs);
        })
        .catch((error) => console.error(error));
    }

    // if (name === "program_id") {
    //   fetch("/api/universities", {
    //     method: "POST",
    //     body: JSON.stringify({ programId: value }),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => setUniversity(res.universities))
    //     .catch((error) => console.error(error));
    // }


    if (name === "program_id") {
      fetch("/api/fetchcoursetrades", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.trades, "course trades");
          setCourseTrade(res.trades);
        })
        .catch((error) => console.error(error));
    }

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    
    if (field === "profile_img" && file && !file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Please upload an image file",
      }));
      return;
    }
    
    if (field !== "profile_img" && file && file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        [field]: "Required PDF file (only .pdf allowed)",
      }));
      return;
    }
    
    setErrors((prev) => ({ ...prev, [field]: "" }));
    
    if (field === "other_certificate") {
      setFormData((prev) => ({
        ...prev,
        [field]: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Check if required files are present
    if (!formData.id_proof) {
      setErrors(prev => ({...prev, id_proof: "Passport document is required"}));
      return;
    }
    
    if (!formData.profile_img) {
      setErrors(prev => ({...prev, profile_img: "Profile photo is required"}));
      return;
    }
    
    if (!formData.tenth_certificate) {
      setErrors(prev => ({...prev, tenth_certificate: "10th certificate is required"}));
      return;
    }
    
    if (!formData.twelfth_certificate) {
      setErrors(prev => ({...prev, twelfth_certificate: "12th certificate is required"}));
      return;
    }
    
    // Add bachelor certificate validation only if course type is 2 (Masters)
    if (formData.course_type_id === "2" && !formData.bachelor_certificate) {
      setErrors(prev => ({...prev, bachelor_certificate: "Bachelor certificate is required"}));
      return;
    }

    // Append all form data fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "other_certificate" && Array.isArray(value) && value.length > 0) {
        value.forEach((file, index) => {
          formDataToSend.append(`other_certificate[${index}]`, file);
        });
      } else if (value !== null && value !== undefined && value !== "") {
        if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? "1" : "0");
        } else {
          formDataToSend.append(key, value as string | Blob);
        }
      }
    });

    console.log("Form Data Entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      toast.loading("Submitting registration...");
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      toast.dismiss();

      if (data.message === "success") {
        toast.success("Registered Successfully! Check your email for OTP");
        localStorage.setItem("email", formData.email);
        router.push("/verify");
      } else {
        toast.error(data.error || "Error in registering");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error uploading files or registering");
      console.error("Error uploading files:", error);
    }
  };

  // Add function to handle adding a new row
  const addSubjectRow = () => {
    setTenthMarks(prev => ({
      ...prev,
      subjects: [...prev.subjects, { subject: "", marks: "" }]
    }));
    setTwelfthMarks(prev => ({
      ...prev,
      subjects: [...prev.subjects, { subject: "", marks: "" }]
    }));
  };
  
  // Add function to handle removing a row
  const removeSubjectRow = (index: number) => {
    setTenthMarks(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));

       setTwelfthMarks(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
    
  };
  
  // Add function to handle subject and marks input changes
  const handleMarksChange = (index: number, field: keyof SubjectMark, value: string) => {
    setTenthMarks(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index] = { 
        ...updatedSubjects[index], 
        [field]: value 
      };
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });

       setTwelfthMarks(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index] = { 
        ...updatedSubjects[index], 
        [field]: value 
      };
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });

    
  };
  
  // Add function to handle grade and percentage changes
  const handleGradeChange = (field: keyof Pick<TenthMarksData, 'grade' | 'percentage' | 'degree' | 'marks'>, value: string) => {
    setTenthMarks(prev => ({
      ...prev,
      [field]: value
    }));
   setTwelfthMarks(prev => ({
      ...prev,
      [field]: value
    }));

    setBachelorMarks(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Add function to submit marks
  const submitMarks = async () => {
    try {
      const response = await axios.post('/api/marks/tenth-marks', tenthMarks);
      if (response.data.success) {
        toast.success('Marks saved successfully');
        formData.tenth_marks_id = tenthMarks.id;
        setShowMarksModal(false);
      } else {
        toast.error('Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    }
  };


    const submitTwelthMarks = async () => {
    try {
      const response = await axios.post('/api/marks/twelfth-marks', twelfthMarks);
      if (response.data.success) {
        toast.success('Marks saved successfully');
        formData.twelfth_marks_id = twelfthMarks.id;
        setTwelthModal(false);
      } else {
        toast.error('Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    }
  };

  const submitBachelorMarks = async () => {
    try {
      const response = await axios.post('/api/marks/bachelor-marks', bachelorMarks);
      if (response.data.success) {
        toast.success('Marks saved successfully');
        formData.bachelor_marks_id = bachelorMarks.id;
        setBachelorModal(false);
      } else {
        toast.error('Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save marks');
    }
  };
  return (
    <Container className="mt-5">
      <Row className="w-100 justify-content-center mt-5">
        <div className="">
          <div className="auth-container">
            <div className="auth-card register-card">
              <div className="row g-0">
                {/* Left Side - Form */}
                <div className="col-lg-6 order-lg-2 order-1">
                  <div className="auth-form-container">
                    <div className="mobile-logo d-lg-none text-center mb-4">
                      <img
                        src="/images/logo.png"
                        alt="Bring Your Buddy"
                        className="mobile-logo-img"
                      />
                    </div>

                    <h3 className="auth-title">Create Account</h3>
                    <p className="auth-subtitle">
                      Join our community and bring your buddies along!
                    </p>

                    <Form onSubmit={submitHandler}>
                      {step === 1 && (
                        <>
                          <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              type="text"
                              placeholder="Enter your name"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              type="email"
                              placeholder="Enter your email"
                            />
                            {errors.email && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.email}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <InputGroup>
                              <Form.Select
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleChange}
                                style={{ maxWidth: "120px" }}
                              >
                                <option value="">+1</option>
                                {country_code
                                  ? country_code.map((country) => (
                                      <option
                                        key={country?.code_id}
                                        value={country?.country_id}
                                      >
                                        {country?.phone_code}
                                      </option>
                                    ))
                                  : null}
                                {/* Add more as needed */}
                              </Form.Select>

                              <Form.Control
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter your phone number"
                              />
                            </InputGroup>

                            {errors.phone_number && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.phone_number}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                              name="country_id"
                              value={formData.country_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Country</option>
                              {country
                                ? country.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formIdProof">
                            <Form.Label>Passport Document (Scanned PDF only)</Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleFileChange(e, "id_proof")}
                            />
                            {errors.id_proof && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.id_proof}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formProfileImg">
                            <Form.Label>Upload Photo (Image file only)</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "profile_img")}
                            />
                            {errors.profile_img && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.profile_img}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              type="password"
                              placeholder="Enter your password"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Password must be atleast six characters, including
                              at least one uppercase letter, one special
                              character, and one digit.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formConfirmPassword"
                          >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              type="password"
                              placeholder="Confirm your password"
                            />
                          </Form.Group>

                          <Button
                            variant="primary"
                            onClick={nextStep}
                            className="w-100"
                          >
                            Next
                          </Button>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>
                              For which Country you want to apply
                            </Form.Label>
                            <Form.Select
                              name="university_country"
                              value={formData.university_country}
                              onChange={handleChange}
                            >
                              <option value="">Select a Country</option>
                              {countries
                                ? countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formUniversity"
                          >
                            <Form.Label>Select University</Form.Label>
                            <Form.Select
                              name="university_id"
                              value={formData.university_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a university</option>
                              {university
                                ? university.map((university) => (
                                    <option
                                      key={university.id}
                                      value={university.id}
                                    >
                                      {university.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Course Type</Form.Label>
                            <Form.Select
                              name="course_type_id"
                              value={formData.course_type_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Course Type</option>
                              {course_type
                                ? course_type.map((type) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formProgram">
                            <Form.Label>Select Program</Form.Label>
                            <Form.Select
                              name="program_id"
                              value={formData.program_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a program</option>
                              {program
                                ? program.map((program) => (
                                    <option key={program.id} value={program.id}>
                                      {program.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Course Type</Form.Label>
                            <Form.Select
                              name="course_trade_id"
                              value={formData.course_trade_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Course Type</option>
                              {course_trade
                                ? course_trade.map((type) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="me-2"
                          >
                            Back
                          </Button>

                          <Button variant="primary" onClick={nextStep}>
                            Next
                          </Button>
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <Form.Group
                            className="mb-3"
                            controlId="formTenthCertificate"
                          >
                            <Form.Label>
                              10th Certificate (Scanned PDF only)
                            </Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChange(e, "tenth_certificate")
                                }
                                className="me-2"
                              />
                              <Button 
                                variant="outline-primary" 
                                onClick={() => {
                                  setTenthMarks({
                                    id: uuidv4(),
                                    subjects: [{ subject: "", marks: "" }],
                                    grade: "",
                                    percentage: ""
                                  });
                                  setShowMarksModal(true);
                                }}
                              >
                                Insert Marks
                              </Button>
                            </div>
                            {errors.tenth_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.tenth_certificate}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formTwelfthCertificate"
                          >
                            <Form.Label>
                              12th Certificate (Scanned PDF only)
                            </Form.Label>
                            <Form.Control
                              accept="application/pdf"
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, "twelfth_certificate")
                              }
                            />

                                      <Button 
                                variant="outline-primary" 
                                onClick={() => {
                                  setTwelfthMarks({
                                    id: uuidv4(),
                                    subjects: [{ subject: "", marks: "" }],
                                    grade: "",
                                    percentage: ""
                                  });
                                  setTwelthModal(true);
                                }}
                              >
                                Insert +2 Marks
                              </Button>
                            {errors.twelfth_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.twelfth_certificate}
                              </div>
                            )}
                          </Form.Group>

                          {formData.course_type_id == "2" ? (
                            <Form.Group
                              className="mb-3"
                              controlId="formBachelorCertificate"
                            >
                              <Form.Label>
                                Bachelor Certificate (Scanned PDF only)
                              </Form.Label>
                              <Form.Control
                                accept="application/pdf"
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e, "bachelor_certificate")
                                }
                              />
                               <Button 
                                variant="outline-primary" 
                                onClick={() => {
                                  setBachelorMarks({
                                    id: uuidv4(),
                                    marks: "",
                                    grade: "",
                                    percentage: ""
                                  });
                                  setBachelorModal(true);
                                }}
                              >
                                Insert Bachelor Data
                              </Button>
                              {errors.bachelor_certificate && (
                                <div style={{ color: "red", fontSize: "14px" }}>
                                  {errors.bachelor_certificate}
                                </div>
                              )}
                            </Form.Group>
                          ) : (
                            ""
                          )}

                          <Form.Group
                            className="mb-3"
                            controlId="formOtherCertificates"
                          >
                            <Form.Label>
                              Other Certificates (Scanned PDF only)
                            </Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleFileChange(e, "other_certificate")
                              }
                              multiple
                            />
                            {errors.other_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.other_certificate}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formRegisterWithAgent"
                          >
                            <Form.Check
                              type="checkbox"
                              name="register_with_agent"
                              label="Register under an agent"
                              checked={formData.register_with_agent}
                              onChange={handleChange}
                            />
                          </Form.Group>

                          {formData.register_with_agent && (
                            <Form.Group
                              className="mb-3"
                              controlId="formAgentId"
                            >
                              <Form.Label>Agent ID</Form.Label>
                              <Form.Control
                                name="agent_id"
                                value={formData.agent_id}
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter agent ID"
                              />
                            </Form.Group>
                          )}

                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="me-2"
                          >
                            Back
                          </Button>
                          <Button type="submit" variant="primary">
                            Submit
                          </Button>
                        </>
                      )}
                    </Form>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="col-lg-6 d-none d-lg-block order-lg-1 order-2">
                  <div
                    className="auth-image register-image"
                    style={{
                      backgroundImage: "url('./images/reg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="overlay"></div>
                    <div className="auth-image-content">
                      <div className="logo-container">
                        <img
                          src="/images/logo.png"
                          alt="Bring Your Buddy"
                          className="logo-img"
                        ></img>
                      </div>
                      <h2>Join Our Community</h2>
                      <p>
                        Create an account to start bringing your buddies for
                        amazing experiences and adventures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>

      {/* Add Marks Modal */}
      <Modal 
        show={showMarksModal} 
        onHide={() => setShowMarksModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter 10th Class Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Subjects and Marks</h6>
            {tenthMarks.subjects.map((item, index) => (
              <div key={index} className="d-flex mb-2 align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  value={item.subject}
                  onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="number"
                  placeholder="Marks"
                  value={item.marks}
                  onChange={(e) => handleMarksChange(index, "marks", e.target.value)}
                  className="me-2"
                />
                {index > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeSubjectRow(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={addSubjectRow}
              className="mt-2"
            >
              Add Row
            </Button>
          </div>
          
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter grade (e.g. A, B+)"
                  value={tenthMarks.grade}
                  onChange={(e) => handleGradeChange("grade", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Percentage</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter percentage"
                  value={tenthMarks.percentage}
                  onChange={(e) => handleGradeChange("percentage", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMarksModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitMarks}>
            Save Marks
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={twelthModal} 
        onHide={() => setTwelthModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter 12th Class Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Subjects and Marks</h6>
            {twelfthMarks.subjects.map((item, index) => (
              <div key={index} className="d-flex mb-2 align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  value={item.subject}
                  onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="number"
                  placeholder="Marks"
                  value={item.marks}
                  onChange={(e) => handleMarksChange(index, "marks", e.target.value)}
                  className="me-2"
                />
                {index > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeSubjectRow(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={addSubjectRow}
              className="mt-2"
            >
              Add Row
            </Button>
          </div>
          
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter grade (e.g. A, B+)"
                  value={tenthMarks.grade}
                  onChange={(e) => handleGradeChange("grade", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Percentage</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter percentage"
                  value={tenthMarks.percentage}
                  onChange={(e) => handleGradeChange("percentage", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTwelthModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitTwelthMarks}>
            Save Marks
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={bachelorModal} 
        onHide={() => setBachelorModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Bachelor data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Marks</h6>

                <Form.Control
                  type="text"
                  placeholder="Degree Name"
                  value={bachelorMarks.degree}
                  onChange={(e) => handleGradeChange("degree", e.target.value)}
                  className="me-2 mb-2"
                />
           
                <Form.Control
                  type="number"
                  placeholder="Marks"
                  value={bachelorMarks.marks}
                  onChange={(e) => handleGradeChange("marks", e.target.value)}
                  className="me-2"
                />
            
          
          </div>
          
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter grade (e.g. A, B+)"
                  value={bachelorMarks.grade}
                  onChange={(e) => handleGradeChange("grade", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Percentage</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter percentage"
                  value={tenthMarks.percentage}
                  onChange={(e) => handleGradeChange("percentage", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBachelorModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitBachelorMarks}>
            Save Marks
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
