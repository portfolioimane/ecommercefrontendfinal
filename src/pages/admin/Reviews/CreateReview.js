import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../../../redux/admin/reviewSlice'; // Adjust the import path as needed
import axios from '../../../axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateReview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState('');
    const [status, setStatus] = useState('pending'); // Default status
    const [userId, setUserId] = useState(''); // State for selected user
    const [productId, setProductId] = useState(''); // State for selected product
    const [users, setUsers] = useState([]); // State for users list
    const [products, setProducts] = useState([]); // State for products list

    // Fetch users and products when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/users'); // Adjust the API endpoint as necessary
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Failed to load users.');
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/admin/products'); // Adjust the API endpoint as necessary
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products.');
            }
        };

        fetchUsers();
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            user_id: userId, // Include the selected user ID
            product_id: productId, // Include the selected product ID
            rating,
            review,
            status,
        };

        try {
            const response = await axios.post('/api/admin/reviews', newReview);
            dispatch(addReview(response.data)); // Dispatch the action to add the review to the store
            
            // Optionally reset the form fields
            setRating(1);
            setReview('');
            setStatus('pending');
            setUserId(''); // Reset the user ID
            setProductId(''); // Reset the product ID
            
            // Redirect to the reviews list page
            navigate('/admin/reviews'); // Redirect after review is created
            alert('Review created successfully!');
        } catch (error) {
            console.error('Error creating review:', error.response ? error.response.data : error);
            alert('Failed to create review.'); 
        }
    };

    return (
        <div>
            <h1>Create a New Review</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="user_id">Select User:</label>
                    <select
                        id="user_id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    >
                        <option value="">Select a User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="product_id">Select Product:</label>
                    <select
                        id="product_id"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    >
                        <option value="">Select a Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="rating">Rating (1-5):</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        min="1"
                        max="5"
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="review">Review:</label>
                    <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <button type="submit">Create Review</button>
            </form>
        </div>
    );
};

export default CreateReview;
