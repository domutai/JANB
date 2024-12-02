// import { Link } from 'react-router-dom';
// import './SpotCard.css';

// const SpotCard = ({ spot }) => {
//   return (
//     <Link to={`/spots/${spot.id}`} className="spot-card-link">
//     <div className="spot-card" title={spot.name}>
//       <img src={spot.previewImage} alt={spot.name} className="spot-card-image" />
//       <div className="spot-card-details">
//       <div className="spot-card-header">
//         <h2>{spot.city}, {spot.state}</h2>
//         <span className="spot-rating">⭐ {spot.avgRating || "N/A"}</span>
//         </div>
//         <p> ${spot.price}/night</p>
//       </div>
//     </div>
//     </Link>
//   );
// };

// export default SpotCard;

import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({ spot, showActions = false, onUpdate, onDelete }) => {
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
              <span className="spot-rating">⭐ {spot.avgRating || "N/A"}</span>
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
