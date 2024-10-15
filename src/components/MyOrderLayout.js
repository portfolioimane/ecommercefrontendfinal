import React from 'react';
import { Outlet } from 'react-router-dom';
import './MyOrderLayout.css'; // Create this CSS file for styling

const OrderLayout = () => {
  return (
    <div className="order-layout">
      <div className="sidebarcustomer">
        <h2>Account</h2>
        <ul>
          <li>
            <a href="/orders">My Orders</a>
          </li>
     
          <li>
            <a href="/orders/profile/update">Profile</a>
          </li>
        </ul>
      </div>
      <div className="content">
        <Outlet /> {/* This will render the child components */}
      </div>
    </div>
  );
};

export default OrderLayout;
