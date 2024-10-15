import React, { useEffect, useState } from 'react';
import axios from '../../../axios'; // Adjust the path as necessary
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const EditPromotion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        is_active: true,
        expires_at: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({}); // To handle validation errors

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(`/api/admin/promotions/${id}`);
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    image: response.data.image,
                    is_active: response.data.is_active,
                    expires_at: response.data.expires_at ? response.data.expires_at.split('T')[0] : ''
                });

                if (response.data.image) {
                    setImagePreview(`${process.env.REACT_APP_API_URL}/storage/${response.data.image}`);
                }
            } catch (error) {
                console.error('Error fetching promotion:', error);
            }
        };

        fetchPromotion();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));

        if (type === 'file') {
            const file = files[0];
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                // If no file is selected, keep the previous image
                setImagePreview(formData.image ? `${process.env.REACT_APP_API_URL}/storage/${formData.image}` : null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append the original form data
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('is_active', formData.is_active);
        formDataToSend.append('expires_at', formData.expires_at);

        // Append image only if a new file is selected
        if (formData.image instanceof File) {
            formDataToSend.append('image', formData.image);
        }

        // Specify PUT method
        formDataToSend.append('_method', 'PUT');

        try {
            // Use POST to send with the _method field to emulate PUT
            await axios.post(`/api/admin/promotions/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/admin/promotions'); // Redirect after successful update
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors); // Set validation errors
            } else {
                console.error('Error updating promotion:', error);
            }
        }
    };

    return (
        <div className="container">
            <h1>Edit Promotion</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title} // Highlight error
                        required
                    />
                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title[0]}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description} // Highlight error
                        required
                    />
                    {errors.description && <Form.Control.Feedback type="invalid">{errors.description[0]}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleChange}
                        isInvalid={!!errors.image} // Highlight error
                    />
                    {imagePreview && (
                        <div>
                            <p>Image Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Image Preview"
                                style={{ width: '200px', height: 'auto', margin: '10px 0' }}
                            />
                        </div>
                    )}
                    {errors.image && <Form.Control.Feedback type="invalid">{errors.image[0]}</Form.Control.Feedback>}
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

                <Button variant="primary" type="submit">Update Promotion</Button>
            </Form>

            {/* Display general error message */}
            {errors.general && <p className="text-danger">{errors.general}</p>}
        </div>
    );
};

export default EditPromotion;
