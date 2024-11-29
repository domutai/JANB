import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateSpot.css'; 

function UpdateSpot() {
  const { spotId } = useParams(); // Get the spotId from the route params
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
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const navigate = useNavigate();

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data['XSRF-Token']);
        } else {
          console.error('Failed to fetch CSRF token:', response.status);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Fetch spot data and populate the form
  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            country: data.country,
            address: data.address,
            city: data.city,
            state: data.state,
            latitude: data.lat,
            longitude: data.lng,
            description: data.description,
            title: data.name,
            price: data.price,
            previewImage: data.SpotImages?.find(img => img.preview)?.url || '',
            images: data.SpotImages?.filter(img => !img.preview).map(img => img.url) || ['', '', '', ''],
          });
          setLoading(false);
        } else {
          console.error('Failed to fetch spot details');
        }
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    };

    fetchSpotDetails();
  }, [spotId]);

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

    const validationErrors = {};

    // Required fields validation
    if (!formData.country.trim()) validationErrors.country = 'Country is required';
    if (!formData.address.trim()) validationErrors.address = 'Address is required';
    if (!formData.city.trim()) validationErrors.city = 'City is required';
    if (!formData.state.trim()) validationErrors.state = 'State is required';
    if (formData.latitude === '' || isNaN(Number(formData.latitude))) validationErrors.latitude = 'Latitude is required';
    if (formData.longitude === '' || isNaN(Number(formData.longitude))) validationErrors.longitude = 'Longitude is required';
    if (!formData.description.trim() || formData.description.trim().length < 30) {
      validationErrors.description = 'Description needs 30 or more characters';
    }
    if (!formData.title.trim()) validationErrors.title = 'Name is required';
    if (!formData.price) validationErrors.price = 'Price is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data for the backend
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

    try {
      const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        // Redirect to the spot's details page
        navigate(`/spots/${spotId}`);
      } else {
        const data = await response.json();
        console.error('Failed to update spot:', data);
      }
    } catch (error) {
      console.error('Error updating spot:', error);
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading while fetching data

  return (
    <div className="create-spot-container">
      <h1>Update Your Spot</h1>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <section>
          <h2>Where&apos;s your place located?</h2>
          <div className="inline-field-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
          <label>Street Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </section>

        <section>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}

          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </section>

        <section>
          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
          {errors.latitude && <p className="error">{errors.latitude}</p>}

          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
          {errors.longitude && <p className="error">{errors.longitude}</p>}
        </section>

        <section>
          <h2>Describe your place to guests</h2>
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
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          {errors.price && <p className="error">{errors.price}</p>}
        </section>

        <section>
          <h2>Liven up your spot with photos</h2>
          <label>Preview Image URL</label>
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
          />
          {errors.previewImage && <p className="error">{errors.previewImage}</p>}

          <div>
            {formData.images.map((image, index) => (
              <div key={index}>
                <label>Additional Image URL {index + 1}</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                />
                {errors[`image_${index}`] && <p className="error">{errors[`image_${index}`]}</p>}
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="submit-button">Update Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpot;

