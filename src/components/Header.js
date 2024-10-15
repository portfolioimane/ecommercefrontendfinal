import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import CartPage from '../pages/CartPage';
import axios from '../axios';
import { getCartSuccess } from '../redux/cartSlice';
import './Header.css';

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.items || []);
  const guestItems = useSelector((state) => state.cart.guestItems || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();

  const [showCartModal, setShowCartModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logo, setLogo] = useState(null); // State to hold logo URL
  const [brandName, setBrandName] = useState('E-Shop'); // Default brand name


  // Fetch cart items only if the user is logged in
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');
        const items = response.data.items || [];
        dispatch(getCartSuccess(items));
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [dispatch, token]);

  // Fetch logo image
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get('/api/admin/customize/logos'); // Adjust the endpoint if necessary
        setLogo(response.data.image_path ? `${process.env.REACT_APP_API_URL}/storage/${response.data.image_path}` : null); // Construct full URL if using Laravel storage
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    const fetchBrandName = async () => {
            try {
                const response = await axios.get('/api/admin/settings/general'); // Update the endpoint as necessary
                setBrandName(response.data.brand_name || 'E-Shop'); // Fallback to 'E-Shop' if not found
            } catch (error) {
                console.error('Error fetching brand name:', error);
            }
        };

        fetchBrandName();

    fetchLogo();
  }, []);

  // Update cart count and guest cart count whenever cartItems or guestItems change
  useEffect(() => {
    const totalLoggedInCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalLoggedInCount);

    const totalGuestCount = guestItems.reduce((total, item) => total + item.quantity, 0);
    setGuestCartCount(totalGuestCount);
  }, [cartItems, guestItems]);

  // Update wishlist count whenever wishlistItems change
  useEffect(() => {
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleClose = () => {
    setShowCartModal(false);
  };

  const displayCartCount = token ? cartCount : guestCartCount;

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" className="shadow">
        <Navbar.Brand as={Link} to="/">
          {logo ? <img src={logo} alt="Logo" style={{ width:'110px', height: '60px' }} /> :  brandName} {/* Display logo or fallback text */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
            {token && <Nav.Link as={Link} to="/orders">Orders</Nav.Link>}

            {/* Wishlist Icon */}
            {token && (
              <Nav.Link as={Link} to="/wishlist" className="d-flex align-items-center">
                <FaHeart className="red-heart" size={20} />
                {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
              </Nav.Link>
            )}

            {/* Cart Icon */}
            <Nav.Link onClick={handleCartClick} className="d-flex align-items-center">
              <FaShoppingCart size={20} />
              {displayCartCount > 0 && <span className="cart-count">{displayCartCount}</span>}
            </Nav.Link>

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Cart Modal */}
      <Modal 
        show={showCartModal} 
        onHide={handleClose} 
        dialogClassName="cart-modal"
        aria-labelledby="cart-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="cart-modal-title">Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div tabIndex={0} style={{ outline: 'none' }}>
            <CartPage /> {/* No props passed */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Link to="/cart">
            <Button variant="primary" onClick={handleClose}>
              View Full Cart
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
