import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import axios from '../../axios';
import { FaChevronDown, FaChevronUp, FaHome, FaBox, FaTags, FaShoppingCart, FaUsers, FaStar, FaCog, FaTruck, FaEnvelope } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState({});
    const [logo, setLogo] = useState(null);
        const [brandName, setBrandName] = useState('E-Shop'); // Default brand name

    const toggleDropdown = (section) => {
        setIsOpen((prevState) => ({ ...prevState, [section]: !prevState[section] }));
    };

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/admin/customize/logos'); 
                setLogo(response.data.image_path ? `${process.env.REACT_APP_API_URL}/storage/${response.data.image_path}` : null);
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

    return (
        <div className="sidebar">
            {logo ? <img src={logo} alt="Logo" style={{ width: '150px', height: '80px' }} /> : brandName}

            <Nav className="flex-column">
                <Nav.Link as={Link} to="/admin/dashboard">
                    <FaHome /> Dashboard
                </Nav.Link>

                <Nav.Link onClick={() => toggleDropdown('categories')}>
                    <FaTags /> Categories {isOpen.categories ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.categories && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/categories">Category List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/categories/create">Add Category</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('products')}>
                    <FaBox /> Products {isOpen.products ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.products && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/products">Product List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/products/create">Add Product</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('variants')}>
                    <FaBox /> Variants {isOpen.variants ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.variants && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/variants">Variant List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/variants/create">Add Variant</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('orders')}>
                    <FaShoppingCart /> Orders {isOpen.orders ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.orders && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/orders">Order List</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('reviews')}>
                    <FaStar /> Reviews {isOpen.reviews ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.reviews && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/reviews">Review List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/reviews/create">Create Review</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('coupons')}>
                    <FaTags /> Coupons {isOpen.coupons ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.coupons && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/coupons">Coupon List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/coupons/create">Create Coupon</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('shipping')}>
                    <FaTruck /> Shipping {isOpen.shipping ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.shipping && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/shipping">Shipping Area List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/shipping/create">Add Shipping Area</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('promotions')}>
                    <FaTags /> Promotions {isOpen.promotions ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.promotions && (
                    <div className="dropdown-submenu">
                        <Nav.Link as={Link} to="/admin/promotions">Promotion List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/promotions/create">Create Promotion</Nav.Link>
                    </div>
                )}

                <Nav.Link onClick={() => toggleDropdown('customize')}>
                    <FaCog /> Customize {isOpen.customize ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.customize && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/homepage-header">Homepage Header</Nav.Link>
                        <Nav.Link as={Link} to="/admin/logo">Upload Logo</Nav.Link>
                    </div>
                )}
                
                {/* New Subscribers List without Dropdown */}
                <Nav.Link as={Link} to="/admin/subscribers">
                    <FaEnvelope /> Subscribers
                </Nav.Link>

                {/* New Contact Messages Section */}
                <Nav.Link as={Link} to="/admin/contacts">
                    <FaEnvelope /> Contact Messages
                </Nav.Link>

                <Nav.Link onClick={() => toggleDropdown('users')}>
                    <FaUsers /> Users {isOpen.users ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.users && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/users">User List</Nav.Link>
                        <Nav.Link as={Link} to="/admin/users/create">Add User</Nav.Link>
                    </div>
                )}

              <Nav.Link onClick={() => toggleDropdown('settings')}>
                    <FaCog /> Settings {isOpen.settings ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {isOpen.settings && (
                    <div className="dropdown">
                        <Nav.Link as={Link} to="/admin/settings/generalsettings">General Settings</Nav.Link>

                        <Nav.Link as={Link} to="/admin/settings/stripe">Stripe Settings</Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings/paypal">PayPal Settings</Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings/pusher">Pusher Settings</Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings/mailchimp">Mailchimp Settings</Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings/contactinfo">Contact Info Settings</Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings/socialmedia">Social Media Settings</Nav.Link>

                    </div>
                )}

                
            </Nav>
        </div>
    );
};

export default Sidebar;
