import { useState, useEffect } from 'react';
import SpotCard from '../SpotCard/SpotCard';
import './SpotsGrid.css';

function SpotGrid() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    fetch('/api/spots')
      .then(res => res.json())
      .then(data => setSpots(data.Spots || [])) // Access the 'Spots' key
      .catch(err => console.error("Error fetching spots:", err));
  }, []);
  

  return (
    <div className="spot-grid">
    {spots.length === 0 ? (
      <p>No spots available at the moment.</p>
    ) : (
      spots.map(spot => <SpotCard key={spot.id} spot={spot} />)
    )}
  </div>
);
}

export default SpotGrid;
