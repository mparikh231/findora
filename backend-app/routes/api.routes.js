const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const profileRoutes = require('./profile.routes');
const listingsRoutes = require('./listings.routes');
const statesRoutes = require('./states.routes');
const citiesRoutes = require('./cities.routes');
const categoriesRoutes = require('./categories.routes');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.use('/auth', authRoutes);
router.use('/users', verifyToken, isAdmin, usersRoutes);
router.use('/profile', verifyToken, profileRoutes);
router.use('/listings', listingsRoutes);
router.use('/states', verifyToken, isAdmin, statesRoutes);
router.use('/cities', verifyToken, citiesRoutes);
router.use('/categories', categoriesRoutes);

module.exports = router;