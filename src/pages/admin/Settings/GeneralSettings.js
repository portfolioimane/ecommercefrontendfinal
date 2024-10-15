import React, { useEffect, useState } from 'react';
import axios from '../../../axios';

const GeneralSettings = () => {
    const [settings, setSettings] = useState({
        brand_name: '',        // Added brand_name state
        description: '',       // Added description state
        maintenance_mode: false,
        is_enabled: false,
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch general settings when the component loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/general');
                const formattedSettings = {
                    brand_name: response.data.brand_name || '',
                    description: response.data.description || '',
                    maintenance_mode: response.data.maintenance_mode || false, // Ensure boolean value
                    is_enabled: response.data.is_enabled || false,
                };
                setSettings(formattedSettings);
                console.log('Fetched settings:', formattedSettings);
            } catch (err) {
                setError('Error fetching general settings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: checked, // Update state based on checkbox name
        }));
    };

    // Handle form submission to update general settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Prepare the settings to submit
        const updatedSettings = {
            brand_name: settings.brand_name.trim() === '' ? null : settings.brand_name,
            description: settings.description.trim() === '' ? null : settings.description,
            maintenance_mode: settings.maintenance_mode, // Keep as boolean
            is_enabled: settings.is_enabled,
        };

        // Log updated settings to verify before submission
        console.log('Submitting settings:', updatedSettings);

        try {
            const response = await axios.post('/api/admin/settings/general', updatedSettings);
            console.log('Response from server:', response.data); // Log server response
            setSuccessMessage('General settings updated successfully!');
        } catch (err) {
            setError('Error updating general settings');
            console.error('Error updating settings:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>General Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_enabled"
                            checked={settings.is_enabled}
                            onChange={handleCheckboxChange}
                        />
                        Enable Feature
                    </label>
                </div>
                {settings.is_enabled && (
                    <>
                        <div>
                            <label>Brand Name:</label>
                            <input
                                type="text"
                                name="brand_name"
                                value={settings.brand_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={settings.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="maintenance_mode"
                                    checked={settings.maintenance_mode}
                                    onChange={handleCheckboxChange}
                                />
                                Maintenance Mode
                            </label>
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

export default GeneralSettings;
