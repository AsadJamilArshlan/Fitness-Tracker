const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/imageAnalysis');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Expected form field name is "image" according to frontend
router.post('/', protect, upload.single('image'), analyzeImage);

module.exports = router;
