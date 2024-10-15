import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../axios'; // Adjust the import based on your axios setup

const UpdateProfile = () => {
    const user = useSelector((state) => state.auth.user); // Get user from Redux state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [existingAvatar, setExistingAvatar] = useState(''); // State for existing avatar

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/profile'); // Fetch authenticated user's profile
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    password: '',
                    password_confirmation: '',
                    avatar: null,
                });
                // Set existing avatar URL if available
                if (response.data.avatar) {
                    setExistingAvatar(response.data.avatar); // Assuming the avatar URL is in response.data.avatar
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setMessage('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData({ ...formData, [name]: files[0] }); // Set the avatar file
        } else {
            setFormData({ ...formData, [name]: value }); // Set other fields
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append all form data
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {  // Only append if the value is not null or undefined
                data.append(key, value);
            }
        });

        // Append the PUT method to form data
        data.append('_method', 'PUT');

        try {
            await axios.post('/api/profile', data); // Use POST to send the request
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error);
            setMessage('Failed to update profile.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-profile">
            <h2>Update Profile</h2>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {existingAvatar && (
                    <div style={{ marginBottom: '15px' }}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/storage/${existingAvatar}`} 
                            alt="Current Avatar" 
                            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }} 
                        />
                    </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '50%', padding: '5px', marginTop: '5px' }} // Increased padding for more space
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '50%', padding: '5px', marginTop: '5px' }} // Increased padding for more space
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        style={{ width: '50%', padding: '5px', marginTop: '5px' }} // Increased padding for more space
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        style={{ width: '50%', padding: '5px', marginTop: '5px' }} // Increased padding for more space
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Avatar:</label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ marginTop: '5px' }} // Added margin to file input
                    />
                </div>
                <button type="submit" style={{ padding: '12px 20px', fontSize: '16px' }}>Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
