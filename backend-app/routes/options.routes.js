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
router.get('/:key', getOption);

// Admin routes - protected
router.get('/', verifyToken, isAdmin, getAllOptions);
router.post('/', verifyToken, isAdmin, createOrUpdateOption);
router.put('/:key', verifyToken, isAdmin, createOrUpdateOption);
router.delete('/:key', verifyToken, isAdmin, deleteOption);

module.exports = router;
