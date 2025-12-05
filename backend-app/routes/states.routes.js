const express = require('express');
const router = express.Router();
const { addState, deleteState, getState, getStates, updateState } = require('../controllers/states.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', getStates);
router.get('/:id', getState);
router.post('/', verifyToken, isAdmin, addState);
router.put('/:id', verifyToken, isAdmin, updateState);
router.delete('/:id', verifyToken, isAdmin, deleteState);

module.exports = router;