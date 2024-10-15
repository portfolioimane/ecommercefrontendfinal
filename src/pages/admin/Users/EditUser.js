import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../redux/admin/userSlice'; // adjust the path accordingly
import axios from '../../../axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the user ID from the route params
    const users = useSelector((state) => state.users.items); // Fetch users from the store
    const [user, setUser] = useState(null);

    // Initialize form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Optional field, leave empty if not changing
    const [role, setRole] = useState('customer');
    const [avatar, setAvatar] = useState(null);

    // Fetch the user details from the Redux store based on the ID
    useEffect(() => {
        const userToEdit = users.find((user) => user.id === parseInt(id));
        if (userToEdit) {
            setUser(userToEdit);
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
        }
    }, [id, users]);

    // Handle form submission for updating the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = new FormData();
        updatedUser.append('name', name);
        updatedUser.append('email', email);
        updatedUser.append('role', role);
        if (password) {
            updatedUser.append('password', password); // Only append password if it's changed
        }
        if (avatar) {
            updatedUser.append('avatar', avatar); // Append avatar if there's a new file
        }

        try {
            // PUT request to update the user
            const response = await axios.post(`/api/admin/users/${id}?_method=PUT`, updatedUser, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Sending form data
                },
            });

            dispatch(updateUser(response.data)); // Dispatch action to update the user in the store
            navigate('/admin/users'); // Redirect to the user list after successful update
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h2>Edit User</h2>
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
                    <label>Password (leave blank if not changing):</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }} // Add margin bottom for spacing
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label>Avatar (upload a new avatar if needed):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>Update User</button>
            </form>
        </div>
    );
};

export default EditUser;
