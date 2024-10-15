import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCoupons, removeCoupon } from '../../../redux/admin/couponSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import './CouponsList.css'; // Import the CSS file for styles

const CouponsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const coupons = useSelector((state) => state.couponsadmin.coupons);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('/api/admin/coupons');
                dispatch(setCoupons(response.data));
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            }
        };

        fetchCoupons();
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/coupons/${id}`);
            dispatch(removeCoupon(id));
        } catch (error) {
            console.error('Failed to delete coupon:', error);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return date.toLocaleString(undefined, options);
    };

    return (
        <div className="coupons-container">
            <h1>Coupon List</h1>
            <table className="coupons-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Type</th>
                        <th>Expiration Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((coupon) => (
                        <tr key={coupon.id}>
                            <td>{coupon.code}</td>
                            <td>{coupon.discount}</td>
                            <td>{coupon.discount_type}</td>
                            <td>{formatDateTime(coupon.expiration_date)}</td>
                            <td>
                                <button 
                                    className="btn btn-edit" 
                                    onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)}>Edit
                                </button>
                                <button 
                                    className="btn btn-delete" 
                                    onClick={() => handleDelete(coupon.id)}>Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CouponsList;
