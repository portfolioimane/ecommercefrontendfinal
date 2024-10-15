import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { updateShippingArea } from '../../../redux/shippingSlice';
import './ShippingUpdate.css';

const ShippingUpdate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { areas } = useSelector((state) => state.shippingsadmin);
    
    const [shippingArea, setShippingArea] = useState({
        name: '',
        shipping_cost: '',
        delivery_time: '',
        active: false,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchShippingArea = async () => {
            try {
                const response = await axios.get(`/api/admin/shipping-areas/${id}`);
                setShippingArea(response.data);
            } catch (err) {
                setError('Failed to fetch shipping area details.');
            }
        };

        fetchShippingArea();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShippingArea((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.put(`/api/admin/shipping-areas/${shippingArea.id}`, shippingArea);
            dispatch(updateShippingArea(response.data));
            setSuccess('Shipping area updated successfully!');
            navigate('/admin/shipping');
        } catch (err) {
            setError('Failed to update shipping area.');
        }
    };

    return (
        <div className="container">
            <h2>Update Shipping Area</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="input-field"
                        value={shippingArea.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Shipping Cost</label>
                    <input
                        type="number"
                        name="shipping_cost"
                        className="input-field"
                        value={shippingArea.shipping_cost}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Delivery Time</label>
                    <input
                        type="text"
                        name="delivery_time"
                        className="input-field"
                        value={shippingArea.delivery_time}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label className="label">
                        <input
                            type="checkbox"
                            name="active"
                            checked={shippingArea.active}
                            onChange={handleChange}
                        />
                        Active
                    </label>
                </div>
                <button type="submit" className="button">Update Shipping Area</button>
            </form>
        </div>
    );
};

export default ShippingUpdate;
