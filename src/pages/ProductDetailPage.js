import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, setProducts } from '../redux/productSlice';
import { setReviews } from '../redux/reviewsSlice';
import { addToCart, addToGuestCart } from '../redux/cartSlice';
import axios from '../axios';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Spinner, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // For star rating
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);
    const product = useSelector((state) => state.products.currentProduct);
    const reviews = useSelector((state) => state.reviews.productReviews);
    const isLoggedIn = useSelector((state) => !!state.auth.token);
    
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [variants, setVariants] = useState([]);
    const [combinedVariant, setCombinedVariant] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageReview, setErrorMessageReview] = useState('');
    const [approvalMessage, setApprovalMessage] = useState(''); // State for approval message

    const [newReview, setNewReview] = useState({ rating: 0, review: '' });


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                dispatch(setProducts(response.data));
                console.log("products", response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false); // Stop loading on error
            }
        };

        const fetchProduct = async () => {
            setLoading(true);
            try {
                // Fetch the product details
                const productResponse = await axios.get(`/api/products/${id}`);
                dispatch(fetchProductById(productResponse.data.id));
                console.log("id product", productResponse.data.id);
                setVariants(productResponse.data.variants || []);
            } catch (error) {
                console.error('Error fetching product:', error);
                setErrorMessage('Failed to load product details. Please try again.');
            }
        };

        const fetchReviews = async () => {
            try {
                // Fetch the reviews for the product
                const reviewsResponse = await axios.get(`/api/products/${id}/reviews`);
                dispatch(setReviews(reviewsResponse.data || []));  // Assuming setReviews is your state setter for reviews
                console.log(reviewsResponse.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setErrorMessageReview('Failed to load reviews. Please try again.');
            }
        };

        const fetchData = async () => {
            await fetchProducts(); // Wait for products to load
            await fetchProduct();   // Then fetch the product
            await fetchReviews();   // Finally, fetch reviews
            setLoading(false); // End loading after all fetches are done
        };

        fetchData(); // Call the fetchData function

    }, [dispatch, id]); // Ensure dependencies are correct
console.log("currentproduct", product );

    useEffect(() => {
        const variant = variants.find(
            (variant) => variant.color === selectedColor && variant.size === selectedSize
        );

        setCombinedVariant(variant);

        if (!variant && selectedColor && selectedSize) {
            setErrorMessage('The selected combination is unavailable. Please choose a different size or color.');
        } else {
            setErrorMessage('');
        }
    }, [selectedColor, selectedSize, variants]);

    const handleAddToCart = async () => {
        if (variants.length > 0 && !combinedVariant) {
            setErrorMessage('Please select a valid variant.');
            return;
        }

        const totalPrice = (Number(product.price) || 0) + (combinedVariant ? Number(combinedVariant.price_adjustment) || 0 : 0);

        const item = {
            id: product.id,
            name: product.name,
            price: totalPrice,
            image: combinedVariant?.image_url || product.image,
            quantity,
            product_variant_id: combinedVariant ? combinedVariant.id : null,
            product_variant: combinedVariant ? {
                id: combinedVariant.id,
                color: combinedVariant.color,
                size: combinedVariant.size,
            } : null,
        };

        if (isLoggedIn) {
            try {
                await axios.post(`/api/cart/addtocart/${product.id}`, item);
                dispatch(addToCart(item));
                navigate('/cart');
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        } else {
            dispatch(addToGuestCart(item));
            navigate('/cart');
        }
    };

const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Check if rating is valid and review length is within the limit
    if (newReview.rating <= 0 || newReview.review.trim() === '') {
        setErrorMessageReview('Please provide a valid rating and review.');
        return;
    }

    if (newReview.review.length > 255) {
        setErrorMessageReview('Review must not exceed 255 characters.');
        return;
    }

    try {
        await axios.post('/api/reviews', {
            product_id: product.id,
            ...newReview,
        });

        setNewReview({ rating: 0, review: '' });
        setErrorMessageReview('');
        
        // Fetch reviews again to display the new one
        const response = await axios.get(`/api/products/${product.id}/reviews`);
        dispatch(setReviews(response.data)); // Ensure you have an action to set reviews
        console.log(response.data);

        setApprovalMessage('Your review will be published once approved.'); // Set approval message
    } catch (error) {
        console.error('Error submitting review:', error);
        setErrorMessageReview('Failed to submit review. Please try again.');
    }
};

    console.log('reviews', reviews);

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" />
                <p>Loading...</p>
            </Container>
        );
    }

if (!product && !loading) {
    return (
        <Container className="my-5 text-center">
            <p>Product not found.</p>
        </Container>
    );
}


    const uniqueColors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))];
    const uniqueSizes = [...new Set(variants.map((variant) => variant.size))];

    const displayedPrice =
        (Number(product.price) || 0) + (combinedVariant ? Number(combinedVariant.price_adjustment) || 0 : 0);

    return (
        <Container className="my-5">
            <Row className="product-details-row">
                <Col md={6} className="text-center">
                    <Card>
                        <Card.Img
                            variant="top"
                            src={`${process.env.REACT_APP_API_URL}/storage/${combinedVariant?.image_url || product.image}`}
                            alt={product.name}
                            className="product-image"
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="product-details-card border-0 shadow">
                        <Card.Body>
                            <Card.Title className="product-title">{product.name}</Card.Title>
                            <Card.Text className="product-price text-warning">
                                ${(displayedPrice).toFixed(2)}
                            </Card.Text>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Description:</strong> {product.description}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Category:</strong> <Badge bg="secondary">{product.category.name}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Stock:</strong> {product.stock > 0 ? product.stock : 'Out of Stock'}
                                </ListGroup.Item>
                                
                                {variants.length > 0 && (
                                    <>
                                        <ListGroup.Item>
                                            <strong>Choose Color:</strong>
                                            <div className="color-options">
                                                {uniqueColors.map((color, index) => (
                                                    <div key={index} className="color-option form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="color"
                                                            id={`color-${index}`}
                                                            value={color}
                                                            className="form-check-input visually-hidden"
                                                            onChange={() => setSelectedColor(color)}
                                                        />
                                                        <label
                                                            htmlFor={`color-${index}`}
                                                            className="form-check-label"
                                                            style={{
                                                                display: 'inline-block',
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '50%',
                                                                backgroundColor: color,
                                                                border:
                                                                    selectedColor === color
                                                                        ? '2px solid #000'
                                                                        : '2px solid transparent',
                                                                cursor: 'pointer',
                                                                margin: '0 5px',
                                                            }}
                                                        ></label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Choose Size:</strong>
                                            <div className="size-options">
                                                {uniqueSizes.map((size, index) => (
                                                    <div key={index} className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="size"
                                                            id={`size-${index}`}
                                                            value={size}
                                                            className="form-check-input"
                                                            onChange={() => setSelectedSize(size)}
                                                        />
                                                        <label htmlFor={`size-${index}`} className="form-check-label">
                                                            {size}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ListGroup.Item>
                                    </>
                                )}
                            </ListGroup>

                            {errorMessage && (
                                <p
                                    className="text-warning mt-3"
                                    style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}
                                >
                                    <strong>{errorMessage}</strong>
                                </p>
                            )}

                            <div className="d-flex align-items-center mt-3">
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                                    className="quantity-input me-2"
                                />
                                <Button
                                    variant="warning"
                                    className="flex-grow-1"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="reviews-section mt-5">
                <h3>Customer Reviews</h3>
                {errorMessageReview && <p className="text-danger">{errorMessageReview}</p>}

                 {approvalMessage && (
                        <p className="text-info">{approvalMessage}</p> // Display approval message
                    )}
               
               {reviews.length > 0 ? (
    <ListGroup>

        {reviews.map((review) => (
            <ListGroup.Item key={review.id} className="review-item">
                <p>{review.user.name}</p>
                <div className="review-rating">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            className={index < review.rating ? 'text-warning' : 'text-muted'}
                        />
                    ))}
                </div>
                <p className="review-text">{review.review}</p>
            </ListGroup.Item>
        ))}
    </ListGroup>
) : (
    <p>No reviews yet.</p>
)}

                {isLoggedIn && (
                    <Form className="mt-4" onSubmit={handleSubmitReview}>
                        <Form.Group controlId="reviewRating">
                            <Form.Label>Your Rating</Form.Label>
                            <div className="d-flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${newReview.rating >= star ? 'filled' : ''}`}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="reviewText">
                            <Form.Label>Your Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReview.review}
                                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                                required
                            />
                        </Form.Group>
                        {errorMessageReview && <p className="text-danger">{errorMessageReview}</p>}
                        <Button variant="warning" type="submit">
                            Submit Review
                        </Button>
                    </Form>
                )}
            </div>
        </Container>
    );
};

export default ProductDetails;
