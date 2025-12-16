const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { addFavourite, removeFavourite, getUserFavourites, getFavouriteCount, checkIsFavourite } = require('../controllers/favourites.controller');

router.get('/check/:listing_id', verifyToken, checkIsFavourite); // Check if a listing is a favourite or not
router.get('/count', verifyToken, getFavouriteCount);  // favourites count
router.get('/', verifyToken, getUserFavourites);   // Get logged-in user's favourites
router.post('/:listing_id', verifyToken, addFavourite);
router.delete('/:listing_id', verifyToken, removeFavourite);

module.exports = router;