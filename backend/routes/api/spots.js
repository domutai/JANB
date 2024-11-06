const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { restoreUser } = require('../../utils/auth');
const router = express.Router();

router.use(restoreUser);

// Create a new spot
router.post('/api/spots', async (req, res) => {
  try {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Validation for required fields and price validation
    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({ message: "Latitude must be within -90 and 90" });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({ message: "Longitude must be within -180 and 180" });
    }

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
    });

    return res.status(201).json(spot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all spots owned by a specific user
router.get('/api/users/:userId/spots', async (req, res) => {
  try {
    const { userId } = req.params;
    const spots = await Spot.findAll({ where: { ownerId: userId } });
    return res.json({ Spots: spots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get a spot by ID
router.get('/api/spots/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId, {
      include: [{
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
      }]
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    return res.json(spot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update a spot
router.patch('/api/spots/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this spot" });
    }

    const updatedSpot = await spot.update(req.body);
    return res.json(updatedSpot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a spot
router.delete('/api/spots/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this spot" });
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
