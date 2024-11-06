const express = require('express');
const { Spot } = require('../../db/models'); 
const { restoreUser } = require('../../utils/auth');
const router = express.Router();


router.use(restoreUser);

// Create a new spot
router.post('/', async (req, res) => {
  try {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

// Validation for required fields
    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
      return res.status(400).json({ message: "Missing required fields" });
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

// Get all spots
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get a spot by ID
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);

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
router.patch('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const updatedSpot = await spot.update(req.body);
    return res.json(updatedSpot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a spot
router.delete('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
