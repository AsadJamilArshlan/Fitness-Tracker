const express = require('express');
const router = express.Router();
const { getMe, updateUser } = require('../controllers/user');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/:id', protect, updateUser);

module.exports = router;
