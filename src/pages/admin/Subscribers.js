import React, { useState, useEffect } from 'react';
import axios from '../../axios'; // Assuming axios is already configured
import './Subscribers.css'; // Importing the stylesheet

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the subscribers from the API
    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const response = await axios.get('/api/admin/subscribers'); // Adjust the API endpoint accordingly
                setSubscribers(response.data); // Assuming response.data is the array of subscribers
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch subscribers');
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="subscribers-page">
            <h1>Subscribers List</h1>
            {subscribers.length > 0 ? (
                <table className="subscribers-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.id}>
                                <td>{subscriber.id}</td>
                                <td>{subscriber.email}</td>
                                <td>{new Date(subscriber.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No subscribers found.</p>
            )}
        </div>
    );
};

export default Subscribers;
