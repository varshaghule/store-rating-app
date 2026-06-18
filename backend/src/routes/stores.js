const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingValidationRules, handleValidationErrors } = require('../middleware/validation');

router.get('/', authenticate, getStores);

router.post(
  '/:storeId/ratings',
  authenticate,
  authorize('user'),
  ratingValidationRules,
  handleValidationErrors,
  submitRating
);

module.exports = router;
