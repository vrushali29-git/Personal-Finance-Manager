import express from "express";
import { addTransaction, getTransactions} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Protect all transaction routes

router.route("/")
  .get(getTransactions)
  .post(addTransaction);

export default router;