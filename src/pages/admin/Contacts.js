// src/components/Contacts.js

import React, { useState, useEffect } from 'react';
import axios from '../../axios'; // Adjust the path if necessary
import './Contacts.css'; // Create this CSS file for styling

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('/api/contacts'); // Adjust the endpoint if necessary
                setContacts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="contacts-page">
            <h1>Contact Messages</h1>
            <table className="contacts-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th> {/* Optional: if you store the date */}
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{new Date(contact.created_at).toLocaleString()}</td> {/* Format date */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Contacts;
