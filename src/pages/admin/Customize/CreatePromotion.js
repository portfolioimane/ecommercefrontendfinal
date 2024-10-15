import React, { useState } from 'react';
import axios from '../../../axios'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const CreatePromotion = () => {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        is_active: true,
        expires_at: ''
    });
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });

        // If the field is for image, update the image preview
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setImagePreview(URL.createObjectURL(file)); // Create a URL for the image preview
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axios.post('/api/admin/promotions', formDataToSend);
            navigate('/admin/promotions'); // Use navigate instead of history.push
        } catch (error) {
            console.error('Error creating promotion:', error);
        }
    };

    return (
        <div className="container">
            <h1>Create Promotion</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="image" 
                        onChange={handleChange} 
                        required 
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="formIsActive">
                    <Form.Check
                        type="checkbox"
                        label="Active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                </Form.Group>

                <Form.Group controlId="formExpiresAt">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="expires_at" 
                        value={formData.expires_at} 
                        onChange={handleChange} 
                    />
                </Form.Group>

                <Button variant="primary" type="submit">Create Promotion</Button>
            </Form>
        </div>
    );
};

export default CreatePromotion;
