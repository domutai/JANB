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
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// router.use('/spots', spotsRouter); INCORRECT
// REMEMBER IT SHOULD BE THE ROUTE AFTER API!

router.use('/users', spotsRouter);


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;