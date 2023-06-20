const express = require('express');
const router = express.Router();
const { auth, adminCheck } = require('../middleware/auth')

const { createImage, removeImage } = require('../controllers/cloudinary')

router.post('/images', auth, adminCheck, createImage);
router.post('/removeimages', auth, adminCheck, removeImage);


module.exports = router;
