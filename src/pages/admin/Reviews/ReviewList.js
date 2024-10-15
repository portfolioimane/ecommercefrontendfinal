import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews, deleteReview, updateReview } from '../../../redux/admin/reviewSlice'; // Adjust the path as needed
import axios from '../../../axios';
import './ReviewList.css';

const ReviewList = () => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviewsadmin.items);
    const [status, setStatus] = useState({});
    const [featuredStatus, setFeaturedStatus] = useState({});
    const [showFullReview, setShowFullReview] = useState({}); // Track expanded reviews

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/admin/reviews');
                dispatch(setReviews(response.data));
                const initialStatus = {};
                const initialFeaturedStatus = {};
                response.data.forEach(review => {
                    initialStatus[review.id] = review.status;
                    initialFeaturedStatus[review.id] = review.is_featured;
                });
                setStatus(initialStatus);
                setFeaturedStatus(initialFeaturedStatus);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/reviews/${id}`);
            dispatch(deleteReview(id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.put(`/api/admin/reviews/${id}`, { status: newStatus });
            dispatch(updateReview({ id, data: response.data }));
            setStatus((prev) => ({ ...prev, [id]: newStatus }));
        } catch (error) {
            console.error('Error updating review status:', error);
        }
    };

    const handleFeatureToggle = async (id) => {
        const newFeaturedStatus = !featuredStatus[id];
        try {
            const response = await axios.put(`/api/admin/reviews/${id}/feature`, { is_featured: newFeaturedStatus });
            dispatch(updateReview({ id, data: response.data }));
            setFeaturedStatus((prev) => ({ ...prev, [id]: newFeaturedStatus }));
        } catch (error) {
            console.error('Error toggling review featured status:', error);
        }
    };

    const truncateReview = (review, id) => {
        if (showFullReview[id]) return review; // Show full review if toggled
        const maxLength = 100; // Set your desired truncation length
        return review.length > maxLength ? review.slice(0, maxLength) + '...' : review;
    };

    const toggleReviewVisibility = (id) => {
        setShowFullReview((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="review-list-container">
            <h1>Review List</h1>
            <table className="review-table">
                <thead>
                    <tr>
                        <th>Review</th>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Product</th> {/* New Product Column */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td className="review-cell">
                                {truncateReview(review.review, review.id)}
                                {review.review.length > 100 && (
                                    <span 
                                        className="toggle-link" 
                                        onClick={() => toggleReviewVisibility(review.id)}
                                    >
                                        {showFullReview[review.id] ? 'Show Less' : 'Show More'}
                                    </span>
                                )}
                            </td>
                            <td>{review.user ? review.user.name : 'Loading...'}</td>
                            <td>{review.rating}</td>
                            <td>
                                <select
                                    value={status[review.id]}
                                    onChange={(e) => handleStatusChange(review.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </td>
                            <td>{review.product ? review.product.name : 'N/A'}</td> {/* Display Product Name */}
                            <td>
                                <button 
                                    className="feature-button" 
                                    onClick={() => handleFeatureToggle(review.id)}
                                >
                                    {featuredStatus[review.id] ? 'Unfeature' : 'Make Featured'}
                                </button>
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(review.id)}
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

export default ReviewList;
