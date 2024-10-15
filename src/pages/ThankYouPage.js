import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../axios'; // Ensure the path is correct
import './ThankYouPage.css';
import { FaCheckCircle } from 'react-icons/fa'; // Optional: Add an icon for success

const ThankYouPage = () => {
    const [recentOrder, setRecentOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get the order ID from the URL parameters

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${id}`); // Adjust the API endpoint as necessary
                setRecentOrder(response.data.order);
                console.log(response.data.order);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Could not fetch order details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    // Calculate subtotal of all items
    const calculateSubtotal = (items) => {
        return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="thank-you-container">
            <div className="thank-you-header">
                <FaCheckCircle className="success-icon" />
                <h2>Thank You for Your Order!</h2>
            </div>
            <p>Your order has been successfully placed.</p>

            {loading ? (
                <p>Loading order details...</p>
            ) : error ? (
                <p>{error}</p>
            ) : recentOrder ? (
                <div className="order-details">
                    <h3>Order Summary</h3>
                    <div className="order-info">
                        <p><strong>Order ID:</strong> #{recentOrder.id}</p>
                        <p><strong>Payment Method:</strong> {recentOrder.payment_method}</p>
                        {recentOrder.shipping_area && (
    <>
        <p><strong>Shipping Area:</strong> {recentOrder.shipping_area.name}</p>
        <p><strong>Shipping Cost:</strong> {Number(recentOrder.shipping_area.shipping_cost).toFixed(2)} MAD</p>
    </>
)}
</div>
                    <h4>Items in Your Order:</h4>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Variant</th>
                                <th>Quantity</th>
                                <th>Price (MAD)</th>
                                <th>Subtotal (MAD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrder.items.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.product ? item.product.name : 'Loading...'}</td>
                                    <td>
                                        {item.product_variant ? (
                                            <div>
                                                <span className="color-circle" style={{ backgroundColor: item.product_variant.color }}></span>
                                                {` size: ${item.product_variant.size}`}
                                            </div>
                                        ) : 'No variant available'}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{Number(item.price).toFixed(2)} MAD</td>
                                    <td>{(Number(item.price) * item.quantity).toFixed(2)} MAD</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Display subtotal, discount, shipping cost, and total price */}
                    <div className="order-summary">
                        <p><strong>Subtotal:</strong> {calculateSubtotal(recentOrder.items)} MAD</p>
                        {recentOrder.discount && (
                            <p><strong>Discount:</strong> {Number(recentOrder.discount).toFixed(2)} MAD</p>
                        )}
{recentOrder.shipping_area && (
            <>
                <p>
                    <strong>Shipping Cost:</strong> {Number(recentOrder.shipping_area.shipping_cost).toFixed(2)} MAD
                </p>
            </>
        )}                        <p><strong>Total Price:</strong> {Number(recentOrder.total_price).toFixed(2)} MAD</p>
                    </div>
                </div>
            ) : (
                <p>No order details available.</p>
            )}

            <Link to="/" className="back-home-button">Back to Home</Link>
        </div>
    );
};

export default ThankYouPage;
