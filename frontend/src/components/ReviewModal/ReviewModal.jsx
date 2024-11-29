import { useState } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0); // Added for hover functionality
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(''); // Backend error state

  const handleSubmit = async () => {
    const validationErrors = {};
    if (review.length < 10) validationErrors.review = "Review must be at least 10 characters.";
    if (stars === 0) validationErrors.stars = "You must select a star rating.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
    // Pass the review and stars back to the parent component
    await onSubmit({ review, stars });

    // Reset the modal state and close
    setReview('');
    setStars(0);
    setErrors({});
    setBackendError('');
    onClose();
} catch (error) {
    // Capture and display backend errors
    setBackendError(error.message || 'An unexpected error occurred.');
}
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>How was your stay?</h2>
        {/* Show backend error if present */}
        {backendError && <p className="backend-error">{backendError}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        {errors.review && <p className="error">{errors.review}</p>}

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={hoveredStars >= star || stars >= star ? 'star filled' : 'star'}
              onClick={() => setStars(star)} // Set permanent stars
              onMouseEnter={() => setHoveredStars(star)} // Hover state
              onMouseLeave={() => setHoveredStars(0)} // Reset hover state
            >
              ★
            </span>
          ))}
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}

        <button
          className="submit-review-btn"
          disabled={review.length < 10 || stars === 0}
          onClick={handleSubmit}
        >
          Submit Your Review
        </button>
        <button className="close-modal-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ReviewModal;
