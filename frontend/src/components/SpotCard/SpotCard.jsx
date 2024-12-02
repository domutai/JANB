import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({ spot, showActions = false, onUpdate, onDelete }) => {
  // Safely handle avgRating
  const displayRating =
    typeof spot.avgRating === 'number' && spot.avgRating > 0
      ? spot.avgRating.toFixed(1)
      : "New";

  return (
    <div className="spot-card-container">
      {/* Main clickable area links to the spot details */}
      <Link to={`/spots/${spot.id}`} className="spot-card-link">
        <div className="spot-card" title={spot.name}>
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="spot-card-image"
          />
          <div className="spot-card-details">
            <div className="spot-card-header">
              <h2>{spot.city}, {spot.state}</h2>
              <span className="spot-rating">⭐ {displayRating}</span>
            </div>
            <p>${spot.price}/night</p>
          </div>
        </div>
      </Link>

      {/* Conditionally render Update/Delete buttons if showActions is true */}
      {showActions && (
        <div className="spot-card-actions">
          <button onClick={onUpdate} className="spot-card-update-btn">Update</button>
          <button onClick={onDelete} className="spot-card-delete-btn">Delete</button>
        </div>
      )}
    </div>
  );
};

export default SpotCard;
