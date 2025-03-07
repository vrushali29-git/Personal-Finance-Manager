import express from 'express';
import { addBill, getBills, updateBillStatus } from '../controllers/billReminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBills)
  .post(addBill);

router.route('/:id/status')
  .patch(updateBillStatus);

export default router;  // Make sure this line is present