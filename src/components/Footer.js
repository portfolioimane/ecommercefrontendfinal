import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from '../axios'; // Assuming axios is already set up
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'; // Importing icons from react-icons

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '',
    email: '',
    phone: '',
    is_enabled: false,
  });
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    tiktok: '',
  });
  const [generalSettings, setGeneralSettings] = useState({
    brand_name: 'E-Shop', // Default brand name
    description: 'Your trusted online shop', // Default description
  });
   const [logo, setLogo] = useState(null); // State to hold logo URL


  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/admin/settings/contact-info'); // Adjust the URL if needed
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    const fetchGeneralSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings/general'); // Update the endpoint as necessary
        setGeneralSettings(response.data);
      } catch (error) {
        console.error('Error fetching general settings:', error);
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await axios.get('/api/admin/customize/logos'); // Adjust the endpoint if necessary
        setLogo(response.data.image_path ? `${process.env.REACT_APP_API_URL}/storage/${response.data.image_path}` : null); // Construct full URL if using Laravel storage
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    const fetchSocialMediaLinks = async () => {
      try {
        const response = await axios.get('/api/admin/settings/social-media'); // Adjust the URL if needed
        setSocialMediaLinks(response.data);
      } catch (error) {
        console.error('Error fetching social media links:', error);
      }
    };
    
    fetchLogo();
    fetchGeneralSettings();
    fetchContactInfo();
    fetchSocialMediaLinks();
  }, []);

  // Check if the contact info is enabled before displaying it
  if (!contactInfo.is_enabled) {
    return null; // If not enabled, don't render the footer
  }

  return (
    <footer>
      {/* Main Footer Section */}
      <div className="bg-dark text-white py-4">
        <Container>
          <Row>
            {/* Brand Name and Description Column */}
            <Col md={4}>
            {logo ? <img src={logo} alt="Logo" 
            style={{ width:'110px', height: '60px' }} /> : 
            generalSettings.brand_name} 

           
              <p>{generalSettings.description || 'Your trusted online shop'}</p>
            </Col>

            {/* Contact Info Column */}
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>{contactInfo.address || 'No address provided'}</p>
              <p>Email: {contactInfo.email || 'No email provided'}</p>
              <p>Phone: {contactInfo.phone || 'No phone number provided'}</p>
            </Col>

            {/* Social Media Column */}
            <Col md={4} className="text-center"> {/* Centering the content in this column */}
              <h5>Follow Us</h5>
              <div className="d-flex justify-content-center"> {/* Center the icons */}
                {socialMediaLinks.facebook && (
                  <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="me-3">
                    <FaFacebook size={24} color="white" />
                  </a>
                )}
                {socialMediaLinks.twitter && (
                  <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="me-3">
                    <FaTwitter size={24} color="white" />
                  </a>
                )}
                {socialMediaLinks.instagram && (
                  <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="me-3">
                    <FaInstagram size={24} color="white" />
                  </a>
                )}
                {socialMediaLinks.tiktok && (
                  <a href={socialMediaLinks.tiktok} target="_blank" rel="noopener noreferrer" className="me-3">
                    <FaTiktok size={24} color="white" />
                  </a>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Copyright Section */}
      <div style={{ backgroundColor: '#34495E', color: '#ccc' }}> {/* Lighter background for copyright section */}
        <Container>
          <Row>
            <Col className="text-center">
              <p className="mb-0">&copy; {new Date().getFullYear()} EmawebSolutions. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
