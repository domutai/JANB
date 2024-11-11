//TEST CODE FROM AUTHENTICATE ME
// const router = require('express').Router();
// const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// const bcrypt = require('bcryptjs');

// router.use(restoreUser);

// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//     setTokenCookie(res, user);
//     return res.json({ user: user });
//   });

//   // GET /api/restore-user

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/require-auth
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // Test route
// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });

// module.exports = router;

// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const spotImagesRouter = require('./spotimages.js');
const reviewImagesRouter = require('./reviewimages.js');

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/users', spotsRouter);

router.use('/spots', spotsRouter);

router.use('/users', reviewsRouter);

router.use('/spots', reviewsRouter);

router.use('/reviews', reviewsRouter);

router.use('/users', bookingsRouter);

router.use('/spots', bookingsRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImagesRouter); //changed for MOCHA TEST from spotImages to spot-images

router.use('/review-images', reviewImagesRouter); //changed for MOCHA TEST from reviewImages to review-images

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;