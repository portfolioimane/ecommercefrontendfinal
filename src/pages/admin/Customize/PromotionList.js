import React, { useEffect, useState } from 'react';
import axios from '../../../axios'; // Adjust the path as necessary
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const PromotionList = () => {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get('/api/admin/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };

        fetchPromotions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                await axios.delete(`/api/admin/promotions/${id}`);
                setPromotions(promotions.filter(promotion => promotion.id !== id));
            } catch (error) {
                console.error('Error deleting promotion:', error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.patch(`/api/admin/promotions/toggle-status/${id}`);
            setPromotions(
                promotions.map(promotion =>
                    promotion.id === id ? { ...promotion, is_active: response.data.is_active } : promotion
                )
            );
        } catch (error) {
            console.error('Error toggling promotion status:', error);
        }
    };

    return (
        <div className="container">
            <h1>Promotion List</h1>
            <Link to="/admin/promotions/create">
                <Button variant="primary" className="mb-3">Create Promotion</Button>
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map(promotion => (
                        <tr key={promotion.id}>
                            <td>{promotion.title}</td>
                            <td>{promotion.description}</td>
                            <td>
                                {promotion.image ? (
                                    <img src={`${process.env.REACT_APP_API_URL}/storage/${promotion.image}`} alt={promotion.image} style={{ width: '50px', height: '50px' }} />
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{promotion.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Link to={`/admin/promotions/edit/${promotion.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                <Button variant="danger" className="btn-sm ms-2" onClick={() => handleDelete(promotion.id)}>Delete</Button>
                                <Button 
                                    variant={promotion.is_active ? 'secondary' : 'success'} 
                                    className="btn-sm ms-2" 
                                    onClick={() => handleToggleStatus(promotion.id)}
                                >
                                    {promotion.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PromotionList;
