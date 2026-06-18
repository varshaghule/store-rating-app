const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  userValidationRules,
  storeValidationRules,
  handleValidationErrors,
} = require('../middleware/validation');
const { body } = require('express-validator');

const adminOnly = [authenticate, authorize('admin')];

router.get('/dashboard', ...adminOnly, getDashboardStats);
router.get('/users', ...adminOnly, getUsers);
router.get('/users/:id', ...adminOnly, getUserById);
router.post('/users', ...adminOnly, userValidationRules, handleValidationErrors, createUser);
router.get('/stores', ...adminOnly, getStores);
router.post(
  '/stores',
  ...adminOnly,
  [
    ...storeValidationRules,
    body('ownerId').optional().isInt().withMessage('Owner ID must be an integer'),
  ],
  handleValidationErrors,
  createStore
);

module.exports = router;
