const express = require('express');
const { Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

router.use(restoreUser);


// GET ALL REVIEWS BY CURRENT USER 
router.get('/:userId/reviews', requireAuth, async (req, res) => {
    const { userId } = req.params;
  
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to access these reviews." });
    }
  
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
  
  
  
  module.exports = router;
  