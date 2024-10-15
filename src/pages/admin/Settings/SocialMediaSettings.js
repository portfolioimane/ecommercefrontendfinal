import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const SocialMediaSettings = () => {
    const [settings, setSettings] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        tiktok: '',
        is_enabled: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch social media settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/social-media');
                const formattedSettings = {
                    facebook: response.data.facebook || '',
                    twitter: response.data.twitter || '',
                    instagram: response.data.instagram || '',
                    tiktok: response.data.tiktok || '',
                    is_enabled: response.data.is_enabled === true, // Ensure boolean value
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching social media settings');
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

    // Handle form submission to update social media settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            facebook: settings.facebook.trim() === '' ? null : settings.facebook,
            twitter: settings.twitter.trim() === '' ? null : settings.twitter,
            instagram: settings.instagram.trim() === '' ? null : settings.instagram,
            tiktok: settings.tiktok.trim() === '' ? null : settings.tiktok,
            is_enabled: settings.is_enabled, // Keep as boolean
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/social-media', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('Social media settings updated successfully!');
        } catch (err) {
            setError('Error updating social media settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Social Media Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Social Media Links
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Facebook URL:</label>
                            <input
                                type="text"
                                name="facebook"
                                value={settings.facebook || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Twitter URL:</label>
                            <input
                                type="text"
                                name="twitter"
                                value={settings.twitter || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Instagram URL:</label>
                            <input
                                type="text"
                                name="instagram"
                                value={settings.instagram || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>TikTok URL:</label>
                            <input
                                type="text"
                                name="tiktok"
                                value={settings.tiktok || ''}
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

export default SocialMediaSettings;
