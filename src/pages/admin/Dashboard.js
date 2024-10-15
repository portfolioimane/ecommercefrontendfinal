import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Bar } from 'react-chartjs-2';
import { Card, Col, Row } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';

// Register necessary components for Chart.js
Chart.register(...registerables);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/admin/dashboard'); // Ensure this route is correctly set
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // Chart data for orders over time (Bar Chart)
    const ordersChartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Orders Over Time',
                data: dashboardData.ordersOverTime || Array(12).fill(0), // Default to 0 for each month if not available
                backgroundColor: 'rgba(44, 62, 80, 0.6)', // Softened color based on #2C3E50
                borderColor: '#2C3E50', // Use the specified color for borders
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            <Row>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-dark">
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalOrders}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-gold">
                        <Card.Body>
                            <Card.Title>Total Products</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalProducts}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-red">
                        <Card.Body>
                            <Card.Title>Total Categories</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalCategories}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-dark">
                        <Card.Body>
                            <Card.Title>Total Subscribers</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalSubscribers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-gold">
                        <Card.Body>
                            <Card.Title>Total Reviews</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalReviews}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center dashboard-card card-red">
                        <Card.Body>
                            <Card.Title>Total Contact Messages</Card.Title>
                            <Card.Text className="dashboard-card-text">{dashboardData.totalContactMessages}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <h2 className="chart-title">Orders Over Time</h2>
                    <div className="chart-container">
                        <Bar data={ordersChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1,
                                        precision: 0,
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Months',
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                    labels: {
                                        color: '#333',
                                    },
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                },
                            },
                        }} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
