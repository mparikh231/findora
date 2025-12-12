const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const {
    getOption,
    getAllOptions,
    createOrUpdateOption,
    deleteOption
} = require('../controllers/options.controller');

// Public route - for fetching navigation menu on frontend
router.get('/:navigation_menu', getOption);

// Admin routes - protected
router.get('/', verifyToken, isAdmin, getAllOptions);
router.post('/', verifyToken, isAdmin, createOrUpdateOption);
router.put('/:navigation_menu', verifyToken, isAdmin, createOrUpdateOption);
router.delete('/:navigation_menu', verifyToken, isAdmin, deleteOption);

module.exports = router;
