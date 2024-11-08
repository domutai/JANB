//Jeff's Code

const express = require('express');
const { Spot, SpotImage, User, Review } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');  

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
          as: 'images', 
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User, 
          as: 'owner', 
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Review,
          as: 'reviews', 
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


// CREATE A NEW SPOT
const moment = require('moment');

const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  try {
    const spot = await Spot.create({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      ownerId: req.user.id  
    });
    
    const formattedCreatedAt = moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss');
    const formattedUpdatedAt = moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss');

    const orderedSpot = {
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
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
    };

    return res.status(201).json(orderedSpot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

//ADD IMAGE TO A SPOT BASED ON SPOT ID
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to add images to this spot"
      });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

//EDIT A SPOT
const spotValidation = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
];

router.patch('/:spotId', requireAuth, spotValidation, handleValidationErrors, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to edit this spot",
      });
    }

    const updatedSpot = await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(200).json(updatedSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


// DELETE A SPOT
router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this spot",
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


module.exports = router;
