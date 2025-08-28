import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import asyncHandler from '../middlewares/asyncHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'loreloom.html'));
  }),
);

export default router;
