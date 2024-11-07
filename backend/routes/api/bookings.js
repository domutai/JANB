const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

router.use(restoreUser);

// GET ALL BOOKINGS BY CURRENT USER 
router.get('/:userId/bookings', requireAuth, async (req, res) => {
    const { userId } = req.params;
    
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to access these bookings." });
    }
    
    try {
      const bookings = await Booking.findAll({
        where: { userId }, 
        include: [
          {
            model: Spot,  
            as: 'spot',  
            attributes: [
              'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'
            ],
          }
        ],
      });
  
      const formattedBookings = bookings.map(booking => {
        const moment = require('moment');
        const formattedCreatedAt = moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss');
        const formattedUpdatedAt = moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        return {
          id: booking.id,
          spotId: booking.spotId,
          Spot: booking.spot,  
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: formattedCreatedAt,
          updatedAt: formattedUpdatedAt,
        };
      });
  
      return res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  module.exports = router;
  