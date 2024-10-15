import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCoupon } from '../../../redux/admin/couponSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { endOfMonth } from 'date-fns';
import './CouponCreate.css'; // Import your CSS file

const CouponCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState({
        code: '',
        discount: '',
        discount_type: 'fixed',
        expiration_date: new Date(),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prevCoupon) => ({
            ...prevCoupon,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setCoupon((prevCoupon) => ({
            ...prevCoupon,
            expiration_date: date,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedDate = format(coupon.expiration_date, 'yyyy-MM-dd HH:mm:ss');
            const response = await axios.post('/api/admin/coupons', {
                ...coupon,
                expiration_date: formattedDate,
            });
            dispatch(addCoupon(response.data));
            navigate('/admin/coupons');
        } catch (error) {
            console.error('Failed to create coupon:', error);
        }
    };

    const maxDate = endOfMonth(new Date());

    return (
        <div className="coupon-create-container">
            <h1>Create Coupon</h1>
            <form onSubmit={handleSubmit} className="coupon-create-form">
                <div className="form-group">
                    <label htmlFor="code">Code:</label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        value={coupon.code}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discount">Discount:</label>
                    <input
                        type="number"
                        name="discount"
                        id="discount"
                        value={coupon.discount}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discount_type">Discount Type:</label>
                    <select
                        name="discount_type"
                        id="discount_type"
                        value={coupon.discount_type}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="fixed">Fixed</option>
                        <option value="percentage">Percentage</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Expiration Date and Time:</label>
                    <DatePicker
                        selected={coupon.expiration_date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        maxDate={maxDate}
                        required
                        className="form-datepicker"
                    />
                </div>
                <button type="submit" className="btn-create">Create Coupon</button>
            </form>
        </div>
    );
};

export default CouponCreate;
