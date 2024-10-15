import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios'; // Ensure this path is correct
import './OrderDetailsPage.css'; // Create this CSS file for styling
import { FaCheckCircle } from 'react-icons/fa'; // Optional: Add an icon for success

const OrderDetailsPage = () => {
  const { id } = useParams(); // Get the order ID from the route parameters
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrderDetails(response.data.order);
        console.log(response.data.order);
      } catch (err) {
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  const subtotal = calculateSubtotal(orderDetails.items);
  const shippingCost = orderDetails.shipping_area ? Number(orderDetails.shipping_area.shipping_cost).toFixed(2) : 'N/A';
  const discount = orderDetails.discount ? Number(orderDetails.discount).toFixed(2) : '0.00';
  const totalPrice = (Number(subtotal) - (orderDetails.discount || 0) + Number(shippingCost)).toFixed(2);

  return (
    <div className="order-details-page">
      <h2>Order Details</h2>
      <div className="order-info">
        <h3>Order ID: {orderDetails.id}</h3>
        <p>Name: {orderDetails.name}</p>
        <p>Email: {orderDetails.email}</p>
        <p>Phone: {orderDetails.phone}</p>
        <p>Address: {orderDetails.address}</p>
        <p>Shipping Area: {orderDetails.shipping_area ? orderDetails.shipping_area.name : 'N/A'}</p>
        <p>Payment Method: {orderDetails.payment_method}</p>
        <p>Status: {orderDetails.status}</p>
      </div>

      <h3>Order Items</h3>
      <table className="order-items-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Variant</th>
            <th>Quantity</th>
            <th>Price (MAD)</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.items.map(item => (
            <tr key={item.product_id}>
              <td>{item.product.name}</td>
              <td>
                {item.product_variant ? (
                  <div>
                    <span className="color-circle" style={{ backgroundColor: item.product_variant.color }}></span>
                    size: {` ${item.product_variant.size}`}
                  </div>
                ) : (
                  'No variant available'
                )}
              </td>
              <td>{item.quantity}</td>
              <td>{Number(item.price).toFixed(2)}</td>
              <td>
                {item.image ? (
                  <img src={item.image} alt={`Product ${item.product.name}`} width="50" />
                ) : (
                  'No image available'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display subtotal, discount, shipping cost, and total price */}
      <div className="order-summary">
        <p><strong>Subtotal:</strong> {subtotal} MAD</p>
        <p><strong>Shipping Cost:</strong> {shippingCost} MAD</p>
        <p><strong>Discount:</strong> {discount} MAD</p>

        <p><strong>Total Price:</strong> {totalPrice} MAD</p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
