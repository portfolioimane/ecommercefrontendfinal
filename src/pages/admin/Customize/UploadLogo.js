import React, { useState, useEffect } from 'react';
import axios from '../../../axios';

const UploadLogo = () => {
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch the existing logo on component mount
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/admin/customize/logos');
                if (response.data && response.data.image_path) {
                    setLogoPreview(`${process.env.REACT_APP_API_URL}/storage/${response.data.image_path}`);
                }
            } catch (error) {
                console.error('Error fetching logo:', error);
                setErrorMessage('Error fetching logo. Please try again later.');
            }
        };

        fetchLogo();
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setLogo(null);
            setLogoPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('logo', logo);

        try {
            await axios.post('/api/admin/customize/logos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage('Logo updated successfully!');
            // Optionally reset the form
            setLogo(null);
            setLogoPreview(null);
        } catch (error) {
            console.error('Error uploading logo:', error);
            setErrorMessage('Error uploading logo. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload Logo</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Logo:</label>
                    <input type="file" onChange={handleLogoChange} accept="image/*" required />
                </div>
                {logoPreview && (
                    <div>
                        <h3>Logo Preview:</h3>
                        <img src={logoPreview} alt="Logo Preview" style={{ width: '200px', height: 'auto' }} />
                    </div>
                )}
                <button type="submit">Update Logo</button>
            </form>
        </div>
    );
};

export default UploadLogo;
