//ARIF'S CODE
// const express = require('express');
// const { Spot, SpotImage } = require('../../db/models');
// const { requireAuth, restoreUser } = require('../../utils/auth');
// const router = express.Router();

// router.use(restoreUser);

// // Create a new spot
// router.post('/api/spots', async (req, res) => {
//   try {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body;

//     // Validation for required fields and price validation
//     if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (price <= 0) {
//       return res.status(400).json({ message: "Price must be a positive number" });
//     }

//     if (lat < -90 || lat > 90) {
//       return res.status(400).json({ message: "Latitude must be within -90 and 90" });
//     }

//     if (lng < -180 || lng > 180) {
//       return res.status(400).json({ message: "Longitude must be within -180 and 180" });
//     }

//     const spot = await Spot.create({
//       address,
//       city,
//       state,
//       country,
//       lat,
//       lng,
//       name,
//       description,
//       price,
//     });

//     return res.status(201).json(spot);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// // Get all spots owned by a specific user
// router.get('/users/:userId/spots', requireAuth, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (parseInt(userId) !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to view these spots." });
//     }
//     const spots = await Spot.findAll({ where: { ownerId: userId } });
//     return res.json({ Spots: spots });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// // Get a spot by ID
// router.get('/api/spots/:spotId', async (req, res) => {
//   const { spotId } = req.params;
//   try {
//     const spot = await Spot.findByPk(spotId, {
//       include: [{
//         model: SpotImage,
//         attributes: ['id', 'url', 'preview'],
//       }]
//     });

//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     return res.json(spot);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// // Update a spot
// router.patch('/api/spots/:spotId', async (req, res) => {
//   const { spotId } = req.params;
//   try {
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     // Check if the user is the owner of the spot
//     if (spot.ownerId !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to edit this spot" });
//     }

//     const updatedSpot = await spot.update(req.body);
//     return res.json(updatedSpot);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// // Delete a spot
// router.delete('/api/spots/:spotId', async (req, res) => {
//   const { spotId } = req.params;
//   try {
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     // Check if the user is the owner of the spot
//     if (spot.ownerId !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to delete this spot" });
//     }

//     await spot.destroy();
//     return res.json({ message: "Successfully deleted" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// module.exports = router;


const express = require('express');
const { Spot, SpotImage, User, Review } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

router.use(restoreUser);

//GET ALL SPOTS
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();

    if (!spots || spots.length === 0) {
      return res.status(404).json({ message: "No spots found" });
    }

    const orderedSpots = spots.map(spot => {
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      };
    });

    return res.status(200).json({ Spots: orderedSpots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching spots" });
  }
});


//GET CURRENT USER SPOTS
router.get('/:userId/spots', requireAuth, async (req, res) => {
  const { userId } = req.params;

  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({
      message: "You are not authorized to view this user's spots",
    });
  }

  try {
    const spots = await Spot.findAll({
      where: { ownerId: userId },
    });

    if (!spots || spots.length === 0) {
      return res.status(404).json({ message: "No spots found for this user" });
    }

    const orderedSpots = spots.map(spot => {
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      };
    });

    return res.json({ Spots: orderedSpots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong while fetching spots" });
  }
});


//GET DETAILS OF A SPOT FROM AN ID
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findOne({
      where: { id: spotId },
      include: [
        {
          model: SpotImage,
          as: 'images', // This is the alias you used for SpotImage association
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User, // The owner is a User
          as: 'owner', // Make sure you use the 'owner' alias here
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Review,
          as: 'reviews', // Make sure to reference the correct alias for reviews
          attributes: ['stars'],
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Calculate average star rating
    const numReviews = spot.reviews.length;
    const avgStarRating = numReviews > 0 ? spot.reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews : 0;

    const spotDetails = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews,
      avgStarRating,
      SpotImages: spot.images.map(image => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
      })),
      Owner: {
        id: spot.owner.id,
        firstName: spot.owner.firstName,
        lastName: spot.owner.lastName,
      },
    };

    return res.status(200).json(spotDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});






module.exports = router;
