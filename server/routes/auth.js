const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

router.post('/local/register', register);
router.post('/local', login);

module.exports = router;
