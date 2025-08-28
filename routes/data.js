const express = require('express');
const { dataSchema } = require('../validation/data');
const { readData, writeData } = require('../services/db');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.post(
  '/save',
  asyncHandler(async (req, res) => {
    const { error, value } = dataSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    await writeData(value);
    res.json({ status: 'ok' });
  })
);

router.get(
  '/load',
  asyncHandler(async (_req, res) => {
    const data = await readData();
    res.json(data);
  })
);

router.get(
  '/data.json',
  asyncHandler(async (_req, res) => {
    const data = await readData();
    res.json(data);
  })
);

module.exports = router;
