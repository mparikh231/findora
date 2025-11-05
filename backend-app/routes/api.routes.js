const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const profileRoutes = require('./profile.routes');
const listingsRoutes = require('./listings.routes');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.use('/auth', authRoutes);
router.use('/users', verifyToken, isAdmin, usersRoutes);
router.use('/profile', verifyToken, profileRoutes);
router.use('/listings', listingsRoutes);

module.exports = router;