import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { setOrders } from '../../../redux/orderSlice';
import { Table, Spinner, Alert, Card, Button } from 'react-bootstrap';
import './OrderDetails.css'; // Import custom CSS file for styling

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const order = useSelector(state => 
        state.orders.items.find(order => order.id === parseInt(id))
    );

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`/api/admin/orders/${id}`);
                dispatch(setOrders([response.data]));
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [id, dispatch]);

    // Loading and error handling
    if (!order) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading order details...</p>
            </div>
        );
    }

    // Calculate subtotal, shipping cost, discount, and total price
    const calculateSubtotal = (items) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    };

    const subtotal = calculateSubtotal(order.items);
    const shippingCost = order.shipping_area ? Number(order.shipping_area.shipping_cost).toFixed(2) : '0.00';
    const discount = order.discount ? Number(order.discount).toFixed(2) : '0.00';
    const totalPrice = (Number(subtotal) + Number(shippingCost) - Number(discount)).toFixed(2);

    const handlePrint = () => {
        window.print(); // This opens the print dialog
    };

    return (
        <div className="order-details-container">
            <Card className="order-details-card">
                <Card.Body>
                    <Card.Title>Order Details for Order ID: {order.id}</Card.Title>
                    <Card.Text>
                        <strong>Name:</strong> {order.name} <br />
                        <strong>Email:</strong> {order.email} <br />
                        <strong>Phone:</strong> {order.phone} <br />
                        <strong>Address:</strong> {order.address} <br />
                        <strong>Shipping Area:</strong> {order.shipping_area ? order.shipping_area.name : 'N/A'} <br />
                        <strong>Payment Method:</strong> {order.payment_method} <br />
                        <strong>Status:</strong> {order.status} <br />
                    </Card.Text>
                    <h4>Order Items:</h4>
                    {order.items.length === 0 ? (
                        <Alert variant="warning">No items in this order.</Alert>
                    ) : (
                        <Table striped bordered hover className="order-items-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Variant</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product_variant ? item.product_variant.name : 'No variant available'}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price} MAD</td>
                                        <td>
                                            <img 
                                                src={item.product.image} // Assuming there's an image URL in the product data
                                                alt={item.product.name} 
                                                className="product-image" // Add a CSS class for image styling if needed
                                                style={{ width: '50px', height: '50px' }} // Style the image dimensions
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <h5>Subtotal: {subtotal} MAD</h5>
                    <h5>Shipping Cost: {shippingCost} MAD</h5>
                    <h5>Discount: {discount} MAD</h5>
                    <h5>Total Price: {totalPrice} MAD</h5>
                    {/* Print Button */}
                    <Button variant="success" onClick={handlePrint}>Print Order Details</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default OrderDetails;
