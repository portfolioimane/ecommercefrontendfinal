import React, { useEffect, useState } from 'react';
import './ContactPage.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import axios from '../axios'; // Ensure axios is installed and configured

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [contactInfo, setContactInfo] = useState({
        address: '',
        email: '',
        phone: '',
        is_enabled: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get('/api/admin/settings/contact-info'); // Adjust the URL if needed
                setContactInfo(response.data);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };

        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            try {
                // Send POST request to the API endpoint
                await axios.post('/api/contact', formData);
                setSubmitted(true);
                setError('');
            } catch (err) {
                setError('Failed to send message. Please try again later.');
            }
        } else {
            setError('All fields are required!');
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-info">
                <h1 className="contact-title">Contact Us</h1>
                {/* Display fetched contact information */}
                <div className="contact-item">
                    <FaPhoneAlt className="contact-icon" />
                    <p className="contact-text">{contactInfo.phone || 'No phone number provided'}</p>
                </div>
                <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <p className="contact-text">{contactInfo.email || 'No email provided'}</p>
                </div>
                <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <p className="contact-text">{contactInfo.address || 'No address provided'}</p>
                </div>
            </div>
            <div className="contact-form-container">
                <h2>Get in Touch</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="contact-button">Send Message</button>
                    {submitted && <p className="success-message">Thank you for contacting us! We will get back to you soon.</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
