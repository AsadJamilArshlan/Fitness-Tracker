const express = require('express');
const router = express.Router();
const { getFoodLogs, createFoodLog, deleteFoodLog } = require('../controllers/foodLog');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getFoodLogs)
  .post(protect, createFoodLog);

router.route('/:id')
  .delete(protect, deleteFoodLog);

module.exports = router;
