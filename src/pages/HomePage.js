import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProducts } from '../redux/productSlice';
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/wishlistSlice';
import { Container, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCheckCircle, FaShippingFast, FaMoneyBillWave, FaHeart, FaWhatsapp } from 'react-icons/fa';
import axios from '../axios'; 
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const token = useSelector((state) => state.auth.token);
    const [reviews, setReviews] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [promotions, setPromotions] = useState([]); // State for promotions
    const [email, setEmail] = useState(''); // State for email input
    const [subscribeMessage, setSubscribeMessage] = useState(''); // State for subscription feedback

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                dispatch(setProducts(response.data));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/reviews/featured');
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        const fetchHeaderData = async () => {
            try {
                const response = await axios.get('/api/homepage-header');
                setHeaderData(response.data);
            } catch (error) {
                console.error('Error fetching homepage header:', error);
            }
        };

        const fetchPromotions = async () => { // Fetch promotions
            try {
                const response = await axios.get('/api/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };

        fetchProducts();
        fetchReviews();
        fetchHeaderData();
        fetchPromotions(); // Call the new function to fetch promotions

        if (token) {
            const fetchWishlistItems = async () => {
                try {
                    const response = await axios.get('/api/wishlist');
                    dispatch(setWishlist(response.data));
                } catch (error) {
                    console.error('Error fetching wishlist items:', error);
                }
            };

            fetchWishlistItems();
        }
    }, [dispatch, token]);

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item.product_id === productId);
    };

    const handleToggleWishlist = async (product) => {
        if (!token) return;

        try {
            if (isInWishlist(product.id)) {
                await axios.delete(`/api/wishlist/remove/${product.id}`);
                dispatch(removeFromWishlist(product.id));
            } else {
                await axios.post(`/api/wishlist/add/${product.id}`);
                const newItem = { product_id: product.id, ...product };
                dispatch(addToWishlist(newItem));
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/api/mailchimp/subscribe', { email });
        if (response.data.success) {
            setSubscribeMessage('Thank you for subscribing!');
        } else {
            setSubscribeMessage('Subscription failed. Please try again.');
        }
    } catch (error) {
        console.error('Error subscribing to Mailchimp:', error);
        setSubscribeMessage('An error occurred. Please try again.');
    }
};


    return (
        <>
            {/* Homepage Header */}
            {headerData && (
                <div className="header-container text-center">
                    <div
                        className="header-image"
                        style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_URL}/storage/${headerData.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '60vh',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h2 className="header-title">{headerData.title}</h2>
                        <p className="header-subtitle">{headerData.subtitle}</p>
                        <Button variant="primary" className="header-button" onClick={() => navigate('/shop')}>
                            {headerData.buttonText}
                        </Button>
                    </div>
                </div>
            )}









            {/* Services Section */}
            <div className="services mb-5 mt-4 text-center">
                <h4 className="service-title">Our Services</h4>
                <div className="d-flex justify-content-around">
                    <div className="icon-container">
                        <FaCheckCircle className="icon" />
                        <h4>Quality Products</h4>
                        <p>Your satisfaction is our priority.</p>
                    </div>
                    <div className="icon-container">
                        <FaShippingFast className="icon" />
                        <h4>Free Shipping</h4>
                        <p>On all orders over $50.</p>
                    </div>
                    <div className="icon-container">
                        <FaMoneyBillWave className="icon" />
                        <h4>Cash on Delivery</h4>
                        <p>Pay when you receive your order.</p>
                    </div>
                </div>
            </div>

{/* Promotions Section */}
<div className="row">
    {promotions.map((promotion) => (
        <div className="col-md-12 mb-12" key={promotion.id}> {/* Changed from col-md-4 to col-md-6 for 50% width */}
            <div className="promotion-card position-relative">
                <div 
                    className="promotion-image" 
                    style={{
                        backgroundImage: `url(${process.env.REACT_APP_API_URL}/storage/${promotion.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '300px',
                        borderRadius: '8px',
                    }}
                />
                <div className="promotion-content position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
                    <h5 className="promotion-title">{promotion.title}</h5>
                    <p className="promotion-description">{promotion.description}</p>
                    <p className="text-danger promotion-discount">{promotion.discount}</p>
 <Button 
                        className="mt-2 golden-button" 
                        onClick={() => navigate('/shop')} // Navigate to the shop page
                    >
                        Shop Now
                    </Button>                </div>
            </div>
        </div>
    ))}
</div>


            {/* Featured Products Section */}
            <h2 className="text-center mb-4 section-title">Featured Products</h2>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-3 mb-3" key={product.id}>
                        <Card className="product-card shadow-sm border-light position-relative">
                            <Card.Img
                                variant="top"
                                alt={product.name}
                                src={product.image ? `${process.env.REACT_APP_API_URL}/storage/${product.image}` : ''}
                                className="product-image"
                            />
                            {token && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-${product.id}`}>
                                            {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        </Tooltip>
                                    }
                                >
                                    <Button
                                        variant="light"
                                        className="position-absolute top-0 end-0 mt-2 me-2 wishlist-button"
                                        onClick={() => handleToggleWishlist(product)}
                                    >
                                        <FaHeart color={isInWishlist(product.id) ? 'red' : 'black'} />
                                    </Button>
                                </OverlayTrigger>
                            )}
                            <Card.Body>
                                <Card.Title className="text-center product-title">{product.name}</Card.Title>
                                <Card.Text className="text-center">{product.description}</Card.Text>
                                <div className="d-flex justify-content-center">
                                    <Button
                                        className="golden-button"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Customer Testimonials Section */}
  {/* Customer Testimonials Section */}
<h2 className="text-center mb-4 section-title">Customer Testimonials</h2>
<div className="row justify-content-center">
    {reviews.map((review) => (
        <div className="col-md-4 mb-4 d-flex align-items-stretch" key={review.id}>
            <Card className="review-card shadow-sm border-light text-center p-4 testimonial-card">
                <Card.Body>
                 
                    <div className="stars mb-3">
                        <span style={{ color: '#DAA520' }}>{'★'.repeat(review.rating)}</span>
                    </div>
                    <Card.Text className="review-text" style={{ fontStyle: 'italic' }}>"{review.review}"</Card.Text>
                       <div className="avatar-container mb-3">
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/storage/${review.user.avatar}`} 
                            alt={`${review.user.name}'s avatar`} 
                            className="avatar" 
                        />
                    </div>
                    <div className="review-user mt-4">
                        <Card.Title className="user-name">{review.user.name}</Card.Title>
                    </div>
                </Card.Body>
            </Card>
        </div>
    ))}
</div>


{/* Subscribe Section */}
            <div className="subscribe-section text-center mt-5">
                <h2>Subscribe to Our Newsletter</h2>
                <form onSubmit={handleSubscribe} className="d-flex justify-content-center mt-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control me-2"
                        style={{ maxWidth: '400px' }} // Optional styling for the input
                    />
                    <Button type="submit" className="golden-button">Subscribe</Button>
                </form>
                {subscribeMessage && <p className="mt-2">{subscribeMessage}</p>}
            </div>
            

            {/* WhatsApp Chat Icon */}
            <a href="https://wa.me/+212773839598" target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <FaWhatsapp size={60} />
            </a>
        </>
    );
};

export default HomePage;
