import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const StripeSettings = () => {
    const [settings, setSettings] = useState({
        api_key: '',
        api_secret: '',
        webhook_secret: '',
        is_enabled: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Stripe settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/stripe');
                const formattedSettings = {
                    ...response.data,
                    webhook_secret: response.data.webhook_secret || '', // Ensure it's an empty string if not found
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching Stripe settings');
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

    // Handle form submission to update Stripe settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const updatedSettings = {
            api_key: settings.api_key.trim() === '' ? null : settings.api_key,
            api_secret: settings.api_secret.trim() === '' ? null : settings.api_secret,
            webhook_secret: settings.webhook_secret.trim() === '' ? null : settings.webhook_secret,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/stripe', updatedSettings);
            console.log('Response from server:', response.data);
            setSuccessMessage('Stripe settings updated successfully!');
        } catch (err) {
            setError('Error updating Stripe settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Stripe Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Stripe
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Stripe API Key:</label>
                            <input
                                type="text"
                                name="api_key"
                                value={settings.api_key || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Stripe API Secret:</label>
                            <input
                                type="text"
                                name="api_secret"
                                value={settings.api_secret || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Stripe Webhook Secret (Optional):</label>
                            <input
                                type="text"
                                name="webhook_secret"
                                value={settings.webhook_secret || ''}
                                onChange={handleChange}
                                placeholder="Optional"
                            />
                        </div>
                    </>
                )}
                <button type="submit" >Save Settings</button>
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            </form>
        </div>
    );
};

export default StripeSettings;
