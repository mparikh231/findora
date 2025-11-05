const express = require('express');
const router = express.Router();
const apiRoutes = require('./api.routes');

router.use('/api/v1', apiRoutes);

module.exports = router;
