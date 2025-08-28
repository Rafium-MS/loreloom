const express = require('express');
const path = require('path');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'loreloom.html'));
  }),
);

module.exports = router;
