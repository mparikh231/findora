const express = require('express');
const router = express.Router();
const { addCity, deleteCity, getCities, getCity, updateCity } = require('../controllers/cities.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', getCities);
router.get('/:id', getCity);
router.post('/', verifyToken, isAdmin, addCity);
router.put('/:id', verifyToken, isAdmin, updateCity);
router.delete('/:id', verifyToken, isAdmin, deleteCity);

module.exports = router;