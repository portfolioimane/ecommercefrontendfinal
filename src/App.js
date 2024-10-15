import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated for v6
import store from './redux/store';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import WishlistPage from './pages/WishlistPage'; // Import your WishlistPage

import ContactPage from './pages/ContactPage';
import UpdateProfile from './pages/UpdateProfile';

import ThankYouPage from './pages/ThankYouPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import Dashboard from './pages/admin/Dashboard';

import ProductList from './pages/admin/Products/ProductList';
import ProductCreate from './pages/admin/Products/ProductCreate';
import ProductEdit from './pages/admin/Products/ProductEdit';

import VariantList from './pages/admin/Variants/VariantList';
import VariantCreate from './pages/admin/Variants/VariantCreate';
import VariantEdit from './pages/admin/Variants/VariantEdit';


import CategoryList from './pages/admin/Categories/CategoryList';
import CategoryEdit from './pages/admin/Categories/CategoryEdit';
import CategoryCreate from './pages/admin/Categories/CategoryCreate';



import OrderList from './pages/admin/Orders/OrderList';
import OrderDetails from './pages/admin/Orders/OrderDetails';
import EditOrder from './pages/admin/Orders/EditOrder';


import CouponList from './pages/admin/Coupons/CouponsList';
import CouponEdit from './pages/admin/Coupons/CouponEdit';
import CouponCreate from './pages/admin/Coupons/CouponCreate';


import ShippingsList from './pages/admin/Shippings/ShippingsList';
import AddShipping from './pages/admin/Shippings/AddShipping';
import ShippingUpdate from './pages/admin/Shippings/ShippingUpdate';

import UpdateHomePageHeader from './pages/admin/Customize/UpdateHomePageHeader';

import CreatePromotion from './pages/admin/Customize/CreatePromotion';
import EditPromotion from './pages/admin/Customize/EditPromotion';
import PromotionList from './pages/admin/Customize/PromotionList'; // Adjust the path as necessary

import UploadLogo from './pages/admin/Customize/UploadLogo';

import StripeSettings from './pages/admin/Settings/StripeSettings';
import PaypalSettings from './pages/admin/Settings/PaypalSettings'; // Create this component similarly
import PusherSettings from './pages/admin/Settings/PusherSettings'; // Create this component similarly
import MailchimpSettings from './pages/admin/Settings/MailchimpSettings'; 
import ContactInfoSettings from './pages/admin/Settings/ContactInfoSettings'; 
import SocialMediaSettings from './pages/admin/Settings/SocialMediaSettings'; 
import GeneralSettings from './pages/admin/Settings/GeneralSettings'; 


import Subscribers from './pages/admin/Subscribers';
import Contacts from './pages/admin/Contacts';


import UserList from './pages/admin/Users/UserList';
import UserCreate from './pages/admin/Users/UserCreate';
import EditUser from './pages/admin/Users/EditUser';

import ReviewList from './pages/admin/Reviews/ReviewList';
import CreateReview from './pages/admin/Reviews/CreateReview';
import PublicLayout from './components/PublicLayout';
import MyOrderLayout from './components/MyOrderLayout';

import AdminRoute from './components/AdminRoute';
import DashboardLayout from './components/admin/DashboardLayout';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
            
            
                    <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/thank-you/order/:id" element={<ThankYouPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} /> {/* Add this route */}

                   <Route  element={<MyOrderLayout />}>
                        <Route path="/orders" element={<OrderPage />} />
                        <Route path="/orders/order-details/:id" element={<OrderDetailsPage />} />
                        <Route path="/orders/profile/update" element={<UpdateProfile /> } />

                    </Route>
                     
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    
              

                <Route element={<AdminRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    
                       
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        
                        <Route path="/admin/products" element={<ProductList />} />
                        <Route path="/admin/product/:id" element={<ProductEdit />} />
                        <Route path="/admin/products/create" element={<ProductCreate />} />
                          
                           <Route path="/admin/variants" element={<VariantList />} />
                        <Route path="/admin/variant/edit/:id" element={<VariantEdit />} />
                        <Route path="/admin/variants/create" element={<VariantCreate />} />


                        <Route path="/admin/categories" element={<CategoryList />} />
                        <Route path="/admin/category/:id" element={<CategoryEdit />} />
                        <Route path="/admin/categories/create" element={<CategoryCreate />} />

                        
                        <Route path="/admin/orders" element={<OrderList />} />
                        <Route path="/admin/orders/:id" element={<OrderDetails />} />
                        <Route path="/admin/orders/edit/:id" element={<EditOrder />} />

                        <Route path="/admin/coupons" element={<CouponList />} />
                        <Route path="/admin/coupons/edit/:id" element={<CouponEdit />} />
                        <Route path="/admin/coupons/create" element={<CouponCreate />} />

                        <Route path="/admin/shipping" element={<ShippingsList />} />
                        <Route path="/admin/shipping/create" element={<AddShipping />} />
                        <Route path="/admin/shipping/update/:id" element={<ShippingUpdate />} />  

                        <Route path="/admin/subscribers" element={<Subscribers />} />
                        <Route path="/admin/contacts" element={<Contacts />} />


                        <Route path="/admin/users" element={<UserList />} />
                        <Route path="/admin/users/create" element={<UserCreate />} />
                        <Route path="/admin/users/edit/:id" element={<EditUser />} />

                        <Route path="/admin/reviews" element={<ReviewList />} />
                        <Route path="/admin/reviews/create" element={<CreateReview />} />

                <Route path="/admin/settings/stripe" element={<StripeSettings />} />
                <Route path="/admin/settings/paypal" element={<PaypalSettings />} />
                <Route path="/admin/settings/pusher" element={<PusherSettings />} />
                <Route path="/admin/settings/mailchimp" element={<MailchimpSettings />} />
                <Route path="/admin/settings/contactinfo" element={<ContactInfoSettings />} />
                <Route path="/admin/settings/socialmedia" element={<SocialMediaSettings />} />
                <Route path="/admin/settings/generalsettings" element={<GeneralSettings />} />



                    <Route path="/admin/homepage-header" element={<UpdateHomePageHeader />} />  
                    <Route path="/admin/logo" element={<UploadLogo />} />

                    <Route path="/admin/promotions" element={<PromotionList />} />
                <Route path="/admin/promotions/create" element={<CreatePromotion />} />
                <Route path="/admin/promotions/edit/:id" element={<EditPromotion />} />

                </Route>
                </Route>
                    </Routes>

                
            </Router>
        </Provider>
    );
};

export default App; 