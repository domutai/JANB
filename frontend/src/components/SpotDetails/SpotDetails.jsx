import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import ReviewModal from '../ReviewModal/ReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import UpdateReviewModal from '../UpdateReviewModal/UpdateReviewModal'; 
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [reviewToUpdate, setReviewToUpdate] = useState(null); // Review to update
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [reviewToDelete, setReviewToDelete] = useState(null); // Review to delete
  const [csrfToken, setCsrfToken] = useState(''); // State for CSRF token
  //const [userLookup, setUserLookup] = useState({}); // UserId to firstName map

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

  useEffect(() => {
    // Fetch the CSRF token
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

  // Fetch user lookup table
  // useEffect(() => {
  //   const fetchUserLookup = async () => {
  //     try {
  //       const response = await fetch('/api/users'); // Adjust this route based on your backend
  //       const data = await response.json();
  //       const lookup = data.Users.reduce((acc, user) => {
  //         acc[user.id] = user.firstName;
  //         return acc;
  //       }, {});
  //       setUserLookup(lookup);
  //     } catch (error) {
  //       console.error("Error fetching user lookup:", error);
  //     }
  //   };

  //   fetchUserLookup();
  // }, []);

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const handleReviewSubmit = async (reviewData) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken, // Include the CSRF token here
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();

      // Attach the logged-in user's name to the review
    const userInfo = {
      id: user.id, // Grab user data from Redux or state
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const newReviewWithUser = { ...newReview, User: userInfo };

      setReviews((prevReviews) => [newReviewWithUser, ...prevReviews]); // Add the new review to the list

      // Calculate the new average rating
      const updatedReviewCount = reviews.length + 1;
      const updatedAvgRating =
        (spot.avgStarRating * reviews.length + newReview.stars) / updatedReviewCount;

      // Update the spot details with new review count and rating
      setSpot((prevSpot) => ({
        ...prevSpot,
        numReviews: updatedReviewCount,
        avgStarRating: updatedAvgRating,
      }));

      setShowModal(false); // Close the modal
    } else {
      const errorData = await response.json();
      console.error('Error submitting review:', errorData);
      throw new Error(errorData.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
  
    try {
      const response = await fetch(`/api/reviews/${reviewToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        // Update the state to remove the deleted review
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewToDelete)
        );
  
        // Update the spot's review count and average rating
        const deletedReview = reviews.find((review) => review.id === reviewToDelete);
        const updatedReviewCount = reviews.length - 1;
        const updatedAvgRating =
          updatedReviewCount > 0
            ? (spot.avgStarRating * reviews.length - deletedReview.stars) /
              updatedReviewCount
            : 0;
  
        setSpot((prevSpot) => ({
          ...prevSpot,
          numReviews: updatedReviewCount,
          avgStarRating: updatedAvgRating,
        }));
  
        setShowDeleteModal(false); // Close the modal
        setReviewToDelete(null); // Reset the review to delete
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleUpdateReview = async (updatedData) => {
    try {
      const response = await fetch(`/api/reviews/${reviewToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedReview = await response.json();

        // Update the reviews state with the updated review
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );

        // Recalculate the average rating
      const updatedReviewList = reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      );
      const totalStars = updatedReviewList.reduce((sum, review) => sum + review.stars, 0);
      const updatedAvgRating = totalStars / updatedReviewList.length;

      // Update the spot's average rating and keep other details intact
      setSpot((prevSpot) => ({
        ...prevSpot,
        avgStarRating: updatedAvgRating,
      }));

      setShowUpdateModal(false); // Close the modal
      setReviewToUpdate(null); // Reset the review state
    } else {
      console.error('Failed to update review');
    }
  } catch (error) {
    console.error('Error updating review:', error);
  }
};

  const isSpotOwner = user && spot?.Owner?.id === user?.id; // Check if the logged-in user is the spot owner

  if (!spot) {
    return <p>Loading spot details...</p>;
  }

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
          {spot.SpotImages?.slice(1, 5)?.map((image) => (
            <img key={image.id} src={image.url} alt="spot" className="additional-image" />
          ))}
        </div>
      </div>

      {/* Spot Info */}
      <div className="spot-info">
        <div className="host-details">
          <h1>Hosted by {spot?.Owner?.firstName || ''} {spot?.Owner?.lastName || ''}</h1>
          <p>{spot.description}</p>
        </div>

        {/* Price and Rating */}
        <div className="price-rating">
          <div className="price-rating-row">
            <p className="price">${spot.price}<span className="per-night"> / night</span></p>
            <p className="rating">
              {spot.numReviews > 0
                ? `⭐ ${spot.avgStarRating.toFixed(2)} • ${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`
                : '⭐ New'}
            </p>
          </div>
          <button className="reserve-btn" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews">
        <h2>Reviews</h2>
        <div className="review-summary">
          <p>
            {spot.numReviews > 0
              ? `⭐ ${spot.avgStarRating.toFixed(2)} • ${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`
              : '⭐ New'}
          </p>
        </div>

        {/* Conditionally render the Post Review button */}
        {!isSpotOwner && user && !reviews.some((review) => review.userId === user.id) && (
          <button className="post-review-btn" onClick={() => setShowModal(true)}>Post Your Review</button>
        )}

        {/* Show each review */}
        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <p><strong>{review.User?.firstName || 'Anonymous'}</strong></p>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p>{review.review}</p>
                {review.userId === user?.id && (
                  <>
                  <button
                    onClick={() => {
                      setReviewToUpdate(review);
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="delete-review-btn"
                    onClick={() => {
                      setReviewToDelete(review.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                  </>
                )}
              </div>
            ))
          ) : (
            !isSpotOwner && <p>Be the first to post a review!</p>
          )}
        </div>
      </div>

      {/* Modal for Posting Review */}
      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Modal for Updating Review */}
      {showUpdateModal && reviewToUpdate && (
        <UpdateReviewModal
          initialReview={reviewToUpdate.review}
          initialStars={reviewToUpdate.stars}
          spotName={spot.name}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateReview}
        />
      )}

      {/* Modal for Deleting Review */}
      {showDeleteModal && (
        <DeleteReviewModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteReview}
        />
      )}
    </div>
  );
};

export default SpotDetails;
