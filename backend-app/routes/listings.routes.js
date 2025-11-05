const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getListings, getListing, addListing, deleteListing, updateListing } = require('../controllers/listings.controller');

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', verifyToken, addListing);
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);

module.exports = router;