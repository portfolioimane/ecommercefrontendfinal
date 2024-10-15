import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const PayPalSettings = () => {
    const [settings, setSettings] = useState({
        client_id: '',
        client_secret: '',
        is_enabled: false,
        mode: 'sandbox', // Default mode is sandbox
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch PayPal settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/paypal');
                const formattedSettings = {
                    client_id: response.data.client_id || '',
                    client_secret: response.data.client_secret || '',
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                    mode: response.data.mode || 'sandbox', // Default to sandbox if not set
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching PayPal settings');
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

    // Handle form submission to update PayPal settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            client_id: settings.client_id.trim() === '' ? null : settings.client_id,
            client_secret: settings.client_secret.trim() === '' ? null : settings.client_secret,
            mode: settings.mode,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/paypal', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('PayPal settings updated successfully!');
        } catch (err) {
            setError('Error updating PayPal settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>PayPal Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable PayPal
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>PayPal Client ID:</label>
                            <input
                                type="text"
                                name="client_id"
                                value={settings.client_id || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>PayPal Client Secret:</label>
                            <input
                                type="text"
                                name="client_secret"
                                value={settings.client_secret || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>PayPal Mode:</label>
                            <select
                                name="mode"
                                value={settings.mode || 'sandbox'}
                                onChange={handleChange}
                            >
                                <option value="sandbox">Sandbox</option>
                                <option value="live">Live</option>
                            </select>
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

export default PayPalSettings;
