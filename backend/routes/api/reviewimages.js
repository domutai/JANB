const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

const { Op } = require('sequelize');
const moment = require('moment');

router.use(restoreUser);

// DELETE Review Image
router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const { reviewImageId } = req.params;
    const userId = req.user.id;
  
    try {
      // Find the ReviewImage by ID
      const reviewImage = await ReviewImage.findByPk(reviewImageId, {
        include: {
          model: Review,
          as: 'review',
        },
      });
  
      // If the review image is not found, return an error
      if (!reviewImage) {
        return res.status(404).json({
          message: "Review Image couldn't be found",
        });
      }
  
      // Check if the current user is the author of the review or the owner of the review's spot
      if (reviewImage.review.userId !== userId) {
        return res.status(403).json({
          message: "You are not authorized to delete this review image",
        });
      }
  
      // Delete the review image
      await reviewImage.destroy();
  
      return res.status(200).json({
        message: 'Successfully deleted',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  });
  

module.exports = router;