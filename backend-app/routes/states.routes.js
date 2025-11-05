const express = require('express');
const router = express.Router();
const { addState, deleteState, getState, getStates, updateState } = require('../controllers/states.controller');

router.get('/', getStates);
router.get('/:id', getState);
router.post('/', addState);
router.put('/:id', updateState);
router.delete('/:id', deleteState);

module.exports = router;