import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews

  const user = useSelector((state) => state.session.user); // Access the logged-in user

  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then(res => res.json())
      .then(data => setSpot(data)) // Directly assign the spot data
      .catch(err => console.error("Error fetching spot details:", err));
  }, [spotId]);

   // Fetch reviews for the spot
   useEffect(() => {
    fetch(`/api/spots/${spotId}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data.Reviews || [])) // Assign reviews from the response
      .catch(err => console.error("Error fetching reviews:", err));
  }, [spotId]);

  if (!spot) {
    return <p>Loading spot details...</p>;
  }

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };


  return (
    <div className="spot-details">
      {/* Spot Info (name, location) */}
      <div className="spot-info-header">
        <h1>{spot.name}</h1>
        <p>{spot.city}, {spot.state}, {spot.country}</p>
      </div>

      {/* Spot Images */}
      <div className="spot-images">
        <img src={spot.SpotImages?.[0]?.url || ''} alt={spot.name} className="main-image" />
        <div className="additional-images">
          {spot.SpotImages?.slice(1, 5)?.map(image => (
            <img key={image.id} src={image.url} alt="spot" className="additional-image" />
          ))}
        </div>
      </div>

      {/* Spot Info */}
      <div className="spot-info">
        <div className="host-details">
          <h1>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h1>
          <p>{spot.description}</p>
        </div>

        {/* Price and Rating */}
        <div className="price-rating">
          <div className="price-rating-row">
            <p className="price">${spot.price}<span className="per-night"> / night</span></p>
            <p className="rating">⭐ {spot.avgStarRating || 0} • {spot.numReviews || 0} reviews</p>
          </div>
          <button className="reserve-btn" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews">
        <h2>Reviews</h2>
        <div className="review-summary">
          <p>⭐ {spot.avgStarRating || 0} • {spot.numReviews || 0} reviews</p>
        </div>

        {/* Show each review */}
        <div className="review-list">
  {reviews.map(review => (
    <div key={review.id} className="review">
      {/* User's first name */}
      <p><strong>{review.User?.firstName || 'Anonymous'}</strong></p>

      {/* Review date */}
      <p className="review-date">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>

      {/* Review comment */}
      <p>{review.review}</p>
    </div>
  ))}
</div>
        
        {/* Conditionally render the Post Review button */}
        {user && (
          <button className="post-review-btn">Post Your Review</button>
        )}
      </div>
    </div>
  );
};

export default SpotDetails;
