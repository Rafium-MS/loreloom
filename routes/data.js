import express from 'express';
import { dataSchema } from '../validation/data.js';
import { readData, writeData } from '../services/db.js';
import asyncHandler from '../middlewares/asyncHandler.js';

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
  }),
);

router.get(
  '/load',
  asyncHandler(async (_req, res) => {
    const data = await readData();
    res.json(data);
  }),
);

router.get(
  '/data.json',
  asyncHandler(async (_req, res) => {
    const data = await readData();
    res.json(data);
  }),
);

export default router;
