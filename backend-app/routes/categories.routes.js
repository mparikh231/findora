const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { addCategory, deleteCategory, getCategories, getCategory, updateCategory } = require('../controllers/categories.controller');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', verifyToken, isAdmin, addCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;