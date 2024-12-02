// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage(/*'Please provide a valid email or username.'*/ 'Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage(/*'Please provide a password.'*/ 'Password is required'),
    handleValidationErrors
  ];

router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      //removed for frontend
      // if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      //   const err = new Error( 'Invalid credentials');
      //   err.status = 401;
      //   return next(err);
      // }

      //added for frontend
      if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.errors = { credential: /*'Valid Email or username is required'*/ 'The provided credentials were invalid' }; // Adding error for credential field
        return next(err);
      }
      //added for frontend
      if (!bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.errors = { password: 'Incorrect password' }; // Adding error for password field
        return next(err);
      }
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

module.exports = router;