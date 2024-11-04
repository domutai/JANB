const router = require('express').Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');

router.use(restoreUser);

router.get('/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({ 'XSRF-Token': csrfToken });
  });

router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
      where: {
        username: 'Demo-lition'
      }
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    setTokenCookie(res, user);
    return res.json({ user: user });
  });

// Test route
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
