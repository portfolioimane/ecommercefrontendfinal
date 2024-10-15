import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { addShippingArea } from '../../../redux/shippingSlice';
import './AddShipping.css'; // Import your CSS file

const AddShipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [shippingCost, setShippingCost] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/shipping-areas', {
                name,
                shipping_cost: shippingCost,
                delivery_time: deliveryTime,
            });

            dispatch(addShippingArea(response.data));
            setName('');
            setShippingCost('');
            setDeliveryTime('');
            navigate('/admin/shipping');
        } catch (error) {
            console.error("Error adding shipping area:", error.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Add Shipping Area</h2>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        className="add-shipping-input" // Apply specific class here
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Shipping Cost:</label>
                    <input 
                        type="number" 
                        className="add-shipping-input" // Apply specific class here
                        value={shippingCost} 
                        onChange={(e) => setShippingCost(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Delivery Time:</label>
                    <input 
                        type="text" 
                        className="add-shipping-input" // Apply specific class here
                        value={deliveryTime} 
                        onChange={(e) => setDeliveryTime(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Add Shipping Area</button>
            </form>
        </div>
    );
};

export default AddShipping;
