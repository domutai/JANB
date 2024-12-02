// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
// import './ManageSpots.css';

// const ManageSpots = () => {
//   const [spots, setSpots] = useState([]);
//   const [csrfToken, setCsrfToken] = useState('');
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [spotToDelete, setSpotToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         const response = await fetch('/api/csrf/restore', { credentials: 'include' });
//         if (response.ok) {
//           const data = await response.json();
//           setCsrfToken(data['XSRF-Token']);
//         } else {
//           console.error('Failed to fetch CSRF token');
//         }
//       } catch (error) {
//         console.error('Error fetching CSRF token:', error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   useEffect(() => {
//     const fetchSpots = async () => {
//       try {
//         const response = await fetch('/api/spots/current', { credentials: 'include' });
//         if (response.ok) {
//           const data = await response.json();
//           setSpots(data.Spots || []);
//         } else {
//           console.error('Failed to fetch spots');
//         }
//       } catch (error) {
//         console.error('Error fetching spots:', error);
//       }
//     };

//     fetchSpots();
//   }, []);

//   const handleUpdate = (spotId) => {
//     navigate(`/spots/${spotId}/edit`);
//   };

//   const openDeleteModal = (spotId) => {
//     setSpotToDelete(spotId);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSpotToDelete(null);
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await fetch(`/api/spots/${spotToDelete}`, {
//         method: 'DELETE',
//         headers: {
//           'csrf-token': csrfToken,
//         },
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setSpots(spots.filter((spot) => spot.id !== spotToDelete));
//         closeDeleteModal();
//       } else {
//         console.error('Failed to delete the spot');
//       }
//     } catch (error) {
//       console.error('Error deleting the spot:', error);
//     }
//   };

//   return (
//     <div className="manage-spots">
//       <h1>Manage Your Spots</h1>
//       <button className="create-spot-btn" onClick={() => navigate('/spots')}>
//         Create a New Spot
//       </button>
//       <div className="spot-grid">
//         {spots.length === 0 ? (
//           <p>You don&apos;t have any spots listed yet.</p>
//         ) : (
//           spots.map((spot) => (
//             <div key={spot.id} className="spot-card">
//               <img src={spot.previewImage || '/placeholder-image.png'} alt={spot.name} />
//               <div className="spot-info">
//                 <h2>{spot.city}, {spot.state}</h2>
//                 <p>${spot.price} / night</p>
//                 <p>⭐ {spot.avgRating || 'New'}</p>
//               </div>
//               <div className="spot-actions">
//                 <button onClick={() => handleUpdate(spot.id)}>Update</button>
//                 <button onClick={() => openDeleteModal(spot.id)}>Delete</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {showDeleteModal && (
//         <DeleteSpotModal
//           onClose={closeDeleteModal}
//           onDelete={confirmDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default ManageSpots;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotCard from '../SpotCard/SpotCard'; // Reuse SpotCard for consistent layout
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './ManageSpots.css';

const ManageSpots = () => {
  const [spots, setSpots] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf/restore', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data['XSRF-Token']);
        } else {
          console.error('Failed to fetch CSRF token');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots/current', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSpots(data.Spots || []);
        } else {
          console.error('Failed to fetch spots');
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const openDeleteModal = (spotId) => {
    setSpotToDelete(spotId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSpotToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/spots/${spotToDelete}`, {
        method: 'DELETE',
        headers: {
          'csrf-token': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setSpots(spots.filter((spot) => spot.id !== spotToDelete));
        closeDeleteModal();
      } else {
        console.error('Failed to delete the spot');
      }
    } catch (error) {
      console.error('Error deleting the spot:', error);
    }
  };

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      <button
        className="create-spot-btn"
        onClick={() => navigate('/spots')}
      >
        Create a New Spot
      </button>
      <div className="spot-grid">
        {spots.length === 0 ? (
          <p>You don&apos;t have any spots listed yet.</p>
        ) : (
          spots.map((spot) => (
            <div key={spot.id} className="spot-card">
              <SpotCard
                spot={spot}
                showActions
                onUpdate={() => handleUpdate(spot.id)}
                onDelete={() => openDeleteModal(spot.id)}
              />
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <DeleteSpotModal
          onClose={closeDeleteModal}
          onDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default ManageSpots;
