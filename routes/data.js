import express from 'express';
import { dataSchema } from '../validation/data.js';
import { readData, writeData } from '../services/db.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

router.post(
  '/save',
  asyncHandler(async (req, res) => {
    const { error, value } = dataSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details });
    }
    await writeData(value);
    res.json({ status: 'ok' });
  }),
);

// Reaproveita o mesmo handler para /load e /data.json
const getDataHandler = asyncHandler(async (_req, res) => {
  const data = await readData();
  res.json(data);
});

router.get('/load', getDataHandler);
router.get('/data.json', getDataHandler);

export default router;
