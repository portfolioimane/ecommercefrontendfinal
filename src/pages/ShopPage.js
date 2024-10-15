import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/productSlice';
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/wishlistSlice';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaEye } from 'react-icons/fa';
import './ShopPage.css';

const ShopPage = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/categories'),
                ]);

                dispatch(setProducts(productRes.data));
                setCategories(categoryRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('There was an error fetching data. Please try again later.'); // User feedback
            }
        };

        fetchData();
    }, [dispatch]); // No token dependency here for product and category fetching

    useEffect(() => {
        const fetchWishlist = async () => {
            if (token) {
                try {
                    const wishlistRes = await axios.get('/api/wishlist');
                    dispatch(setWishlist(wishlistRes.data));
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };

        fetchWishlist();
    }, [dispatch, token]); // Fetch wishlist when token changes

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory((prevCategory) => (prevCategory === categoryId ? '' : categoryId));
    };

    const showAllProducts = () => setSelectedCategory('');

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category_id.toString() === selectedCategory)
        : products;

    const handleViewDetails = (productId) => navigate(`/product/${productId}`);

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item.product_id === productId);
    };

    const handleAddToWishlist = async (product) => {
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

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1 className="shop-title">Our Store</h1>
                <p className="shop-subtitle">Explore our exclusive collection</p>
            </div>
            <div className="shop-layout">
                <div className="filter-column">
                    <h2 className="filter-title">Filter by Category</h2>
                    <div className="category-list">
                        <button
                            className={`category-button ${selectedCategory === '' ? 'active' : ''}`}
                            onClick={showAllProducts}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-button ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.id.toString())}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="product-list">
                    {filteredProducts.length > 0 ? (
                        <div className="grid">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-wrapper">
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/storage/${product.image}`}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <div className="product-actions">
                                            {token && (
                                                <button
                                                    className="action-button"
                                                    onClick={() => handleAddToWishlist(product)}
                                                >
                                                    <FaHeart color={isInWishlist(product.id) ? 'red' : 'gray'} />
                                                    {isInWishlist(product.id) ? ' Remove from Wishlist' : ' Add to Wishlist'}
                                                </button>
                                            )}
                                      
                                        </div>
                                    </div>
                                    <h2 className="product-name">{product.name}</h2>
                                    <p className="product-category">
                                        {categories.find((cat) => cat.id === product.category_id)?.name || 'Unknown Category'}
                                    </p>
                                    <p className="product-price">${Number(product.price).toFixed(2)}</p>
                                          <button
                                                className="action-button"
                                                onClick={() => handleViewDetails(product.id)}
                                            >
                                                <FaEye /> Quick View
                                            </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products available in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
