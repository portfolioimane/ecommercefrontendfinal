import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import './PusherSettings.css'; // Assuming you will create this CSS file

const PusherSettings = () => {
    const [settings, setSettings] = useState({
        broadcast_driver: 'pusher', // Default to 'pusher'
        app_id: '',
        app_key: '',
        app_secret: '',
        app_cluster: '',
        is_enabled: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Pusher settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/pusher');
                const formattedSettings = {
                    broadcast_driver: response.data.broadcast_driver || 'pusher', // Use 'pusher' as default if not set
                    app_id: response.data.app_id || '',
                    app_key: response.data.app_key || '',
                    app_secret: response.data.app_secret || '',
                    app_cluster: response.data.app_cluster || '',
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching Pusher settings');
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

    // Handle form submission to update Pusher settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            broadcast_driver: settings.broadcast_driver, // Always set to 'pusher'
            app_id: settings.app_id.trim() === '' ? null : settings.app_id,
            app_key: settings.app_key.trim() === '' ? null : settings.app_key,
            app_secret: settings.app_secret.trim() === '' ? null : settings.app_secret,
            app_cluster: settings.app_cluster.trim() === '' ? null : settings.app_cluster,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/pusher', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('Pusher settings updated successfully!');
        } catch (err) {
            setError('Error updating Pusher settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Pusher Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Pusher
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Broadcast Driver:</label>
                            <input
                                type="text"
                                name="broadcast_driver"
                                value={settings.broadcast_driver} // Always 'pusher'
                                readOnly // Make it read-only since it should always be 'pusher'
                            />
                        </div>
                        <div>
                            <label>Pusher App ID:</label>
                            <input
                                type="text"
                                name="app_id"
                                value={settings.app_id || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Pusher App Key:</label>
                            <input
                                type="text"
                                name="app_key"
                                value={settings.app_key || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Pusher App Secret:</label>
                            <input
                                type="text"
                                name="app_secret"
                                value={settings.app_secret || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Pusher App Cluster:</label>
                            <input
                                type="text"
                                name="app_cluster"
                                value={settings.app_cluster || ''}
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
            <div className="note-container">
                <p>
                    **Note to Owner:** 
                    <br />
                    By enabling Pusher, your order list dashboard will automatically refresh when new orders are placed, allowing you to see them in real-time without needing to manually refresh the page. This feature enhances the user experience and keeps you updated instantly. Initially, Pusher is free to use, but please be aware that costs may apply later as your usage increases. 
                    <br />
                    To obtain your Pusher API keys, follow these steps:
                    <ol>
                        <li>Visit the <a href="https://pusher.com/" target="_blank" rel="noopener noreferrer">Pusher website</a>.</li>
                        <li>Create a free account or log in to your existing account.</li>
                        <li>Once logged in, navigate to the dashboard and create a new app.</li>
                        <li>After creating your app, you will find your <strong>App ID</strong>, <strong>Key</strong>, <strong>Secret</strong>, and <strong>Cluster</strong> in the app settings. Copy these values into the fields above.</li>
                    </ol>
                </p>
            </div>
        </div>
    );
};

export default PusherSettings;
