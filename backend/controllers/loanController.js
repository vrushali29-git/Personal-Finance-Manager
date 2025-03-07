import Loan from '../models/loanModel.js';

export const addLoan = async (req, res) => {
  try {
    const { amount, interestRate, tenure, startDate, description } = req.body;
    
    if (!amount || !interestRate || !tenure) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const loan = await Loan.create({
      userId: req.user.id,
      amount,
      interestRate,
      tenure,
      startDate: startDate || new Date(),
      description
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Error in addLoan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id });
    res.json(loans);
  } catch (error) {
    console.error('Error in getLoans:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    console.error('Error in updateLoanStatus:', error);
    res.status(500).json({ error: error.message });
  }
};