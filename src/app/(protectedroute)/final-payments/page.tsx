"use client";

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaUpload, FaFileInvoiceDollar } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name?: string;
  email?: string;
  [key: string]: any;
}

const FinalPaymentsPage = () => {
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [user, setUser] = useState<User>({id: 0});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPaymentFile(files[0]);
      setErrorMessage('');
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      setUser(userData);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!paymentFile) {
      setErrorMessage('Please select a payment file to upload');
      return;
    }
    
    if (!paymentType) {
      setErrorMessage('Please select a payment type');
      return;
    }

    if (!user.id) {
      setErrorMessage('User information not available. Please log in again.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Create form data
    const formData = new FormData();
    formData.append('user_id', user.id.toString()); // Convert to string
    formData.append('payment_document', paymentFile);
    formData.append('payment_type', paymentType);
    
    try {
      toast.loading('Uploading payment file...');
      
      const response = await axios.post('/api/payment/university-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.dismiss();
      
      if (response.data && response.data.success) {
        setSuccessMessage('Payment file uploaded successfully!');
        toast.success('Payment file uploaded successfully!');
        
        // Reset form
        setPaymentFile(null);
        setPaymentType('');
        
        // Reset file input by accessing the form
        const fileInput = document.getElementById('payment-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(response.data?.message || 'Failed to upload payment file');
      }
    } catch (error) {
      console.error('Error uploading payment file:', error);
      toast.dismiss();
      toast.error('Failed to upload payment file');
      setErrorMessage('Failed to upload payment file. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0 d-flex align-items-center">
                <FaFileInvoiceDollar className="me-2" /> University Payment Upload
              </h4>
            </Card.Header>
            <Card.Body>
              {errorMessage && (
                <Alert variant="danger" className="mb-4">
                  {errorMessage}
                </Alert>
              )}
              
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Select 
                    value={paymentType} 
                    onChange={(e) => setPaymentType(e.target.value)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select Payment Type</option>
                    <option value="yearly">Yearly Payment</option>
                    <option value="semester">Semester Payment</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Upload Payment File</Form.Label>
                  <div className="custom-file-upload">
                    <Form.Control
                      type="file"
                      id="payment-file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      disabled={isSubmitting}
                      required
                    />
                    <div className="mt-2">
                      {paymentFile ? (
                        <span className="text-success">
                          Selected: {paymentFile.name} ({Math.round(paymentFile.size / 1024)} KB)
                        </span>
                      ) : (
                        <span className="text-muted">
                          No file selected. Please upload a payment receipt or invoice.
                        </span>
                      )}
                    </div>
                  </div>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" /> Upload Payment File
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FinalPaymentsPage;