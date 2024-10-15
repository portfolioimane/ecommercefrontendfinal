import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../redux/admin/userSlice'; // adjust the path accordingly
import axios from '../../../axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    
    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // Default role
    const [avatar, setAvatar] = useState(null); // State for avatar file

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newUser = new FormData();
        newUser.append('name', name);
        newUser.append('email', email);
        newUser.append('password', password);
        newUser.append('role', role);
        if (avatar) {
            newUser.append('avatar', avatar); // Append the avatar file
        }

        try {
            const response = await axios.post('/api/admin/users', newUser, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Specify that we are sending form data
                },
            }); 
            dispatch(addUser(response.data)); // Dispatch action to add user in the Redux store
            
            // Clear the form fields
            setName('');
            setEmail('');
            setPassword('');
            setRole('customer');
            setAvatar(null); // Reset avatar
            
            // Redirect to the user list page
            navigate('/admin/users'); // Redirect after user is added
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <div>
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label>Avatar:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setAvatar(e.target.files[0])} 
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
