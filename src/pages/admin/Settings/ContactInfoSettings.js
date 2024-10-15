import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const ContactInfoSettings = () => {
    const [settings, setSettings] = useState({
        address: '',
        phone: '',
        email: '',
        is_enabled: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Contact Info settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/contact-info');
                const formattedSettings = {
                    address: response.data.address || '',
                    phone: response.data.phone || '',
                    email: response.data.email || '',
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching contact info settings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = () => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            is_enabled: !prevSettings.is_enabled, // Toggle the is_enabled state
        }));
    };

    // Handle form submission to update contact info settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            address: settings.address.trim() === '' ? null : settings.address,
            phone: settings.phone.trim() === '' ? null : settings.phone,
            email: settings.email.trim() === '' ? null : settings.email,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/contact-info', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('Contact information settings updated successfully!');
        } catch (err) {
            setError('Error updating contact info settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Contact Information Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Contact Information
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={settings.address || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={settings.phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={settings.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                <button type="submit">Save Settings</button>
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
};

export default ContactInfoSettings;
