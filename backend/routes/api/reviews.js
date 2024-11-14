const express = require('express');
const { Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

const moment = require('moment');

router.use(restoreUser);


// GET ALL REVIEWS BY CURRENT USER (BEFORE MOCHA)
// router.get('/:userId/reviews', requireAuth, async (req, res) => {
//     const { userId } = req.params;
  
//     if (parseInt(userId) !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to access these reviews." });
//     }
  
//     try {
//       const reviews = await Review.findAll({
//         where: { userId },  
//         include: [
//           {
//             model: Spot,  
//             as: 'spot',
//             attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
//           },
//           {
//             model: User,  
//             as: 'user',
//             attributes: ['id', 'firstName', 'lastName'],
//           },
//           {
//             model: ReviewImage,  
//             as: 'reviewImages',
//             attributes: ['id', 'url'],
//           },
//         ],
//       });
  
//       if (reviews.length === 0) {
//         return res.status(404).json({ message: "No reviews found for this user." });
//       }
      
//       const formattedReviews = reviews.map(review => {
//         const moment = require('moment');
//         const formattedCreatedAt = moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss');
//         const formattedUpdatedAt = moment(review.updatedAt).format('YYYY-MM-DD HH:mm:ss');
//         return {
//           id: review.id,
//           userId: review.userId,
//           spotId: review.spotId,
//           review: review.review,
//           stars: review.stars,
//           createdAt: formattedCreatedAt,
//           updatedAt: formattedUpdatedAt,
//           User: review.user,  
//           Spot: review.spot,  
//           ReviewImages: review.reviewImages, 
//         };
//       });
  
//       return res.status(200).json({ Reviews: formattedReviews });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });

// GET ALL REVIEWS BY CURRENT USER (MOCHA: changed endpoint to /current)
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },  
      include: [
        {
          model: Spot,  
          as: 'spot',
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
        },
        {
          model: User,  
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ReviewImage,  
          as: 'reviewImages',
          attributes: ['id', 'url'],
        },
      ],
    });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user." });
    }
    
    const formattedReviews = reviews.map(review => {
      const moment = require('moment');
      const formattedCreatedAt = moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss');
      const formattedUpdatedAt = moment(review.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      return {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        User: review.user,  
        Spot: review.spot,  
        ReviewImages: review.reviewImages, 
      };
    });

    return res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
  
//GET ALL REVIEWS BY SPOT ID (KEEP GETTING SPOT SO CAN'T SOLVE, B4 MOCHA TESTS)
// router.get('/:spotId/reviews', async (req, res) => {
//   const { spotId } = req.params;

//   try {
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//       return res.status(404).json({
//         message: "Spot couldn't be found",
//       });
//     }

//     const reviews = await Review.findAll({
//       where: { spotId: spotId },  
//       include: [
//         {
//           model: User,
//           as: 'user', 
//           attributes: ['id', 'firstName', 'lastName'],
//         },
//         {
//           model: ReviewImage,
//           as: 'reviewImages',
//           attributes: ['id', 'url'],
//         }
//       ],
//       logging: console.log,  
//     });

//     if (reviews.length === 0) {
//       return res.status(404).json({
//         message: "No reviews found for this spot.",
//       });
//     }

//     const formattedReviews = reviews.map(review => {
//       const formattedCreatedAt = moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss');
//       const formattedUpdatedAt = moment(review.updatedAt).format('YYYY-MM-DD HH:mm:ss');

//       return {
//         id: review.id,
//         userId: review.userId,
//         spotId: review.spotId,
//         review: review.review,
//         stars: review.stars,
//         createdAt: formattedCreatedAt,
//         updatedAt: formattedUpdatedAt,
//         User: {
//           id: review.User.id, 
//           firstName: review.User.firstName,
//           lastName: review.User.lastName,
//         },
//         ReviewImages: review.ReviewImages.map(image => ({
//           id: image.id,
//           url: image.url,
//         })),
//       };
//     });

//     return res.status(200).json({ Reviews: formattedReviews });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// });

//GET ALL REVIEWS BY SPOT ID (MOCHA TESTS: changed Users to user and re-wrapped review.reviewImages.map)
// GET ALL REVIEWS BY SPOT ID
router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;

  //console.log("GET request received for spot ID:", spotId);  

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const reviews = await Review.findAll({
      where: { spotId: spotId },
      include: [
        {
          model: User,
          as: 'user',  
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ReviewImage,
          as: 'reviewImages',  
          attributes: ['id', 'url'],
        },
      ],
      //logging: console.log,  
    });

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this spot.",
      });
    }

    const formattedReviews = reviews.map(review => {
      const formattedCreatedAt = moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss');
      const formattedUpdatedAt = moment(review.updatedAt).format('YYYY-MM-DD HH:mm:ss');

      return {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        User: {
          id: review.user.id,
          firstName: review.user.firstName,
          lastName: review.user.lastName,
        },
        ReviewImages: (review.reviewImages || []).map(image => ({
          id: image.id,
          url: image.url,
        })),
      };
    });

    return res.status(200).json({ Reviews: formattedReviews });
  } catch (err) {
    console.error(err);  
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

  
//CREATE REVIEW
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;  

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  }

  const existingReview = await Review.findOne({
    where: { userId, spotId }
  });

  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot"
    });
  }

  const errors = {};
  if (!review) {
    errors.review = "Review text is required";
  }
  if (!stars || stars < 1 || stars > 5 || !Number.isInteger(stars)) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  try {
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars
    });

    const formattedCreatedAt = moment(newReview.createdAt).format('YYYY-MM-DD HH:mm:ss');
    const formattedUpdatedAt = moment(newReview.updatedAt).format('YYYY-MM-DD HH:mm:ss');

    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

//ADD AN IMAGE TO REVIEW ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id; 

  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  }

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to add an image to this review"
    });
  }

  const imageCount = await ReviewImage.count({
    where: { reviewId }
  });
  if (imageCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached"
    });
  }

  if (!url) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { url: "Image URL is required" }
    });
  }

  try {
    const newImage = await ReviewImage.create({
      reviewId,
      url
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

//EDIT REVIEW
router.put('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id; 

  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to edit this review"
    });
  }

  const errors = {};
  if (!review || review.trim().length === 0) {
    errors.review = "Review text is required";
  }
  if (typeof stars !== 'number' || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  try {
    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    const formattedCreatedAt = moment(existingReview.createdAt).format('YYYY-MM-DD HH:mm:ss');
    const formattedUpdatedAt = moment(existingReview.updatedAt).format('YYYY-MM-DD HH:mm:ss');

    return res.status(200).json({
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.spotId,
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

//DELETE REVIEW
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; 

  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to delete this review"
    });
  }

  try {
    await existingReview.destroy();
    return res.status(200).json({
      message: "Successfully deleted"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});


  module.exports = router;
  