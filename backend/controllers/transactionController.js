import Transaction from "../models/transactionModel.js";

export const addTransaction = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    const { type, amount, description, date } = req.body;
    
    if (!type || !amount || !description) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      description,
      date: date || Date.now()
    });

    console.log('Transaction created:', transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error in addTransaction:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user.id);
    const transactions = await Transaction.find({ userId: req.user.id });
    console.log('Found transactions:', transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted", transaction });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ error: error.message });
  }
};