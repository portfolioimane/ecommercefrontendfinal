import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, setWishlist } from '../redux/wishlistSlice';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import axios from '../axios'; // Ensure this is correctly configured
import './WishlistPage.css'; // Optional: Create this CSS file for styles

const WishlistPage = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get('/api/wishlist');
                dispatch(setWishlist(response.data));
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchWishlistItems();
    }, [dispatch]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            // Make a DELETE request to remove the item from the database
            await axios.delete(`/api/wishlist/remove/${productId}`);
            // Dispatch the action to remove the item from the Redux state
            dispatch(removeFromWishlist(productId));
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    console.log(wishlistItems);
    
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4" style={{ color: '#DAA520' }}>Your Wishlist</h1>
            {loading ? ( // Render loading state
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <span className="ml-2">Loading...</span>
                </div>
            ) : (
                <Row>
                    {wishlistItems.length === 0 ? (
                        <Col>
                            <h3 className="text-center">Your wishlist is empty.</h3>
                        </Col>
                    ) : (
                        wishlistItems.map((item) => (
                            <Col md={4} key={item.product_id} className="mb-4">
                                <Card className="product-card shadow-sm border-light">
                                    {item.product ? (
                                        <>
                                            <Card.Img
                                                variant="top"
                                                alt={item.product.name}
                                                src={item.product.image ? `${process.env.REACT_APP_API_URL}/storage/${item.product.image}` : ''}
                                                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Title className="text-center" style={{ color: '#DAA520' }}>
                                                    {item.product.name}
                                                </Card.Title>
                                                <Card.Text className="text-center">{item.product.description}</Card.Text>
                                                <div className="d-flex justify-content-center">
                                                    <Button variant="danger" onClick={() => handleRemoveFromWishlist(item.product_id)}>
                                                        Remove from Wishlist <FaHeart color="red" />
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </>
                                    ) : (
                                        <Card.Body>
                                            <h3 className="text-center">Product information is not available.</h3>
                                        </Card.Body>
                                    )}
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}
        </Container>
    );
};

export default WishlistPage;
