const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth'); 
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  

const { Op } = require('sequelize');
const moment = require('moment');

router.use(restoreUser);

// //DELETE SPOT IMAGE (BEFORE MOCHA)
// router.delete('/:spotImageId', requireAuth, async (req, res) => {
//     const { spotImageId } = req.params;
//     const userId = req.user.id;
  
//     const spotImage = await SpotImage.findByPk(spotImageId, {
//       include: { model: Spot,
//         as: 'spot',
//        }
//     });
  
//     if (!spotImage) {
//       return res.status(404).json({
//         message: "Spot Image couldn't be found"
//       });
//     }
  
//     if (spotImage.spot.ownerId !== userId) {
//       return res.status(403).json({
//         message: "You are not authorized to delete this image"
//       });
//     }
  
//     await spotImage.destroy();
  
//     return res.status(200).json({
//       message: "Successfully deleted"
//     });
//   });

//DELETE SPOT IMAGE (MOCHA: changed endpoint to imageId)
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const spotImage = await SpotImage.findByPk(imageId, {
    include: { model: Spot,
      as: 'spot',
     }
  });

  if (!spotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found"
    });
  }

  if (spotImage.spot.ownerId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to delete this image"
    });
  }

  await spotImage.destroy();

  return res.status(200).json({
    message: "Successfully deleted"
  });
});


  module.exports = router;