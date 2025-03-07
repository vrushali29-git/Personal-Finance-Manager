import express from 'express';
import { addLoan, getLoans, updateLoanStatus } from '../controllers/loanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLoans)
  .post(addLoan);

router.route('/:id/status')
  .patch(updateLoanStatus);

export default router;