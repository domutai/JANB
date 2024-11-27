import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CreateNewSpot.css';

function CreateNewSpot() {
  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    description: '',
    title: '',
    price: '',
    previewImage: '',
    images: ['', '', '', ''],
  });
  const [errors, setErrors] = useState({});
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  if (!sessionUser) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map frontend form field names to backend field names
    const backendData = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      lat: formData.latitude,  // Map 'latitude' to 'lat'
      lng: formData.longitude, // Map 'longitude' to 'lng'
      name: formData.title,    // Map 'title' to 'name'
      description: formData.description,
      price: formData.price,
    };

    // Get the CSRF token from the document (assuming it's stored in a meta tag)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Check if the CSRF token exists
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    // Send the mapped data to the backend with CSRF token in headers
    const response = await fetch('/api/spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,  // Include CSRF token in the headers
      },
      body: JSON.stringify(backendData),
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (response.ok) {
      const newSpot = await response.json();
      navigate(`/spots/${newSpot.id}`);
    } else {
      const data = await response.json();
      if (data.errors) {
        const backendErrors = {};
        // Map backend validation errors to frontend state format
        data.errors.forEach((error) => {
          backendErrors[error.param] = error.msg;
        });
        setErrors(backendErrors);
      }
    }
  };

  return (
    <div className="create-spot-container">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <section>
          <h2>Where&#39;s your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <label>
            Country
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </label>
          {errors.country && <p className="error">{errors.country}</p>}

          <label>
            Street Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </label>
          {errors.address && <p className="error">{errors.address}</p>}

          <div className="inline-fields">
            <label>
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </label>
            <label>
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="STATE"
              />
            </label>
          </div>

          <div className="inline-fields">
            <label>
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like fast WiFi or parking, and what you
            love about the neighborhood.
          </p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests&#39; attention with a spot title that highlights what makes your place special.
          </p>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Name of your spot"
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher in search results.
          </p>
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
            />
          </div>
          {errors.price && <p className="error">{errors.price}</p>}
        </section>

        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Preview Image URL"
          />
          {errors.previewImage && <p className="error">{errors.previewImage}</p>}

          {formData.images.map((image, index) => (
            <input
              key={index}
              type="text"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder={`Image URL`}
            />
          ))}
        </section>

        <button type="submit" className="submit-button">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateNewSpot;
