import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { 
    fetchShippingAreasStart, 
    fetchShippingAreasSuccess, 
    fetchShippingAreasFailure,
    deleteShippingArea,
    changeStatus 
} from '../../../redux/shippingSlice';
import './ShippingsList.css';

const ShippingList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { areas, loading, error } = useSelector((state) => state.shippingsadmin);

    useEffect(() => {
        const fetchShippingAreas = async () => {
            dispatch(fetchShippingAreasStart());
            try {
                const response = await axios.get('/api/admin/shipping-areas');
                dispatch(fetchShippingAreasSuccess(response.data));
            } catch (err) {
                dispatch(fetchShippingAreasFailure(err.message));
            }
        };

        fetchShippingAreas();
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shipping area?')) {
            await axios.delete(`/api/admin/shipping-areas/${id}`);
            dispatch(deleteShippingArea(id));
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const updatedStatus = !currentStatus;
        await axios.put(`/api/admin/shipping-areas/${id}/status`, { active: updatedStatus });
        dispatch(changeStatus({ id, active: updatedStatus }));
    };

    if (loading) return <p>Loading shipping areas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="heading">Shipping Areas</h2>
            <table className="shipping-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Shipping Cost</th>
                        <th>Delivery Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map((area) => (
                        <tr key={area.id}>
                            <td>{area.id}</td>
                            <td>{area.name}</td>
                            <td>${area.shipping_cost}</td>
                            <td>{area.delivery_time || 'N/A'}</td>
                            <td>{area.active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button 
                                    className={`status-button ${area.active ? 'deactivate' : 'activate'}`}
                                    onClick={() => toggleStatus(area.id, area.active)}
                                >
                                    {area.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                    className="edit-button" 
                                    onClick={() => navigate(`/admin/shipping/update/${area.id}`)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(area.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShippingList;
