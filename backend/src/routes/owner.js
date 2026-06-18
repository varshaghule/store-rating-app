const express = require('express');
const router = express.Router();
const { getMyStoreDashboard } = require('../controllers/ownerController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize('store_owner'), getMyStoreDashboard);

module.exports = router;
