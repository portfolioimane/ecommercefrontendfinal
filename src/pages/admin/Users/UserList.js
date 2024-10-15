import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers, deleteUser } from '../../../redux/admin/userSlice'; // Adjust the path accordingly
import axios from '../../../axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const users = useSelector((state) => state.users.items);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/users'); // Adjust your API endpoint
                dispatch(setUsers(response.data));
                console.log('admins', response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/users/${id}`); // Adjust your API endpoint
            dispatch(deleteUser(id));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/users/edit/${id}`); // Navigate to edit page with user ID
    };

    return (
        <div>
            <h2>User List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Avatar</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <img 
                                    src={`${process.env.REACT_APP_API_URL}/storage/${user.avatar}`} // Assuming user.avatar contains the avatar URL
                                    alt={`${user.name}'s avatar`} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }} // Add styles for avatar
                                />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.role}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <button onClick={() => handleEdit(user.id)}>Edit</button> {/* Edit button */}
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
