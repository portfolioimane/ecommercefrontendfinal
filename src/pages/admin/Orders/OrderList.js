import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../axios';
import { setOrders, addOrder } from '../../../redux/admin/orderSlice';
import { Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import { CSVLink } from 'react-csv'; // Import CSVLink for CSV export
import './OrderList.css'; // Ensure this path is correct

const OrderList = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.items || []); // Ensure it's an array
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [pusherSettings, setPusherSettings] = React.useState(null); // State for Pusher settings

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/admin/orders');
                dispatch(setOrders(response.data)); // Set initial orders in Redux state
                setLoading(false);
            } catch (error) {
                setError('Error fetching orders. Please try again later.');
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        const fetchPusherSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings/pusher'); // Fetch Pusher settings
                setPusherSettings(response.data); // Store settings in state
            } catch (error) {
                console.error('Error fetching Pusher settings:', error);
            }
        };

        fetchOrders();
        fetchPusherSettings();
    }, [dispatch]);

    // Initialize Pusher after Pusher settings are fetched
    React.useEffect(() => {
        if (pusherSettings) {
            const pusher = new Pusher(pusherSettings.app_key, {
                cluster: pusherSettings.app_cluster,
            });

            const channel = pusher.subscribe('orders');

            // Bind the OrderPlaced event
            channel.bind('OrderPlaced', (data) => {
                if (data && data.order) {
                    dispatch(addOrder(data.order)); // Push the new order to the existing list
                } else {
                    console.error('Invalid order data:', data);
                }
            });

            return () => {
                channel.unbind_all();
                channel.unsubscribe();
            };
        }
    }, [dispatch, pusherSettings]); // Dependency on pusherSettings

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`/api/admin/orders/${id}`);
                const updatedOrders = orders.filter(order => order.id !== id);
                dispatch(setOrders(updatedOrders));
            } catch (error) {
                setError('Error deleting order. Please try again later.');
                console.error('Error deleting order:', error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/admin/orders/${id}`, { status: newStatus });
            alert('Order status updated successfully!');
            const response = await axios.get('/api/admin/orders');
            dispatch(setOrders(response.data)); // Refresh orders after update
        } catch (error) {
            setError('Error updating order status. Please try again later.');
            console.error('Error updating order status:', error);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/orders/${id}`); // Navigate to the order details page
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Order List</title></head><body>');
        printWindow.document.write('<h1>Order List</h1>');
        printWindow.document.write(document.querySelector('table').outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!orders.length) return <div>No orders found.</div>;

    // Prepare data for CSV export
    const csvData = orders.map(order => ({
        ID: order.id,
        Name: order.name,
        Email: order.email,
        Phone: order.phone,
        Address: order.address,
        TotalPrice: `${order.total_price} MAD`,
        PaymentMethod: order.payment_method,
        Status: order.status,
    }));

    return (
        <div>
            <h1 className="text-center my-4">Order List</h1>
            <Button variant="success" onClick={handlePrint}>Print</Button>
            <CSVLink 
                data={csvData} 
                filename={`orders_${new Date().toISOString().slice(0, 10)}.csv`} 
                className="btn btn-primary" 
                style={{ marginLeft: '10px' }} // Margin for the button
            >
                Export to CSV
            </CSVLink>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Total Price</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{order.address}</td>
                            <td>{order.total_price} MAD</td>
                            <td>{order.payment_method}</td>
                            <td>
                                <Form.Select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)} 
                                    style={{ width: '150px' }} // Add your desired width
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleViewDetails(order.id)}>View Details</Button>
                                <Button variant="danger" onClick={() => handleDelete(order.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OrderList;
