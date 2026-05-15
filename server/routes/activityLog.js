const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog, deleteActivityLog } = require('../controllers/activityLog');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getActivityLogs)
  .post(protect, createActivityLog);

router.route('/:id')
  .delete(protect, deleteActivityLog);

module.exports = router;
