//Jeff's Code

const express = require('express');
const { Spot, SpotImage, User, Review } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check, validationResult, query } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation'); 
const { Op } = require('sequelize'); 

const moment = require('moment');

router.use(restoreUser);

//QUERY SPOTS + GET ALL SPOTS
const validatePageSize = (page, size) => {
  const errors = {};
  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.page = 'Page must be greater than or equal to 1';
  }
  if (size && (!Number.isInteger(Number(size)) || Number(size) < 1 || Number(size) > 20)) {
    errors.size = 'Size must be between 1 and 20';
  }
  return errors;
};

// Helper function to validate latitudes and longitudes
const validateLatLng = (minLat, maxLat, minLng, maxLng) => {
  const errors = {};
  if (minLat && isNaN(minLat)) {
    errors.minLat = 'Minimum latitude is invalid';
  }
  if (maxLat && isNaN(maxLat)) {
    errors.maxLat = 'Maximum latitude is invalid';
  }
  if (minLng && isNaN(minLng)) {
    errors.minLng = 'Minimum longitude is invalid';
  }
  if (maxLng && isNaN(maxLng)) {
    errors.maxLng = 'Maximum longitude is invalid';
  }
  return errors;
};

const validatePrice = (minPrice, maxPrice) => {
  const errors = {};
  
  if (minPrice && isNaN(minPrice)) {
    errors.minPrice = 'Minimum price must be greater than or equal to 0';
  } else if (minPrice && parseFloat(minPrice) < 0) {
    errors.minPrice = 'Minimum price must be greater than or equal to 0';
  }

  if (maxPrice && isNaN(maxPrice)) {
    errors.maxPrice = 'Maximum price must be greater than or equal to 0';
  } else if (maxPrice && parseFloat(maxPrice) < 0) {
    errors.maxPrice = 'Maximum price must be greater than or equal to 0';
  }

  return errors;
};

router.get('/', async (req, res) => {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const errors = {
    ...validatePageSize(page, size),
    ...validateLatLng(minLat, maxLat, minLng, maxLng),
    ...validatePrice(minPrice, maxPrice),
  };

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors
    });
  }

  const pageNum = page ? parseInt(page) : 1;
  const pageSize = size ? parseInt(size) : 5;

  try {
    const spotQuery = {
      where: {},
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
    };
    
if (minLat) spotQuery.where.lat = { [Op.gte]: parseFloat(minLat) };
if (maxLat) spotQuery.where.lat = { [Op.lte]: parseFloat(maxLat) };
if (minLng) spotQuery.where.lng = { [Op.gte]: parseFloat(minLng) };
if (maxLng) spotQuery.where.lng = { [Op.lte]: parseFloat(maxLng) };

if (minPrice) spotQuery.where.price = { [Op.gte]: parseFloat(minPrice) };
if (maxPrice) spotQuery.where.price = { [Op.lte]: parseFloat(maxPrice) };

    const spots = await Spot.findAll(spotQuery);

    const formattedSpots = spots.map(spot => {
      const formattedCreatedAt = moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss');
      const formattedUpdatedAt = moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss');

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
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      };
    });

    const response = {
      Spots: formattedSpots,
    };

    if (page || size) {
      response.page = pageNum;
      response.size = pageSize;
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// //GET ALL SPOTS
// router.get('/', async (req, res) => {
//   try {
//     const spots = await Spot.findAll();

//     if (!spots || spots.length === 0) {
//       return res.status(404).json({ message: "No spots found" });
//     }

//     const orderedSpots = spots.map(spot => {

//       const moment = require('moment');
//       const formattedCreatedAt = moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss');
//       const formattedUpdatedAt = moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss');

//       return {
//         id: spot.id,
//         ownerId: spot.ownerId,
//         address: spot.address,
//         city: spot.city,
//         state: spot.state,
//         country: spot.country,
//         lat: spot.lat,
//         lng: spot.lng,
//         name: spot.name,
//         description: spot.description,
//         price: spot.price,
//         createdAt: formattedCreatedAt,
//         updatedAt: formattedUpdatedAt,
//         avgRating: spot.avgRating,
//         previewImage: spot.previewImage,
//       };
//     });

//     return res.status(200).json({ Spots: orderedSpots });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Something went wrong while fetching spots" });
//   }
// });


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


      const moment = require('moment');
      const formattedCreatedAt = moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss');
      const formattedUpdatedAt = moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss');

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
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
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

    
    const moment = require('moment');
    const formattedCreatedAt = moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss');
    const formattedUpdatedAt = moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss');

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
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
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
    
    const moment = require('moment');
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
