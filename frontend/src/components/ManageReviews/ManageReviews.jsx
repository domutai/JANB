import { useEffect, useState } from 'react';
import UpdateReviewModal from '../UpdateReviewModal/UpdateReviewModal'; // Import the Update Review Modal
import './ManageReviews.css';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State to show/hide update modal
  const [reviewToUpdate, setReviewToUpdate] = useState(null); // Review being updated
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // Add CSRF token state

  // Fetch reviews on page load
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews/current', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data.Reviews || []);
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

        // Merge the existing Spot data into the updated review
        updatedReview.Spot = reviewToUpdate.Spot;

        // Update the reviews state with the updated review
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );

        setShowUpdateModal(false); // Close the modal
        setReviewToUpdate(null); // Reset the review state
      } else {
        console.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };


  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await fetch(`/api/reviews/${reviewToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken, // Include CSRF token
        },
        credentials: 'include',
      });

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewToDelete));
        setShowDeleteModal(false);
        setReviewToDelete(null);
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="manage-reviews">
      <h1>Manage Reviews</h1>
      {reviews.length === 0 ? (
        <p>You have not written any reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h2>{review.Spot?.name || 'Spot Name Not Available'}</h2>
            <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
            <p className="review-text">{review.review}</p>
            <div className="review-actions">
              <button
                className="update-button"
                onClick={() => {
                    setReviewToUpdate(review); // Set the review to update
                    setShowUpdateModal(true); // Open the update modal
                  }}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  setReviewToDelete(review.id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Update Review Modal */}
      {showUpdateModal && reviewToUpdate && (
        <UpdateReviewModal
          initialReview={reviewToUpdate.review} // Pre-fill review text
          initialStars={reviewToUpdate.stars} // Pre-fill star rating
          spotName={reviewToUpdate.Spot?.name || 'Unknown Spot'} // Display spot name in modal
          onClose={() => setShowUpdateModal(false)} // Close modal
          onUpdate={handleUpdateReview} // Handle review update
        />
      )}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="delete-modal-buttons">
              <button className="confirm-delete" onClick={handleDelete}>
                Yes (Delete Review)
              </button>
              <button
                className="cancel-delete"
                onClick={() => setShowDeleteModal(false)}
              >
                No (Keep Review)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
