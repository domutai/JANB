const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

const { Op } = require('sequelize');
const moment = require('moment');

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
  
  //GET ALL BOOKINGS FOR SPOT ID (STILL GETTING ISSUES JUST LIKE SPOTSID/REVIEWS)
  router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id; 
  
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }
  
    const isOwner = spot.ownerId === userId;
  
    let bookings;
    if (isOwner) {
      bookings = await Booking.findAll({
        where: {
          spotId: spot.id
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        }
      });
    } else {
      bookings = await Booking.findAll({
        where: {
          spotId: spot.id
        },
        attributes: ['spotId', 'startDate', 'endDate']
      });
    }
  
    const responseBookings = bookings.map(booking => {
      const formattedBooking = {
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate,
      };
  
      if (isOwner) {
        formattedBooking.User = {
          id: booking.user.id,
          firstName: booking.user.firstName,
          lastName: booking.user.lastName
        };
        formattedBooking.id = booking.id;
        formattedBooking.userId = booking.userId;
        formattedBooking.createdAt = booking.createdAt;
        formattedBooking.updatedAt = booking.updatedAt;
      }
  
      return formattedBooking;
    });
  
    return res.status(200).json({
      Bookings: responseBookings
    });
  });
  

  //CREATE A BOOKING FROM A SPOT ID
  // Middleware to check if user is the owner of the spot
const isSpotOwner = async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({
      message: "You cannot book your own spot",
    });
  }

  req.spot = spot; 
  next(); 
};
router.post('/:spotId/bookings', requireAuth, isSpotOwner, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  const spot = req.spot; 
  const userId = req.user.id;

  const errors = {};

  
  if (!startDate || startDate.trim() === '') {
    errors.startDate = 'startDate is required';
  } else {
    
    const start = moment(startDate);
    if (!start.isValid()) {
      errors.startDate = 'startDate must be a valid date';
    } else if (start.isBefore(moment().startOf('day'))) {
      errors.startDate = 'startDate cannot be in the past';
    }
  }

  if (!endDate || endDate.trim() === '') {
    errors.endDate = 'endDate is required';
  } else {
    const end = moment(endDate);
    if (!end.isValid()) {
      errors.endDate = 'endDate must be a valid date';
    } else if (end.isBefore(moment(startDate))) {
      errors.endDate = 'endDate cannot be on or before startDate';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors,
    });
  }

  const conflictingBookings = await Booking.findAll({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] },
        },
        {
          endDate: { [Op.between]: [startDate, endDate] },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: endDate } },
            { endDate: { [Op.gte]: startDate } },
          ],
        },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
    });
  }

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate,
  });

  const formattedCreatedAt = moment(newBooking.createdAt).format('YYYY-MM-DD HH:mm:ss');
  const formattedUpdatedAt = moment(newBooking.updatedAt).format('YYYY-MM-DD HH:mm:ss');

  return res.status(201).json({
    id: newBooking.id,
    spotId: newBooking.spotId,
    userId: newBooking.userId,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
  });
});

  
  

  
  module.exports = router;
  