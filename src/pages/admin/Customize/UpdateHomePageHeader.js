import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import './UpdateHomePageHeader.css'; // Import the CSS file

const UpdateHomePageHeader = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await axios.get(`/api/admin/customize/homepage-header`);
                const headerData = response.data;

                setTitle(headerData.title);
                setSubtitle(headerData.subtitle);
                setButtonText(headerData.buttonText);
                setImagePreview(headerData.image); // Set the existing image preview
            } catch (error) {
                console.error('Error fetching header data:', error);
                // Handle error (e.g., show error message)
            }
        };

        fetchHeaderData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('buttonText', buttonText);
        if (image) {
            formData.append('image', image); // Only append image if there's a new one
        }

        // Spoof the PUT method
        formData.append('_method', 'PUT');

        try {
            await axios.post(`/api/admin/customize/homepage-header`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage('Updated successfully!'); // Set the success message
            
            // Hide the message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating homepage header:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div>
            <h2>Update Homepage Header</h2>
            
            {/* Conditionally display the success message */}
            {successMessage && (
                <div className="success-message" style={{ 
                    position: 'fixed', 
                    top: '20px', 
                    right: '20px', 
                    backgroundColor: '#dff0d8', 
                    color: '#3c763d', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    zIndex: 1000 // Ensure it appears above other content
                }}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        className="full-width-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Subtitle:</label>
                    <input
                        className="full-width-input"
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Button Text:</label>
                    <input
                        className="full-width-input"
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        className="full-width-input"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                {imagePreview && (
                    <div>
                        <h3>Image Preview:</h3>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                        />
                    </div>
                )}
                <button type="submit">Update Header</button>
            </form>
        </div>
    );
};

export default UpdateHomePageHeader;
