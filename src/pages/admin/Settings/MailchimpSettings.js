import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const MailchimpSettings = () => {
    const [settings, setSettings] = useState({
        api_key: '',
        list_id: '',
        is_enabled: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Mailchimp settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/mailchimp');
                const formattedSettings = {
                    api_key: response.data.api_key || '',
                    list_id: response.data.list_id || '',
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching Mailchimp settings');
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

    // Handle form submission to update Mailchimp settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            api_key: settings.api_key.trim() === '' ? null : settings.api_key,
            list_id: settings.list_id.trim() === '' ? null : settings.list_id,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/mailchimp', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('Mailchimp settings updated successfully!');
        } catch (err) {
            setError('Error updating Mailchimp settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Mailchimp Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Mailchimp
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Mailchimp API Key:</label>
                            <input
                                type="text"
                                name="api_key"
                                value={settings.api_key || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Mailchimp List ID:</label>
                            <input
                                type="text"
                                name="list_id"
                                value={settings.list_id || ''}
                                onChange={handleChange}
                                required
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

export default MailchimpSettings;
