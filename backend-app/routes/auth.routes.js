const express = require('express');
const router = express.Router();
const { signIn, signUp } = require('../controllers/auth.controller');

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);

module.exports = router;