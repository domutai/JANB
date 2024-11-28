import { useState, useEffect } from 'react';
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
  const [csrfToken, setCsrfToken] = useState('');
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          console.log('CSRF Token Data:', data); // Debugging
          setCsrfToken(data['XSRF-Token']); // Adjust to match the backend response
        } else {
          console.error('Failed to fetch CSRF token:', response.status);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
  
    fetchCsrfToken();
  }, []);
  

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

    // Log CSRF Token for debugging
  console.log('CSRF Token:', csrfToken);


    const validationErrors = {};

    // Required fields validation
    if (!formData.country.trim()) validationErrors.country = 'Country is required';
    if (!formData.address.trim()) validationErrors.address = 'Address is required';
    if (!formData.city || !formData.city.trim()) validationErrors.city = 'City is required';
    if (!formData.state || !formData.state.trim()) validationErrors.state = 'State is required';
    if (formData.latitude === '' || isNaN(Number(formData.latitude))) validationErrors.latitude = 'Latitude is required';
    if (formData.longitude === '' || isNaN(Number(formData.longitude))) validationErrors.longitude = 'Longitude is required';
    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 30) {
      validationErrors.description = 'Description needs 30 or more characters';
    }
    if (!formData.title.trim()) validationErrors.title = 'Name is required';
    if (!formData.price) validationErrors.price = 'Price is required';
    if (!formData.previewImage.trim()) {
      validationErrors.previewImage = 'Preview image URL is required';
    } else if (!/\.(png|jpg|jpeg)$/i.test(formData.previewImage.trim())) {
      validationErrors.previewImage = 'Image URL needs to end in png or jpg (or jpeg)';
    }

    // Additional images validation
    formData.images.forEach((image, index) => {
      if (image.trim() && !/\.(png|jpg|jpeg)$/i.test(image.trim())) {
        validationErrors[`image_${index}`] = 'Image URL needs to end in png or jpg (or jpeg)';
      }
    });

    // Check if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Map frontend form field names to backend field names
    const backendData = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      lat: formData.latitude,
      lng: formData.longitude,
      name: formData.title,
      description: formData.description,
      price: formData.price,
    };

    // Log backend data for debugging
  console.log('Backend Data:', backendData);

    try {
      // Send the mapped data to the backend with CSRF token in headers
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        const newSpot = await response.json();

        // Step 2: Add the preview image
        try {
          const previewResponse = await fetch(`/api/spots/${newSpot.id}/images`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'csrf-token': csrfToken,
              },
              credentials: 'include',
              body: JSON.stringify({
                  url: formData.previewImage,
                  preview: true,
              }),
          });

          if (!previewResponse.ok) {
              const previewError = await previewResponse.json();
              setErrors((prevErrors) => ({
                  ...prevErrors,
                  previewImage: previewError.message || 'Failed to upload preview image',
              }));
          }
      } catch (error) {
          console.error('Error adding preview image:', error);
      }

      // Step 3: Add additional images
      for (const image of formData.images) {
          if (image.trim()) {
              try {
                  const imageResponse = await fetch(`/api/spots/${newSpot.id}/images`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'csrf-token': csrfToken,
                      },
                      credentials: 'include',
                      body: JSON.stringify({
                          url: image,
                          preview: false, // Additional images are not marked as preview
                      }),
                  });

                  if (!imageResponse.ok) {
                      const imageError = await imageResponse.json();
                      console.error('Error adding image:', imageError.message);
                  }
              } catch (error) {
                  console.error('Error adding image:', error);
              }
          }
      }

      // Redirect to the new spot page
      navigate(`/spots/${newSpot.id}`);
  } else {
      const data = await response.json();
      if (data.errors) {
          const backendErrors = {};
          data.errors.forEach((error) => {
              backendErrors[error.param] = error.msg;
          });
          setErrors(backendErrors);
      }
  }
} catch (error) {
  console.error('Error creating spot:', error);
}
};


  return (
    <div className="create-spot-container">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <section>
          <h2>Where&#39;s your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <div className="inline-field-group">
  <div className="label-error-container">
    <label>Country</label>
    {errors.country && <span className="error-message">{errors.country}</span>}
  </div>
  <input
    type="text"
    name="country"
    value={formData.country}
    onChange={handleChange}
    placeholder="Country"
  />
</div>

<div className="form-row">
  <div className="label-container">
    <label>Street Address</label>
    {errors.address && <p className="error-message">{errors.address}</p>}
  </div>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Address"
  />
</div>

          <div className="inline-fields">
            <label>
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="input-medium"
              />
            </label>
            {errors.city && <p className="error">{errors.city}</p>} 
            <label>
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="input-small"
              />
            </label>
            {errors.state && <p className="error">{errors.state}</p>} 
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
                className="input-small"
              />
            </label>
            {errors.latitude && <p className="error">{errors.latitude}</p>} 
            <label>
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="input-small"
              />
            </label>
            {errors.longitude && <p className="error">{errors.longitude}</p>} 
          </div>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like fast WiFi or parking, and what you love
            about the neighborhood.
          </p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch guests&#39; attention with a spot title that highlights what makes your place special.</p>
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
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
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
            <div key={index}>
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL`}
              />
              {errors[`image_${index}`] && <p className="error">{errors[`image_${index}`]}</p>}
            </div>
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
