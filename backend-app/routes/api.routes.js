const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const profileRoutes = require('./profile.routes');
const listingsRoutes = require('./listings.routes');
const statesRoutes = require('./states.routes');
const citiesRoutes = require('./cities.routes');
const categoriesRoutes = require('./categories.routes');
const optionsRoutes = require('./options.routes');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.use('/auth', authRoutes);
router.use('/users', verifyToken, isAdmin, usersRoutes);
router.use('/profile', verifyToken, profileRoutes);
router.use('/listings', listingsRoutes);
router.use('/states', statesRoutes);
router.use('/cities', citiesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/options', optionsRoutes);

module.exports = router;