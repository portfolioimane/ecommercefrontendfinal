import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { addOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { FaCreditCard, FaPaypal, FaTruck } from 'react-icons/fa';

const CheckoutForm = ({
  totalPrice,
  itemsToDisplay,
  paymentMethod,
  setPaymentMethod,
  loading,
  setLoading,
  userEmail,
  orderData,
  isCouponApplied, // Add this line
  discount, // Add this line
  shippingAreas, // Pass shipping areas to CheckoutForm
  setSelectedShippingArea,
  selectedShippingArea, // Add this prop
  stripePromise,
  paypalClientId,
  settingsStripe,
  settingsPaypal
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 console.log('discount', discount);
  console.log('applied coupon', isCouponApplied);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);



    

    const updatedOrderData = {
      ...orderData,
      name: event.target.name.value,
      phone: event.target.phone.value,
      address: event.target.address.value,
    };

    try {
      if (paymentMethod === 'credit-card') {
        const { data: paymentResponse } = await axios.post('/api/payment', { total_price: totalPrice });

        const result = await stripe.confirmCardPayment(paymentResponse.paymentIntent.client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          console.error(result.error.message);
          setLoading(false);
          return;
        }

        const { data: orderResponse } = await axios.post('/api/orders', {
          ...updatedOrderData,
          payment_method: 'credit card',
          payment_status: 'paid',
          discount: isCouponApplied ? discount : 0, // Save discount
          shipping_area_id: selectedShippingArea ? selectedShippingArea.id : null, // Add this line

        });

        dispatch(addOrder(orderResponse.order));
        dispatch(clearCart());
        localStorage.setItem('recentOrder', JSON.stringify(orderResponse.order));
              localStorage.removeItem('appliedCoupon');
               localStorage.removeItem('selectedShippingArea');
        navigate(`/thank-you/order/${orderResponse.order.id}`);
      } else if (paymentMethod === 'cash-on-delivery') {
        const { data: orderResponse } = await axios.post('/api/orders', {
          ...updatedOrderData,
          payment_method: 'cash on delivery',
          payment_status: 'pending',
          discount: isCouponApplied ? discount : 0, // Save discount
            shipping_area_id: selectedShippingArea ? selectedShippingArea.id : null, // Add this line
        });

        dispatch(addOrder(orderResponse.order));
        dispatch(clearCart());
        localStorage.setItem('recentOrder', JSON.stringify(orderResponse.order));
              localStorage.removeItem('appliedCoupon');
              localStorage.removeItem('selectedShippingArea');

        navigate(`/thank-you/order/${orderResponse.order.id}`);
      }
    } catch (error) {
      console.error('Error processing order:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" maxLength={25} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={userEmail} readOnly />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" required />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" required />
      </div>

      <h4>Payment Method</h4>
      <div className="payment-methods">
        <div className="payment-option">
         {settingsStripe && settingsStripe.is_enabled && ( // Now checks if settingsStripe is defined and is_enabled is true
  <>
    <input
      type="radio"
      id="credit-card"
      name="payment"
      value="credit-card"
      required
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <label htmlFor="credit-card">
      <FaCreditCard className="payment-icon" /> Credit Card
    </label>
    {paymentMethod === 'credit-card' && <CardElement />}
  </>
)}

        </div>
        <div className="payment-option">
                {settingsPaypal && settingsPaypal.is_enabled && ( // Now checks if settingsStripe is defined and is_enabled is true
  <>
          <input
            type="radio"
            id="paypal"
            name="payment"
            value="paypal"
            required
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="paypal">
            <FaPaypal className="payment-icon" /> PayPal
          </label>
          {paymentMethod === 'paypal' && (
            <PayPalButtons
              style={{ layout: 'horizontal' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalPrice,
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const updatedOrderData = {
                  ...orderData,
                  name: document.getElementById('name').value,
                  phone: document.getElementById('phone').value,
                  address: document.getElementById('address').value,
                };
                const { data: orderResponse } = await axios.post('/api/orders', {
                  ...updatedOrderData,
                  payment_status: 'paid',
                  payment_method: 'paypal',
                  discount: isCouponApplied ? discount : 0, // Save discount
                  shipping_area_id: selectedShippingArea ? selectedShippingArea.id : null, // Add this line

                  paypal_details: details,
                });

                dispatch(addOrder(orderResponse.order));
                dispatch(clearCart());
                localStorage.setItem('recentOrder', JSON.stringify(orderResponse.order));
                      localStorage.removeItem('appliedCoupon');
                                     localStorage.removeItem('selectedShippingArea');

                navigate(`/thank-you/order/${orderResponse.order.id}`);
              }}
            />
          )}
            </>
)}
        </div>
        <div className="payment-option">
          <input
            type="radio"
            id="cash-on-delivery"
            name="payment"
            value="cash-on-delivery"
            required
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="cash-on-delivery">
            <FaTruck className="payment-icon" /> Cash on Delivery
          </label>
        </div>
      </div>

      {paymentMethod !== 'paypal' && (
        <button type="submit" className="order-button" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      )}
    </form>
  );
};
export default CheckoutForm;