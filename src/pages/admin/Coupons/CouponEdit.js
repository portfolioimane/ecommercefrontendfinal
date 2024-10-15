import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCoupon } from '../../../redux/admin/couponSlice';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../axios'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { format, parseISO, isSameMonth } from 'date-fns';
import './CouponEdit.css'; // Import your CSS file

const CouponEdit = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState({
        code: '',
        discount: '',
        discount_type: 'fixed',
        expiration_date: new Date(),
    });

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const response = await axios.get(`/api/admin/coupons/${id}`);
                const parsedExpirationDate = parseISO(response.data.expiration_date);
                setCoupon({ ...response.data, expiration_date: parsedExpirationDate });
            } catch (error) {
                console.error('Failed to fetch coupon:', error);
            }
        };

        fetchCoupon();
    }, [id]);

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
            const response = await axios.put(`/api/admin/coupons/${id}`, {
                ...coupon,
                expiration_date: formattedDate,
            });
            dispatch(updateCoupon(response.data));
            navigate('/admin/coupons');
        } catch (error) {
            console.error('Failed to update coupon:', error);
        }
    };

    const isSelectableDate = (date) => {
        const currentMonth = new Date();
        return isSameMonth(date, currentMonth);
    };

    return (
        <div className="coupon-edit-container">
            <h1 className="coupon-edit-title">Edit Coupon</h1>
            <form className="coupon-edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="code">Coupon Code:</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={coupon.code}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discount">Discount Amount:</label>
                    <input
                        type="number"
                        id="discount"
                        name="discount"
                        value={coupon.discount}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discount_type">Discount Type:</label>
                    <select
                        id="discount_type"
                        name="discount_type"
                        value={coupon.discount_type}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="fixed">Fixed Amount</option>
                        <option value="percentage">Percentage</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="expiration_date">Expiration Date:</label>
                    <DatePicker
                        selected={coupon.expiration_date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        filterDate={isSelectableDate}
                        required
                        className="form-control date-picker"
                    />
                </div>
                <button type="submit" className="btn-submit">Update Coupon</button>
            </form>
        </div>
    );
};

export default CouponEdit;
