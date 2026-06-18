const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  userValidationRules,
  passwordUpdateRules,
  handleValidationErrors,
} = require('../middleware/validation');
const { body } = require('express-validator');

// POST /api/auth/register
router.post('/register', userValidationRules, handleValidationErrors, register);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  handleValidationErrors,
  login
);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

// PUT /api/auth/password
router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    ...passwordUpdateRules,
  ],
  handleValidationErrors,
  updatePassword
);

module.exports = router;
