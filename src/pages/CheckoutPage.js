import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { addOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import './CheckoutPage.css';
import { FaCreditCard, FaPaypal, FaTruck } from 'react-icons/fa';
import CheckoutForm from '../components/CheckoutForm';




const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const guestItems = useSelector((state) => state.cart.guestItems || []);
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const userEmail = useSelector((state) => state.auth.user?.email);

  const itemsToDisplay = isLoggedIn ? cartItems : guestItems;
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

    const [selectedShippingArea, setSelectedShippingArea] = useState(null);
const [shippingCost, setShippingCost] = useState(0);
const [shippingAreas, setShippingAreas] = useState([]);

  const totalPriceBeforeDiscount = itemsToDisplay
    .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
    .toFixed(2);

const totalPriceShipping = (parseFloat(totalPriceBeforeDiscount) + parseFloat(shippingCost)).toFixed(2);
const totalPrice = (totalPriceBeforeDiscount - discount + parseFloat(shippingCost)).toFixed(2);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false); 


 const [stripePromise, setStripePromise] = useState(null); // Stripe object will be set here
  const [settingsStripe, setSettingsStripe] = useState(null); // Stripe object will be set here
    const [settingsPaypal, setSettingsPaypal] = useState(null); // Stripe object will be set here

    const [errorStripe, setErrorStripe] = useState(null);
    const [paypalClientId, setPaypalClientId] = useState('');
    useEffect(() => {
        const fetchStripeApiKey = async () => {
            try {
                const response = await axios.get('/api/admin/settings/stripe');
                 setSettingsStripe(response.data);
                const apiKey = response.data.api_key;
                // Dynamically load the Stripe instance using the API key from the backend
                const stripe = await loadStripe(apiKey);
                setStripePromise(stripe);
            } catch (err) {
                setErrorStripe('Error loading Stripe API Key');
            } finally {
                setLoading(false);
            }
        };

        fetchStripeApiKey();
    }, []);

useEffect(() => {
        const fetchPayPalClientId = async () => {
            try {
                const response = await axios.get('/api/admin/settings/paypal');
                setSettingsPaypal(response.data);

                const clientId = response.data.client_id;
                setPaypalClientId(clientId);
            } catch (err) {
                console.error('Error loading PayPal Client ID:', err);
            }
        };

        fetchPayPalClientId();
    }, []);


useEffect(() => {
  const fetchShippingAreas = async () => {
    try {
      const response = await axios.get('/api/admin/shipping-areas');
      setShippingAreas(response.data);
    } catch (error) {
      console.error('Error fetching shipping areas:', error);
    }
  };

  fetchShippingAreas();
}, []);



  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      const { couponCode, discountAmount } = JSON.parse(savedCoupon);
      setCouponCode(couponCode);
      setDiscount(discountAmount);
      setIsCouponApplied(true);
    }
  const savedShippingArea = localStorage.getItem('selectedShippingArea');
  if (savedShippingArea) {
    const area = JSON.parse(savedShippingArea);
    setSelectedShippingArea(area);
    setShippingCost(area.shipping_cost); // Set shipping cost after refresh
  }
  }, []);

const orderData = {
  email: userEmail,
  total_price: totalPrice,
  items: itemsToDisplay.map((item) => ({
    product_id: item.product_id,
    product_variant_id: item.product_variant_id ? item.product_variant_id : null,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
    ...(item.product_variant && {
      variant_details: {
        color: item.product_variant.color,
        size: item.product_variant.size,
      },
    }),
  })),
};

  console.log('orderData', orderData);
               



const handleApplyCoupon = async () => {
  try {
    const response = await axios.post('/api/coupons/apply', { coupon_code: couponCode });
    const { discount, discount_type } = response.data;

    let discountAmount;
    if (discount_type === 'percentage') {
      discountAmount = (totalPriceBeforeDiscount * (discount / 100)).toFixed(2);
    } else {
      discountAmount = discount;
    }

    setDiscount(discountAmount);
    setIsCouponApplied(true);

    // Save coupon and discount to localStorage
    localStorage.setItem('appliedCoupon', JSON.stringify({
      couponCode,
      discountAmount,
      discount_type,
    }));

    alert('Coupon applied successfully');
  } catch (error) {
    alert(error.response?.data.message || 'An error occurred while applying the coupon');
    setIsCouponApplied(false);
  }
};

  return (
    <Elements stripe={stripePromise}>

        <div className="checkout-container">
          <h2>Checkout</h2>
          <div className="checkout-content">

            <div className="checkout-form">
              <h3>Billing Information</h3>
             {paypalClientId ? (
          <PayPalScriptProvider options={{ 'client-id': `${paypalClientId}` }}>
            <CheckoutForm
              totalPrice={totalPrice}
              itemsToDisplay={itemsToDisplay}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              loading={loading}
              setLoading={setLoading}
              userEmail={userEmail}
              orderData={orderData}
              isCouponApplied={isCouponApplied}
              discount={discount}
              shippingAreas={shippingAreas}
              setSelectedShippingArea={setSelectedShippingArea}
              selectedShippingArea={selectedShippingArea}
              stripePromise={stripePromise}
              paypalClientId={paypalClientId} // Still pass it, if needed
              settingsStripe={settingsStripe}
              settingsPaypal={settingsPaypal}
            />
          </PayPalScriptProvider>
        ) : (
          <CheckoutForm
            totalPrice={totalPrice}
            itemsToDisplay={itemsToDisplay}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loading={loading}
            setLoading={setLoading}
            userEmail={userEmail}
            orderData={orderData}
            isCouponApplied={isCouponApplied}
            discount={discount}
            shippingAreas={shippingAreas}
            setSelectedShippingArea={setSelectedShippingArea}
            selectedShippingArea={selectedShippingArea}
            stripePromise={stripePromise}
            settingsStripe={settingsStripe}
            settingsPaypal={settingsPaypal}
          />
        )}

            </div>

<div className="cart-summary">
  <h3 className="cart-summary-title">Cart Summary</h3>
  <ul className="cart-item-list">
    {itemsToDisplay.map((item) => (
      <li key={item.id} className="cart-item">
        <img
          src={`${process.env.REACT_APP_API_URL}/storage/${item.image}`}
          alt={isLoggedIn ? item.product.name : item.name}
          className="item-image"
        />
        <div className="item-details">
          <p className="item-name">{isLoggedIn ? item.product.name : item.name}</p>
          {item.product_variant && (
            <p className="item-variant">
              <strong>Color:</strong>
              <span
                className="color-circle"
                style={{ backgroundColor: item.product_variant.color }}
                title={item.product_variant.color}
              ></span>
              <strong>Size:</strong> {item.product_variant.size}
            </p>
          )}
          <p className="item-quantity">Quantity: {item.quantity}</p>
          <p className="item-price">{Number(item.price).toFixed(2)} MAD</p>
        </div>
      </li>
    ))}
  </ul>
  <div className="summary-total">
    <span>Total: </span>
    <span>{totalPriceBeforeDiscount} MAD</span>
  </div>
{shippingAreas.length > 0 && (
    <div className="form-group">
  <label htmlFor="shipping-area">Shipping Area</label>
  <select
    id="shipping-area"
    value={selectedShippingArea ? selectedShippingArea.id : ''}
    required
    onChange={(e) => {
      const selectedArea = shippingAreas.find(area => area.id === Number(e.target.value));
      setSelectedShippingArea(selectedArea);
      setShippingCost(selectedArea ? selectedArea.shipping_cost : 0);
      localStorage.setItem('selectedShippingArea', JSON.stringify(selectedArea));

    }}
  >
    <option value="">Select a shipping area</option>
    {shippingAreas.map(area => (
      <option key={area.id} value={area.id}>
        {area.name} - {area.shipping_cost} MAD
      </option>
    ))}
  </select>
</div>
)}
  <div className="summary-final-total">
        <span>Total Price with shipping: </span>
        <span>{totalPriceShipping} MAD</span>
      </div>

  
  {isCouponApplied && (
    <>
      <div className="summary-discount">
        <span>Discount: </span>
        <span>{discount} MAD</span>
      </div>
      <div className="summary-final-total">
        <span>Final Total: </span>
        <span>{totalPrice} MAD</span>
      </div>
    </>
  )}

  <div className="coupon-section">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="Enter coupon code"
      className="coupon-input"
    />
  {isCouponApplied ? (
                <button type="button" className="coupon-button" disabled>
                    Coupon Applied
                </button>
            ) : (
                <button 
                    type="button" 
                    onClick={handleApplyCoupon} 
                    className="coupon-button"
                >
                    Apply Coupon
                </button>
            )}
  </div>
</div>





          </div>
        </div>
    </Elements>
  );
};

export default CheckoutPage;
