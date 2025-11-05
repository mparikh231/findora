const express = require('express');
const router = express.Router();
const { addCity, deleteCity, getCities, getCity, updateCity } = require('../controllers/cities.controller');

router.get('/', getCities);
router.get('/:id', getCity);
router.post('/', addCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

module.exports = router;