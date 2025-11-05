const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');

router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

module.exports = router;